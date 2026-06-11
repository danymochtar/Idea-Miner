import Anthropic from "@anthropic-ai/sdk";
import {
  buildRefinePrompt,
  buildUserPrompt,
  CONTENT_TYPES,
  LANGUAGE_STYLES,
  REFINE_ACTIONS,
  SYSTEM_PROMPT,
  type GenerateRequest,
} from "@/lib/content-types";

interface GenerateBody extends Partial<GenerateRequest> {
  // Refine mode: tweak an already-generated result.
  refine?: string; // a REFINE_ACTIONS id
  previousOutput?: string;
}

export const runtime = "nodejs";
// Vercel: allow long generations (requires Fluid Compute / Pro for >60s)
export const maxDuration = 300;

// Gateway model ids use the "creator/model" format (dotted version).
const MODEL = process.env.AI_MODEL ?? "anthropic/claude-opus-4.8";

// Routed through Vercel AI Gateway (Anthropic Messages API-compatible endpoint).
// Constructed lazily so a missing key returns a clean 500 instead of crashing
// the route module at import time (the SDK throws when apiKey is undefined).
function getClient(): Anthropic {
  return new Anthropic({
    apiKey: process.env.AI_GATEWAY_API_KEY,
    baseURL: process.env.AI_GATEWAY_BASE_URL ?? "https://ai-gateway.vercel.sh",
  });
}

function jsonError(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

const badRequest = (message: string) => jsonError(message, 400);

// Maps an error thrown after the stream has started (headers already sent) to a
// friendly inline message — the only channel left is the response body.
function inlineErrorMessage(error: unknown): string {
  if (error instanceof Anthropic.AuthenticationError) {
    return "\n\n[Gagal autentikasi ke AI Gateway — periksa AI_GATEWAY_API_KEY.]";
  }
  if (error instanceof Anthropic.NotFoundError) {
    return `\n\n[Model "${MODEL}" tidak ditemukan di AI Gateway — set env AI_MODEL ke model yang tersedia.]`;
  }
  if (error instanceof Anthropic.RateLimitError) {
    return "\n\n[Sistem sedang sibuk — coba lagi sebentar.]";
  }
  return "\n\n[Terjadi kesalahan saat membuat konten — coba lagi.]";
}

export async function POST(req: Request) {
  let body: GenerateBody;
  try {
    body = await req.json();
  } catch {
    return badRequest("Body harus berupa JSON.");
  }

  let userPrompt: string;

  if (body.refine) {
    // ---- Refine mode ----
    const action = REFINE_ACTIONS.find((a) => a.id === body.refine);
    if (!action) return badRequest("Aksi refine tidak valid.");
    if (!body.previousOutput?.trim()) {
      return badRequest("Tidak ada konten untuk direvisi.");
    }
    if (body.previousOutput.length > 40000) {
      return badRequest("Konten terlalu panjang untuk direvisi.");
    }
    userPrompt = buildRefinePrompt(
      body.previousOutput.trim(),
      action.instruction,
    );
  } else {
    // ---- Generate mode ----
    const { businessName, niche, description, tone, contentType, language } =
      body;
    if (!businessName?.trim()) return badRequest("Nama usaha wajib diisi.");
    if (!description?.trim()) return badRequest("Deskripsi usaha wajib diisi.");
    if (!CONTENT_TYPES.some((c) => c.id === contentType)) {
      return badRequest("Jenis konten tidak valid.");
    }
    if (businessName.length > 200 || description.length > 2000) {
      return badRequest("Input terlalu panjang.");
    }
    userPrompt = buildUserPrompt({
      businessName: businessName.trim(),
      niche: niche?.trim() || "Umum",
      description: description.trim(),
      tone: tone?.trim() || "Santai & Friendly",
      contentType: contentType!,
      language: LANGUAGE_STYLES.some((l) => l.id === language)
        ? language!
        : "santai",
    });
  }

  if (!process.env.AI_GATEWAY_API_KEY) {
    return jsonError(
      "Server belum dikonfigurasi: AI_GATEWAY_API_KEY belum di-set.",
      500,
    );
  }

  const stream = getClient().messages.stream({
    model: MODEL,
    max_tokens: 64000,
    system: [
      {
        type: "text",
        text: SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [{ role: "user", content: userPrompt }],
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        controller.close();
      } catch (error) {
        // Headers are already sent, so surface the problem inline rather than
        // erroring the stream (which would only show a generic browser error).
        console.error("generate stream error:", error);
        controller.enqueue(encoder.encode(inlineErrorMessage(error)));
        controller.close();
      }
    },
    cancel() {
      stream.abort();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
