import Anthropic from "@anthropic-ai/sdk";
import {
  buildUserPrompt,
  CONTENT_TYPES,
  SYSTEM_PROMPT,
  type GenerateRequest,
} from "@/lib/content-types";

export const runtime = "nodejs";
// Vercel: allow long generations (requires Fluid Compute / Pro for >60s)
export const maxDuration = 300;

const client = new Anthropic();

function badRequest(message: string) {
  return Response.json({ error: message }, { status: 400 });
}

export async function POST(req: Request) {
  let body: GenerateRequest;
  try {
    body = await req.json();
  } catch {
    return badRequest("Body harus berupa JSON.");
  }

  const { businessName, niche, description, tone, contentType } = body;
  if (!businessName?.trim()) return badRequest("Nama usaha wajib diisi.");
  if (!description?.trim()) return badRequest("Deskripsi usaha wajib diisi.");
  if (!CONTENT_TYPES.some((c) => c.id === contentType)) {
    return badRequest("Jenis konten tidak valid.");
  }
  if (businessName.length > 200 || description.length > 2000) {
    return badRequest("Input terlalu panjang.");
  }

  const stream = client.messages.stream({
    model: "claude-opus-4-8",
    max_tokens: 64000,
    thinking: { type: "adaptive" },
    system: [
      {
        type: "text",
        text: SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [
      {
        role: "user",
        content: buildUserPrompt({
          businessName: businessName.trim(),
          niche,
          description: description.trim(),
          tone,
          contentType,
        }),
      },
    ],
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
        if (error instanceof Anthropic.RateLimitError) {
          controller.enqueue(
            encoder.encode("\n\n[Sistem sedang sibuk — coba lagi sebentar.]"),
          );
          controller.close();
        } else {
          controller.error(error);
        }
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
