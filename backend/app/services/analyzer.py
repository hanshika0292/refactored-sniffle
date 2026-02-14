import json
import re
import time
from typing import AsyncGenerator

import anthropic

from app.config import settings
from app.models.schemas import RepoContent
from app.prompts.passes import PASS_DEFINITIONS, get_pass_prompt


def _clean_json(text: str) -> str:
    """Strip markdown fences and extract JSON."""
    text = text.strip()
    text = re.sub(r"^```(?:json)?\s*\n?", "", text)
    text = re.sub(r"\n?```\s*$", "", text)
    return text.strip()


def _make_event(event_type: str, **kwargs) -> dict:
    """Create an SSE event dict for sse-starlette."""
    payload = {"event_type": event_type, **kwargs}
    return {"data": json.dumps(payload)}


async def run_analysis_pipeline(
    repo_content: RepoContent,
) -> AsyncGenerator[dict, None]:
    """Run 6-pass analysis pipeline, yielding SSE event dicts."""
    client = anthropic.Anthropic(api_key=settings.anthropic_api_key)

    yield _make_event(
        "analysis_start",
        message=f"Starting analysis of {repo_content.repo_name}",
        total_passes=len(PASS_DEFINITIONS),
    )

    for i, definition in enumerate(PASS_DEFINITIONS):
        pass_name = definition["name"]
        pass_title = definition["title"]
        pass_number = i + 1

        yield _make_event(
            "pass_start",
            pass_name=pass_name,
            pass_number=pass_number,
            message=f"Running {pass_title}...",
        )

        start_time = time.time()

        try:
            prompt = get_pass_prompt(i, repo_content)

            response = client.messages.create(
                model=settings.model_name,
                max_tokens=4096,
                messages=[{"role": "user", "content": prompt}],
            )

            raw_text = response.content[0].text
            cleaned = _clean_json(raw_text)
            parsed = json.loads(cleaned)
            elapsed = round(time.time() - start_time, 1)

            reasoning = parsed.get("reasoning_steps", [])

            yield _make_event(
                "pass_complete",
                pass_name=pass_name,
                pass_number=pass_number,
                data=parsed,
                reasoning=reasoning,
                message=f"{pass_title} complete ({elapsed}s)",
                elapsed=elapsed,
            )

        except json.JSONDecodeError as e:
            yield _make_event(
                "pass_complete",
                pass_name=pass_name,
                pass_number=pass_number,
                data={"error": f"JSON parse error: {str(e)}", "raw": raw_text[:500]},
                reasoning=[],
                message=f"{pass_title} completed with parse warning",
            )

        except Exception as e:
            yield _make_event(
                "error",
                pass_name=pass_name,
                pass_number=pass_number,
                message=f"Error in {pass_title}: {str(e)}",
            )

    yield _make_event("done", message="Analysis complete")
