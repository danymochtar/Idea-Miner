import Anthropic from "@anthropic-ai/sdk";
import {
  buildLogoPrompt,
  extractConcepts,
  LOGO_STYLES,
  LOGO_SYSTEM_PROMPT,
} from "@/lib/logo";

export const runtime = "nodejs";
export const maxDuration = 300;

// Logos benefit from the most capable model + design reasoning. Configurable
// separately from the content model (e.g. AI_LOGO_MODEL=anthropic/claude-fable-5).
const MODEL =
  process.env.AI_LOGO_MODEL ??
  process.env.AI_MODEL ??
  "anthropic/claude-opus-4.8";

function getClient(): Anthropic {
  return new Anthropic({
    apiKey: process.env.AI_GATEWAY_API_KEY,
    baseURL: process.env.AI_GATEWAY_BASE_URL ?? "https://ai-gateway.vercel.sh",
  });
}

interface LogoBody {
  businessName?: string;
  niche?: string;
  description?: string;
  target?: string;
  style?: string;
  logoType?: string;
  colorMood?: string;
  notes?: string;
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
  const description = body.description?.trim();
  if (!description) {
    return Response.json(
      { error: "Deskripsi usaha wajib diisi." },
      { status: 400 },
    );
  }
  if (businessName.length > 200 || description.length > 2000) {
    return Response.json({ error: "Input terlalu panjang." }, { status: 400 });
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
    // Streaming + finalMessage avoids the SDK's large-max_tokens timeout guard.
    // output_config (effort) is a valid Messages API field; cast around SDK types.
    const stream = getClient().messages.stream({
      model: MODEL,
      max_tokens: 32000,
      // Let the model reason about brand meaning/composition before drawing —
      // the biggest quality lever for "ciamik & filosofis" logos.
      thinking: { type: "adaptive" },
      output_config: { effort: "high" },
      system: LOGO_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: buildLogoPrompt({
            businessName,
            niche: body.niche?.trim() || "Umum",
            description,
            target: body.target,
            styleHint: `${style.label} — ${style.hint}`,
            typeId: body.logoType,
            colorId: body.colorMood,
            notes: body.notes,
          }),
        },
      ],
    } as Parameters<Anthropic["messages"]["stream"]>[0]);

    const message = await stream.finalMessage();
    const text = message.content
      .filter((b) => b.type === "text")
      .map((b) => (b as { text: string }).text)
      .join("\n");

    const logos = extractConcepts(text);
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
