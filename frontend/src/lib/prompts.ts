import type { RepoContent } from "./github";

// ─── Analysis pass definitions ───

export const PASS_DEFINITIONS = [
  {
    name: "system_overview",
    title: "The Big Picture",
    prompt: `You are an expert software architect analyzing an open source repository.

Analyze the following repository content and produce a comprehensive system overview.

Repository: {repo_name}
Description: {description}

README:
{readme}

File Tree (partial):
{file_tree}

Languages: {languages}

Config/Package Files:
{config_files}

Respond with ONLY valid JSON matching this exact structure:
{
  "reasoning_steps": ["step 1 of your analysis...", "step 2...", "step 3..."],
  "purpose": "One paragraph describing what this project does and why it exists",
  "components": [
    {
      "name": "Component name",
      "description": "What this component does",
      "tech": ["technology1", "technology2"]
    }
  ],
  "architecture_type": "monolith|microservice|library|cli|framework|other",
  "data_flows": [
    "Description of data flow 1",
    "Description of data flow 2"
  ],
  "key_dependencies": [
    {
      "name": "dependency name",
      "purpose": "why it's used"
    }
  ]
}`,
  },
  {
    name: "setup_risk_radar",
    title: "Getting Started",
    prompt: `You are a DevOps risk analyst. Analyze this repository for setup and operational risks.

Repository: {repo_name}
Description: {description}

README:
{readme}

File Tree (partial):
{file_tree}

Languages: {languages}

Config/Package Files:
{config_files}

Respond with ONLY valid JSON matching this exact structure:
{
  "reasoning_steps": ["step 1...", "step 2...", "step 3..."],
  "overall_risk": "low|medium|high|critical",
  "risks": [
    {
      "category": "dependency|configuration|environment|compatibility|data|infrastructure",
      "title": "Short risk title",
      "description": "Detailed description of the risk",
      "severity": "low|medium|high|critical",
      "likelihood": "low|medium|high"
    }
  ],
  "env_requirements": [
    {
      "name": "Requirement name",
      "required": true,
      "notes": "Additional details"
    }
  ],
  "estimated_setup_time": "5 minutes|15 minutes|30 minutes|1 hour|2+ hours",
  "complexity_score": 7
}`,
  },
  {
    name: "failure_timeline",
    title: "What Could Go Wrong",
    prompt: `You are a chaos engineering specialist. Simulate a failure timeline for deploying and running this repository in production.

Repository: {repo_name}
Description: {description}

README:
{readme}

File Tree (partial):
{file_tree}

Languages: {languages}

Config/Package Files:
{config_files}

Create a realistic timeline from Day 1 to Month 3 showing how things could go wrong. Each node should represent a specific time point with a realistic scenario.

Respond with ONLY valid JSON matching this exact structure:
{
  "reasoning_steps": ["step 1...", "step 2...", "step 3..."],
  "timeline": [
    {
      "time_label": "Day 1",
      "title": "Short event title",
      "description": "What happens at this point",
      "status": "ok|warning|critical",
      "probability": "Low 15%|Medium 40%|High 70%|Very High 90%",
      "mitigation": "How to prevent or handle this"
    }
  ],
  "overall_survival_rate": "85%",
  "critical_period": "Week 2-4: dependency conflicts most likely to surface"
}`,
  },
  {
    name: "security_risk",
    title: "Safety Check",
    prompt: `You are a security auditor performing a threat assessment of this open source repository.

Repository: {repo_name}
Description: {description}

README:
{readme}

File Tree (partial):
{file_tree}

Languages: {languages}

Config/Package Files:
{config_files}

Respond with ONLY valid JSON matching this exact structure:
{
  "reasoning_steps": ["step 1...", "step 2...", "step 3..."],
  "security_rating": "low|medium|high|critical",
  "findings": [
    {
      "title": "Finding title",
      "severity": "info|low|medium|high|critical",
      "description": "Detailed description",
      "recommendation": "What to do about it"
    }
  ],
  "positive_practices": [
    "Good security practice found in the repo"
  ],
  "missing_protections": [
    "Security measure that should be added"
  ],
  "data_exposure_risk": "low|medium|high",
  "supply_chain_risk": "low|medium|high"
}`,
  },
  {
    name: "safe_run_plan",
    title: "Let's Run It",
    prompt: `You are a senior engineer creating a safe step-by-step execution plan for running this repository locally.

Repository: {repo_name}
Description: {description}

README:
{readme}

File Tree (partial):
{file_tree}

Languages: {languages}

Config/Package Files:
{config_files}

Respond with ONLY valid JSON matching this exact structure:
{
  "reasoning_steps": ["step 1...", "step 2...", "step 3..."],
  "steps": [
    {
      "step_number": 1,
      "title": "Step title",
      "commands": ["command1", "command2"],
      "notes": "Important notes about this step",
      "risk_level": "safe|caution|danger"
    }
  ],
  "env_vars": [
    {
      "name": "ENV_VAR_NAME",
      "description": "What this variable is for",
      "required": true,
      "example": "example_value"
    }
  ],
  "sandbox_recommendation": "docker|vm|none",
  "smoke_test": {
    "command": "test command to verify it works",
    "expected_output": "what you should see"
  },
  "estimated_time": "10 minutes"
}`,
  },
  {
    name: "recovery_strategy",
    title: "If Things Break",
    prompt: `You are a site reliability engineer creating a recovery playbook for this repository.

Repository: {repo_name}
Description: {description}

README:
{readme}

File Tree (partial):
{file_tree}

Languages: {languages}

Config/Package Files:
{config_files}

Respond with ONLY valid JSON matching this exact structure:
{
  "reasoning_steps": ["step 1...", "step 2...", "step 3..."],
  "rollback_plan": [
    {
      "step_number": 1,
      "action": "What to do",
      "command": "specific command if applicable",
      "notes": "Additional context"
    }
  ],
  "recovery_scenarios": [
    {
      "scenario": "Scenario name (e.g., Database corruption)",
      "severity": "low|medium|high|critical",
      "steps": ["Step 1", "Step 2"],
      "estimated_recovery_time": "15 minutes"
    }
  ],
  "nuclear_option": {
    "description": "Complete teardown and rebuild procedure",
    "steps": ["Step 1", "Step 2"],
    "data_loss_risk": "none|partial|complete"
  },
  "monitoring_recommendations": [
    "Recommendation 1",
    "Recommendation 2"
  ]
}`,
  },
];

