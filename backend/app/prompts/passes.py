PASS_DEFINITIONS = [
    {
        "name": "system_overview",
        "title": "The Big Picture",
        "prompt": """You are an expert software architect analyzing an open source repository.

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
{{
  "reasoning_steps": ["step 1 of your analysis...", "step 2...", "step 3..."],
  "purpose": "One paragraph describing what this project does and why it exists",
  "components": [
    {{
      "name": "Component name",
      "description": "What this component does",
      "tech": ["technology1", "technology2"]
    }}
  ],
  "architecture_type": "monolith|microservice|library|cli|framework|other",
  "data_flows": [
    "Description of data flow 1",
    "Description of data flow 2"
  ],
  "key_dependencies": [
    {{
      "name": "dependency name",
      "purpose": "why it's used"
    }}
  ]
}}""",
    },
    {
        "name": "setup_risk_radar",
        "title": "Getting Started",
        "prompt": """You are a DevOps risk analyst. Analyze this repository for setup and operational risks.

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
{{
  "reasoning_steps": ["step 1...", "step 2...", "step 3..."],
  "overall_risk": "low|medium|high|critical",
  "risks": [
    {{
      "category": "dependency|configuration|environment|compatibility|data|infrastructure",
      "title": "Short risk title",
      "description": "Detailed description of the risk",
      "severity": "low|medium|high|critical",
      "likelihood": "low|medium|high"
    }}
  ],
  "env_requirements": [
    {{
      "name": "Requirement name",
      "required": true,
      "notes": "Additional details"
    }}
  ],
  "estimated_setup_time": "5 minutes|15 minutes|30 minutes|1 hour|2+ hours",
  "complexity_score": 7
}}""",
    },
    {
        "name": "failure_timeline",
        "title": "What Could Go Wrong",
        "prompt": """You are a chaos engineering specialist. Simulate a failure timeline for deploying and running this repository in production.

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
{{
  "reasoning_steps": ["step 1...", "step 2...", "step 3..."],
  "timeline": [
    {{
      "time_label": "Day 1",
      "title": "Short event title",
      "description": "What happens at this point",
      "status": "ok|warning|critical",
      "probability": "Low 15%|Medium 40%|High 70%|Very High 90%",
      "mitigation": "How to prevent or handle this"
    }}
  ],
  "overall_survival_rate": "85%",
  "critical_period": "Week 2-4: dependency conflicts most likely to surface"
}}""",
    },
    {
        "name": "security_risk",
        "title": "Safety Check",
        "prompt": """You are a security auditor performing a threat assessment of this open source repository.

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
{{
  "reasoning_steps": ["step 1...", "step 2...", "step 3..."],
  "security_rating": "low|medium|high|critical",
  "findings": [
    {{
      "title": "Finding title",
      "severity": "info|low|medium|high|critical",
      "description": "Detailed description",
      "recommendation": "What to do about it"
    }}
  ],
  "positive_practices": [
    "Good security practice found in the repo"
  ],
  "missing_protections": [
    "Security measure that should be added"
  ],
  "data_exposure_risk": "low|medium|high",
  "supply_chain_risk": "low|medium|high"
}}""",
    },
    {
        "name": "safe_run_plan",
        "title": "Let's Run It",
        "prompt": """You are a senior engineer creating a safe step-by-step execution plan for running this repository locally.

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
{{
  "reasoning_steps": ["step 1...", "step 2...", "step 3..."],
  "steps": [
    {{
      "step_number": 1,
      "title": "Step title",
      "commands": ["command1", "command2"],
      "notes": "Important notes about this step",
      "risk_level": "safe|caution|danger"
    }}
  ],
  "env_vars": [
    {{
      "name": "ENV_VAR_NAME",
      "description": "What this variable is for",
      "required": true,
      "example": "example_value"
    }}
  ],
  "sandbox_recommendation": "docker|vm|none",
  "smoke_test": {{
    "command": "test command to verify it works",
    "expected_output": "what you should see"
  }},
  "estimated_time": "10 minutes"
}}""",
    },
    {
        "name": "recovery_strategy",
        "title": "If Things Break",
        "prompt": """You are a site reliability engineer creating a recovery playbook for this repository.

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
{{
  "reasoning_steps": ["step 1...", "step 2...", "step 3..."],
  "rollback_plan": [
    {{
      "step_number": 1,
      "action": "What to do",
      "command": "specific command if applicable",
      "notes": "Additional context"
    }}
  ],
  "recovery_scenarios": [
    {{
      "scenario": "Scenario name (e.g., Database corruption)",
      "severity": "low|medium|high|critical",
      "steps": ["Step 1", "Step 2"],
      "estimated_recovery_time": "15 minutes"
    }}
  ],
  "nuclear_option": {{
    "description": "Complete teardown and rebuild procedure",
    "steps": ["Step 1", "Step 2"],
    "data_loss_risk": "none|partial|complete"
  }},
  "monitoring_recommendations": [
    "Recommendation 1",
    "Recommendation 2"
  ]
}}""",
    },
]


def get_pass_prompt(pass_index: int, repo_content) -> str:
    """Format a pass prompt with repo content."""
    definition = PASS_DEFINITIONS[pass_index]

    file_tree_str = "\n".join(repo_content.file_tree[:200])
    config_str = ""
    for fname, content in repo_content.config_files.items():
        config_str += f"\n--- {fname} ---\n{content}\n"

    langs_str = ", ".join(
        f"{k}: {v}" for k, v in sorted(
            repo_content.languages.items(), key=lambda x: -x[1]
        )[:10]
    )

    return definition["prompt"].format(
        repo_name=repo_content.repo_name,
        description=repo_content.description,
        readme=repo_content.readme,
        file_tree=file_tree_str,
        languages=langs_str,
        config_files=config_str,
    )
