import json
import re
import time
from typing import AsyncGenerator

import anthropic

from app.config import settings
from app.models.discovery_schemas import DiscoveryRequest
from app.prompts.discovery import get_discovery_prompt


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


async def run_discovery(
    request: DiscoveryRequest,
) -> AsyncGenerator[dict, None]:
    """Run discovery, yielding SSE event dicts."""
    client = anthropic.Anthropic(api_key=settings.anthropic_api_key)

    yield _make_event(
        "discovery_start",
        message="Searching for matching open source projects...",
    )

    yield _make_event(
        "discovery_thinking",
        message="Analyzing your requirements and finding the best matches...",
    )

    start_time = time.time()

    try:
        prompt = get_discovery_prompt(request)

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
            "discovery_complete",
            data=parsed,
            reasoning=reasoning,
            message=f"Found {len(parsed.get('recommendations', []))} recommendations ({elapsed}s)",
            elapsed=elapsed,
        )

    except json.JSONDecodeError as e:
        yield _make_event(
            "error",
            message=f"Failed to parse recommendations: {str(e)}",
        )

    except Exception as e:
        yield _make_event(
            "error",
            message=f"Discovery error: {str(e)}",
        )

    yield _make_event("done", message="Discovery complete")
