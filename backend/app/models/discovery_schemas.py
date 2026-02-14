from pydantic import BaseModel, Field


class DiscoveryFilters(BaseModel):
    languages: list[str] = []
    domain: str = ""
    scale: str = ""
    license_preference: str = ""
    actively_maintained: bool | None = None


class DiscoveryRequest(BaseModel):
    query: str = Field(..., min_length=10)
    filters: DiscoveryFilters = DiscoveryFilters()
    max_results: int = Field(default=5, ge=1, le=10)


class RecommendedRepo(BaseModel):
    rank: int
    repo_name: str
    github_url: str
    stars: int = 0
    language: str = ""
    license: str = ""
    description: str = ""
    reasoning: str = ""
    strengths: list[str] = []
    considerations: list[str] = []
    match_score: int = 0
    tags: list[str] = []


class DiscoveryResult(BaseModel):
    reasoning_steps: list[str] = []
    summary: str = ""
    recommendations: list[RecommendedRepo] = []
    query_interpretation: str = ""
