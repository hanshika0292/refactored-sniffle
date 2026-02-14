const MAX_CONTENT_SIZE = 15000;
const MAX_FILE_SIZE = 8000;

const PRIORITY_FILES = [
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
];

export interface RepoContent {
  repo_name: string;
  owner: string;
  readme: string;
  file_tree: string[];
  config_files: Record<string, string>;
  languages: Record<string, number>;
  description: string;
}

function parseGitHubUrl(url: string): { owner: string; repo: string } {
  const match = url.match(
    /^https?:\/\/github\.com\/([\w.\-]+)\/([\w.\-]+)/
  );
  if (!match) throw new Error(`Invalid GitHub URL: ${url}`);
  return { owner: match[1], repo: match[2] };
}

function headers(): Record<string, string> {
  const h: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
  };
  if (process.env.GITHUB_TOKEN) {
    h["Authorization"] = `token ${process.env.GITHUB_TOKEN}`;
  }
  return h;
}

async function fetchJson(url: string): Promise<unknown | null> {
  try {
    const resp = await fetch(url, {
      headers: headers(),
      signal: AbortSignal.timeout(15000),
    });
    if (resp.ok) return resp.json();
  } catch {
    /* ignore */
  }
  return null;
}

async function fetchText(url: string): Promise<string> {
  try {
    const resp = await fetch(url, {
      headers: headers(),
      signal: AbortSignal.timeout(15000),
    });
    if (resp.ok) return resp.text();
  } catch {
    /* ignore */
  }
  return "";
}

async function fetchFileContent(
  owner: string,
  repo: string,
  path: string
): Promise<string> {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  const data = (await fetchJson(url)) as Record<string, unknown> | null;
  if (data && data.content && typeof data.content === "string") {
    try {
      const content = Buffer.from(data.content, "base64").toString("utf-8");
      return content.slice(0, MAX_FILE_SIZE);
    } catch {
      /* ignore */
    }
  }
  return "";
}

export async function fetchRepoContent(url: string): Promise<RepoContent> {
  const { owner, repo } = parseGitHubUrl(url);

  const repoUrl = `https://api.github.com/repos/${owner}/${repo}`;
  const readmeUrl = `https://raw.githubusercontent.com/${owner}/${repo}/HEAD/README.md`;
  const treeUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/HEAD?recursive=1`;
  const langsUrl = `https://api.github.com/repos/${owner}/${repo}/languages`;

  const [repoInfo, readmeText, treeData, languages] = await Promise.all([
    fetchJson(repoUrl) as Promise<Record<string, unknown> | null>,
    fetchText(readmeUrl),
    fetchJson(treeUrl) as Promise<Record<string, unknown> | null>,
    fetchJson(langsUrl) as Promise<Record<string, number> | null>,
  ]);

  const description =
    repoInfo && typeof repoInfo.description === "string"
      ? repoInfo.description
      : "";

  const readme = (readmeText || "").slice(0, MAX_CONTENT_SIZE);

  const fileTree: string[] = [];
  const treePaths = new Set<string>();
  if (treeData && Array.isArray(treeData.tree)) {
    for (const item of treeData.tree.slice(0, 2000)) {
      const path = (item as Record<string, unknown>).path as string;
      if (path) {
        fileTree.push(path);
        treePaths.add(path);
      }
    }
  }

  const filesToFetch: string[] = [];
  for (const pf of PRIORITY_FILES) {
    if (treePaths.has(pf) && filesToFetch.length < 12) {
      filesToFetch.push(pf);
    }
  }

  const configFiles: Record<string, string> = {};
  if (filesToFetch.length > 0) {
    const results = await Promise.all(
      filesToFetch.map((f) => fetchFileContent(owner, repo, f))
    );
    filesToFetch.forEach((fname, i) => {
      if (results[i]) configFiles[fname] = results[i];
    });
  }

  return {
    repo_name: repo,
    owner,
    readme,
    file_tree: fileTree.slice(0, 500),
    config_files: configFiles,
    languages: languages && typeof languages === "object" ? languages : {},
    description,
  };
}
