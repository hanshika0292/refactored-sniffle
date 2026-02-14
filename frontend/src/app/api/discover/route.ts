import Anthropic from "@anthropic-ai/sdk";
import { getDiscoveryPrompt } from "@/lib/prompts";

export const maxDuration = 120; // Single Claude call

const MODEL = process.env.MODEL_NAME || "claude-sonnet-4-5-20250929";

function cleanJson(text: string): string {
  let t = text.trim();
  t = t.replace(/^```(?:json)?\s*\n?/, "");
  t = t.replace(/\n?```\s*$/, "");
  return t.trim();
}

function sseLine(eventType: string, payload: Record<string, unknown>): string {
  return `data:${JSON.stringify({ event_type: eventType, ...payload })}\n\n`;
}

export async function POST(request: Request) {
  const body = await request.json();
  const { query, filters, max_results } = body || {};

  if (!query || typeof query !== "string" || query.length < 10) {
    return Response.json(
      { detail: "query must be at least 10 characters" },
      { status: 400 }
    );
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json(
      { detail: "ANTHROPIC_API_KEY not configured" },
      { status: 500 }
    );
  }

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      const write = (chunk: string) => controller.enqueue(encoder.encode(chunk));

      try {
        write(
          sseLine("discovery_start", {
            message: "Searching for matching open source projects...",
          })
        );

        write(
          sseLine("discovery_thinking", {
            message:
              "Analyzing your requirements and finding the best matches...",
          })
        );

        const startTime = Date.now();
        const client = new Anthropic({ apiKey });

        const prompt = getDiscoveryPrompt({
          query,
          filters: filters || {},
          max_results: max_results || 5,
        });

        const response = await client.messages.create({
          model: MODEL,
          max_tokens: 4096,
          messages: [{ role: "user", content: prompt }],
        });

        const rawText =
          response.content[0].type === "text" ? response.content[0].text : "";
        const cleaned = cleanJson(rawText);
        const parsed = JSON.parse(cleaned);
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        const reasoning = parsed.reasoning_steps || [];

        write(
          sseLine("discovery_complete", {
            data: parsed,
            reasoning,
            message: `Found ${(parsed.recommendations || []).length} recommendations (${elapsed}s)`,
            elapsed: Number(elapsed),
          })
        );

        write(sseLine("done", { message: "Discovery complete" }));
      } catch (err) {
        if (err instanceof SyntaxError) {
          write(
            sseLine("error", {
              message: `Failed to parse recommendations: ${err.message}`,
            })
          );
        } else {
          write(
            sseLine("error", {
              message: `Discovery error: ${err instanceof Error ? err.message : String(err)}`,
            })
          );
        }
        write(sseLine("done", { message: "Discovery complete" }));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
