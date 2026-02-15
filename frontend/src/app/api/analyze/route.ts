import Anthropic from "@anthropic-ai/sdk";
import { fetchRepoContent } from "@/lib/github";
import { PASS_DEFINITIONS, getPassPrompt } from "@/lib/prompts";

export const maxDuration = 300; // Vercel Pro: 5 min

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
  const url: string | undefined = body?.url;

  if (!url || typeof url !== "string") {
    return Response.json({ detail: "url is required" }, { status: 400 });
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
        // Fetch repo content from GitHub
        const repoContent = await fetchRepoContent(url);

        write(
          sseLine("analysis_start", {
            message: `Starting analysis of ${repoContent.repo_name}`,
            total_passes: PASS_DEFINITIONS.length,
          })
        );

        const client = new Anthropic({ apiKey });

        // Fire ALL passes in parallel
        const promises = PASS_DEFINITIONS.map(async (def, i) => {
          const passNumber = i + 1;
          const startTime = Date.now();

          try {
            const prompt = getPassPrompt(i, repoContent);
            const response = await client.messages.create({
              model: MODEL,
              max_tokens: 4096,
              messages: [{ role: "user", content: prompt }],
            });

            const rawText =
              response.content[0].type === "text"
                ? response.content[0].text
                : "";
            const cleaned = cleanJson(rawText);
            const parsed = JSON.parse(cleaned);
            const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
            const reasoning = parsed.reasoning_steps || [];

            write(
              sseLine("pass_complete", {
                pass_name: def.name,
                pass_number: passNumber,
                data: parsed,
                reasoning,
                message: `${def.title} complete (${elapsed}s)`,
                elapsed: Number(elapsed),
              })
            );
          } catch (err) {
            const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

            if (err instanceof SyntaxError) {
              write(
                sseLine("pass_complete", {
                  pass_name: def.name,
                  pass_number: passNumber,
                  data: { error: `JSON parse error: ${err.message}` },
                  reasoning: [],
                  message: `${def.title} completed with parse warning (${elapsed}s)`,
                })
              );
            } else {
              write(
                sseLine("error", {
                  pass_name: def.name,
                  pass_number: passNumber,
                  message: `Error in ${def.title}: ${err instanceof Error ? err.message : String(err)}`,
                })
              );
            }
          }
        });

        await Promise.allSettled(promises);

        write(sseLine("done", { message: "Analysis complete" }));
      } catch (err) {
        write(
          sseLine("error", {
            message: `Analysis failed: ${err instanceof Error ? err.message : String(err)}`,
          })
        );
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
