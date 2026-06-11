import { GoogleGenAI } from "@google/genai";
import {
  buildImagePrompt,
  NUM_IMAGE_CONCEPTS,
  type LogoImageBrief,
} from "@/lib/logo-image";

export const runtime = "nodejs";
export const maxDuration = 120;

// "Nano Banana" (Gemini image model). Override via env if you want Nano Banana 2
// (gemini-3.1-flash-image) or Pro (gemini-3-pro-image).
const IMAGE_MODEL = process.env.GEMINI_IMAGE_MODEL ?? "gemini-2.5-flash-image";

interface ImageBody extends Partial<LogoImageBrief> {
  // Aliases accepted from the client form.
  style?: string;
  logoType?: string;
  colorMood?: string;
}

/** Generates one logo image; returns a PNG data URL or null on failure. */
async function generateOne(
  ai: GoogleGenAI,
  brief: LogoImageBrief,
  index: number,
): Promise<string | null> {
  try {
    const response = await ai.models.generateContent({
      model: IMAGE_MODEL,
      contents: buildImagePrompt(brief, index),
      config: { responseModalities: ["IMAGE"] },
    });
    const parts = response.candidates?.[0]?.content?.parts ?? [];
    for (const part of parts) {
      const data = part.inlineData?.data;
      if (data) {
        const mime = part.inlineData?.mimeType ?? "image/png";
        return `data:${mime};base64,${data}`;
      }
    }
    return null;
  } catch (error) {
    console.error(`logo-image concept ${index} error:`, error);
    return null;
  }
}

export async function POST(req: Request) {
  let body: ImageBody;
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

  if (!process.env.GEMINI_API_KEY) {
    return Response.json(
      { error: "Server belum dikonfigurasi: GEMINI_API_KEY belum di-set." },
      { status: 500 },
    );
  }

  const brief: LogoImageBrief = {
    businessName,
    niche: body.niche?.trim() || "Umum",
    description,
    target: body.target,
    styleId: body.style ?? body.styleId,
    typeId: body.typeId ?? body.logoType,
    colorId: body.colorId ?? body.colorMood,
    notes: body.notes,
  };

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const results = await Promise.all(
    Array.from({ length: NUM_IMAGE_CONCEPTS }, (_, i) =>
      generateOne(ai, brief, i),
    ),
  );
  const logos = results.filter((r): r is string => r !== null);

  if (logos.length === 0) {
    return Response.json(
      { error: "Gagal membuat logo gambar — coba lagi atau ganti brief." },
      { status: 502 },
    );
  }
  return Response.json({ logos: logos.map((image) => ({ image })) });
}
