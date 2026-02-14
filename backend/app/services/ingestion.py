import asyncio
import base64
import re

import httpx

from app.config import settings
from app.models.schemas import RepoContent

PRIORITY_FILES = [
    "package.json",
    "requirements.txt",
    "pyproject.toml",
    "setup.py",
    "setup.cfg",
    "Cargo.toml",
    "go.mod",
    "Gemfile",
    "docker-compose.yml",
    "docker-compose.yaml",
    "Dockerfile",
    ".env.example",
    "Makefile",
    "tsconfig.json",
    "webpack.config.js",
    "vite.config.ts",
    "next.config.js",
    "next.config.mjs",
]


def parse_github_url(url: str) -> tuple[str, str]:
    match = re.match(r"https?://github\.com/([\w.\-]+)/([\w.\-]+)", url)
    if not match:
        raise ValueError(f"Invalid GitHub URL: {url}")
    return match.group(1), match.group(2)


def _headers() -> dict[str, str]:
    h = {"Accept": "application/vnd.github.v3+json"}
    if settings.github_token:
        h["Authorization"] = f"token {settings.github_token}"
    return h


async def _fetch_json(client: httpx.AsyncClient, url: str) -> dict | list | None:
    try:
        resp = await client.get(url, headers=_headers(), timeout=15)
        if resp.status_code == 200:
            return resp.json()
    except Exception:
        pass
    return None


async def _fetch_text(client: httpx.AsyncClient, url: str) -> str:
    try:
        resp = await client.get(url, headers=_headers(), timeout=15)
        if resp.status_code == 200:
            return resp.text
    except Exception:
        pass
    return ""


async def _fetch_file_content(
    client: httpx.AsyncClient, owner: str, repo: str, path: str
) -> str:
    url = f"https://api.github.com/repos/{owner}/{repo}/contents/{path}"
    data = await _fetch_json(client, url)
    if data and isinstance(data, dict) and data.get("content"):
        try:
            content = base64.b64decode(data["content"]).decode("utf-8", errors="replace")
            return content[: settings.max_file_size]
        except Exception:
            pass
    return ""


async def fetch_repo_content(url: str) -> RepoContent:
    owner, repo = parse_github_url(url)

    async with httpx.AsyncClient() as client:
        repo_url = f"https://api.github.com/repos/{owner}/{repo}"
        readme_url = f"https://raw.githubusercontent.com/{owner}/{repo}/HEAD/README.md"
        tree_url = f"https://api.github.com/repos/{owner}/{repo}/git/trees/HEAD?recursive=1"
        langs_url = f"https://api.github.com/repos/{owner}/{repo}/languages"

        repo_info, readme_text, tree_data, languages = await asyncio.gather(
            _fetch_json(client, repo_url),
            _fetch_text(client, readme_url),
            _fetch_json(client, tree_url),
            _fetch_json(client, langs_url),
        )

        description = ""
        if repo_info and isinstance(repo_info, dict):
            description = repo_info.get("description", "") or ""

        readme_text = (readme_text or "")[: settings.max_content_size]

        file_tree: list[str] = []
        tree_paths: set[str] = set()
        if tree_data and isinstance(tree_data, dict):
            for item in tree_data.get("tree", [])[:2000]:
                path = item.get("path", "")
                file_tree.append(path)
                tree_paths.add(path)

        files_to_fetch: list[str] = []
        for pf in PRIORITY_FILES:
            if pf in tree_paths and len(files_to_fetch) < 12:
                files_to_fetch.append(pf)

        config_files: dict[str, str] = {}
        if files_to_fetch:
            results = await asyncio.gather(
                *[_fetch_file_content(client, owner, repo, f) for f in files_to_fetch]
            )
            for fname, content in zip(files_to_fetch, results):
                if content:
                    config_files[fname] = content

        return RepoContent(
            repo_name=repo,
            owner=owner,
            readme=readme_text,
            file_tree=file_tree[:500],
            config_files=config_files,
            languages=languages if isinstance(languages, dict) else {},
            description=description,
        )
