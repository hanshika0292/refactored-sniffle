from pydantic import BaseModel, field_validator
import re


class AnalysisRequest(BaseModel):
    url: str

    @field_validator("url")
    @classmethod
    def validate_github_url(cls, v: str) -> str:
        pattern = r"^https?://github\.com/[\w.\-]+/[\w.\-]+/?$"
        if not re.match(pattern, v):
            raise ValueError("Invalid GitHub repository URL")
        return v.rstrip("/")


class RepoContent(BaseModel):
    repo_name: str
    owner: str
    readme: str = ""
    file_tree: list[str] = []
    config_files: dict[str, str] = {}
    package_files: dict[str, str] = {}
    languages: dict[str, int] = {}
    description: str = ""


class SSEEvent(BaseModel):
    event_type: str  # pass_start, pass_complete, error, done
    pass_name: str = ""
    pass_number: int = 0
    data: dict | None = None
    message: str = ""
    reasoning: list[str] = []
