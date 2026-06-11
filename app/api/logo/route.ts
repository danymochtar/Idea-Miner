import Anthropic from "@anthropic-ai/sdk";
import {
  buildLogoPrompt,
  extractSafeSvgs,
  LOGO_STYLES,
  LOGO_SYSTEM_PROMPT,
} from "@/lib/logo";

export const runtime = "nodejs";
export const maxDuration = 120;

const MODEL = process.env.AI_MODEL ?? "anthropic/claude-opus-4.8";

function getClient(): Anthropic {
  return new Anthropic({
    apiKey: process.env.AI_GATEWAY_API_KEY,
    baseURL: process.env.AI_GATEWAY_BASE_URL ?? "https://ai-gateway.vercel.sh",
  });
}

interface LogoBody {
  businessName?: string;
  niche?: string;
  style?: string;
}

export async function POST(req: Request) {
  let body: LogoBody;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Body harus berupa JSON." }, { status: 400 });
  }

  const businessName = body.businessName?.trim();
  if (!businessName) {
    return Response.json({ error: "Nama usaha wajib diisi." }, { status: 400 });
  }
  if (businessName.length > 200) {
    return Response.json({ error: "Nama usaha terlalu panjang." }, { status: 400 });
  }

  const style =
    LOGO_STYLES.find((s) => s.id === body.style) ?? LOGO_STYLES[0];

  if (!process.env.AI_GATEWAY_API_KEY) {
    return Response.json(
      { error: "Server belum dikonfigurasi: AI_GATEWAY_API_KEY belum di-set." },
      { status: 500 },
    );
  }

  try {
    const message = await getClient().messages.create({
      model: MODEL,
      max_tokens: 12000,
      system: LOGO_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: buildLogoPrompt(
            businessName,
            body.niche?.trim() || "Umum",
            `${style.label} — ${style.hint}`,
          ),
        },
      ],
    });

    const text = message.content
      .filter((b) => b.type === "text")
      .map((b) => (b as { text: string }).text)
      .join("\n");

    const logos = extractSafeSvgs(text);
    if (logos.length === 0) {
      return Response.json(
        { error: "Gagal membuat logo — coba lagi atau ganti gaya." },
        { status: 422 },
      );
    }
    return Response.json({ logos });
  } catch (error) {
    console.error("logo generation error:", error);
    if (error instanceof Anthropic.AuthenticationError) {
      return Response.json(
        { error: "Gagal autentikasi ke AI Gateway — periksa AI_GATEWAY_API_KEY." },
        { status: 502 },
      );
    }
    if (error instanceof Anthropic.NotFoundError) {
      return Response.json(
        { error: `Model "${MODEL}" tidak ditemukan — set env AI_MODEL.` },
        { status: 502 },
      );
    }
    return Response.json(
      { error: "Terjadi kesalahan saat membuat logo — coba lagi." },
      { status: 502 },
    );
  }
}
