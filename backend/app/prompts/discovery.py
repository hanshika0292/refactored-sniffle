from app.models.discovery_schemas import DiscoveryRequest

DISCOVERY_PROMPT = """You are an expert open source advisor. A user is looking for open source projects that match their needs.

Analyze their request and recommend real, existing GitHub repositories. Only recommend repositories you are confident actually exist on GitHub.

User's Query:
{query}

Filters:
- Preferred Languages: {languages}
- Domain/Category: {domain}
- Scale/Size: {scale}
- License Preference: {license_preference}
- Actively Maintained Only: {actively_maintained}

Number of recommendations requested: {max_results}

Respond with ONLY valid JSON matching this exact structure:
{{
  "reasoning_steps": ["step 1 of your analysis...", "step 2...", "step 3..."],
  "query_interpretation": "One sentence summarizing what the user is looking for",
  "summary": "A brief paragraph about the recommendations and how they fit the user's needs",
  "recommendations": [
    {{
      "rank": 1,
      "repo_name": "owner/repo",
      "github_url": "https://github.com/owner/repo",
      "stars": 15000,
      "language": "Primary language",
      "license": "MIT",
      "description": "What this project does",
      "reasoning": "Why this is a good match for the user's query",
      "strengths": ["Strength 1", "Strength 2", "Strength 3"],
      "considerations": ["Thing to be aware of 1", "Thing to be aware of 2"],
      "match_score": 92,
      "tags": ["tag1", "tag2", "tag3"]
    }}
  ]
}}

Important:
- Only recommend real repositories that exist on GitHub
- match_score should be 0-100 reflecting how well the repo matches the query
- Order recommendations by match_score descending
- Be honest about considerations/trade-offs
- Star counts should be approximate but realistic
"""


def get_discovery_prompt(request: DiscoveryRequest) -> str:
    """Format the discovery prompt with request data."""
    filters = request.filters

    languages = ", ".join(filters.languages) if filters.languages else "Any"
    domain = filters.domain or "Any"
    scale = filters.scale or "Any"
    license_pref = filters.license_preference or "Any"
    maintained = (
        "Yes" if filters.actively_maintained
        else "No preference" if filters.actively_maintained is None
        else "No"
    )

    return DISCOVERY_PROMPT.format(
        query=request.query,
        languages=languages,
        domain=domain,
        scale=scale,
        license_preference=license_pref,
        actively_maintained=maintained,
        max_results=request.max_results,
    )