export function getPassPrompt(
  passIndex: number,
  repoContent: RepoContent
): string {
  const definition = PASS_DEFINITIONS[passIndex];

  const fileTreeStr = repoContent.file_tree.slice(0, 200).join("\n");

  let configStr = "";
  for (const [fname, content] of Object.entries(repoContent.config_files)) {
    configStr += `\n--- ${fname} ---\n${content}\n`;
  }

  const langsStr = Object.entries(repoContent.languages)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([k, v]) => `${k}: ${v}`)
    .join(", ");

  return definition.prompt
    .replace("{repo_name}", repoContent.repo_name)
    .replace("{description}", repoContent.description)
    .replace("{readme}", repoContent.readme)
    .replace("{file_tree}", fileTreeStr)
    .replace("{languages}", langsStr)
    .replace("{config_files}", configStr);
}

// ─── Discovery prompt ───

const DISCOVERY_PROMPT = `You are an expert open source advisor. A user is looking for open source projects that match their needs.

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
{
  "reasoning_steps": ["step 1 of your analysis...", "step 2...", "step 3..."],
  "query_interpretation": "One sentence summarizing what the user is looking for",
  "summary": "A brief paragraph about the recommendations and how they fit the user's needs",
  "recommendations": [
    {
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
    }
  ]
}

Important:
- Only recommend real repositories that exist on GitHub
- match_score should be 0-100 reflecting how well the repo matches the query
- Order recommendations by match_score descending
- Be honest about considerations/trade-offs
- Star counts should be approximate but realistic
`;

interface DiscoveryInput {
  query: string;
  filters: {
    languages?: string[];
    domain?: string;
    scale?: string;
    license_preference?: string;
    actively_maintained?: boolean | null;
  };
  max_results: number;
}

export function getDiscoveryPrompt(input: DiscoveryInput): string {
  const f = input.filters;
  const languages =
    f.languages && f.languages.length > 0 ? f.languages.join(", ") : "Any";
  const domain = f.domain || "Any";
  const scale = f.scale || "Any";
  const licensePref = f.license_preference || "Any";
  const maintained =
    f.actively_maintained === true
      ? "Yes"
      : f.actively_maintained === false
      ? "No"
      : "No preference";

  return DISCOVERY_PROMPT.replace("{query}", input.query)
    .replace("{languages}", languages)
    .replace("{domain}", domain)
    .replace("{scale}", scale)
    .replace("{license_preference}", licensePref)
    .replace("{actively_maintained}", maintained)
    .replace("{max_results}", String(input.max_results));
}
