// Pass 1: System Overview
export interface SystemOverviewData {
  reasoning_steps: string[];
  purpose: string;
  components: {
    name: string;
    description: string;
    tech: string[];
  }[];
  architecture_type: string;
  data_flows: string[];
  key_dependencies: {
    name: string;
    purpose: string;
  }[];
}

// Pass 2: Setup Risk Radar
export interface SetupRiskRadarData {
  reasoning_steps: string[];
  overall_risk: "low" | "medium" | "high" | "critical";
  risks: {
    category: string;
    title: string;
    description: string;
    severity: "low" | "medium" | "high" | "critical";
    likelihood: "low" | "medium" | "high";
  }[];
  env_requirements: {
    name: string;
    required: boolean;
    notes: string;
  }[];
  estimated_setup_time: string;
  complexity_score: number;
}

// Pass 3: Failure Timeline
export interface FailureTimelineData {
  reasoning_steps: string[];
  timeline: {
    time_label: string;
    title: string;
    description: string;
    status: "ok" | "warning" | "critical";
    probability: string;
    mitigation: string;
  }[];
  overall_survival_rate: string;
  critical_period: string;
}

// Pass 4: Security Risk
export interface SecurityRiskData {
  reasoning_steps: string[];
  security_rating: "low" | "medium" | "high" | "critical";
  findings: {
    title: string;
    severity: "info" | "low" | "medium" | "high" | "critical";
    description: string;
    recommendation: string;
  }[];
  positive_practices: string[];
  missing_protections: string[];
  data_exposure_risk: string;
  supply_chain_risk: string;
}

// Pass 5: Safe Run Plan
export interface SafeRunPlanData {
  reasoning_steps: string[];
  steps: {
    step_number: number;
    title: string;
    commands: string[];
    notes: string;
    risk_level: "safe" | "caution" | "danger";
  }[];
  env_vars: {
    name: string;
    description: string;
    required: boolean;
    example: string;
  }[];
  sandbox_recommendation: string;
  smoke_test: {
    command: string;
    expected_output: string;
  };
  estimated_time: string;
}

// Pass 6: Recovery Strategy
export interface RecoveryStrategyData {
  reasoning_steps: string[];
  rollback_plan: {
    step_number: number;
    action: string;
    command: string;
    notes: string;
  }[];
  recovery_scenarios: {
    scenario: string;
    severity: "low" | "medium" | "high" | "critical";
    steps: string[];
    estimated_recovery_time: string;
  }[];
  nuclear_option: {
    description: string;
    steps: string[];
    data_loss_risk: "none" | "partial" | "complete";
  };
  monitoring_recommendations: string[];
}

export interface AnalysisResults {
  system_overview?: SystemOverviewData;
  setup_risk_radar?: SetupRiskRadarData;
  failure_timeline?: FailureTimelineData;
  security_risk?: SecurityRiskData;
  safe_run_plan?: SafeRunPlanData;
  recovery_strategy?: RecoveryStrategyData;
}

export type AnalysisStatus = "idle" | "analyzing" | "complete" | "error";

export interface AnalysisState {
  status: AnalysisStatus;
  currentPass: number;
  currentPassName: string;
  message: string;
  reasoning: string[];
  results: AnalysisResults;
  error?: string;
}

export const PASS_NAMES: Record<string, string> = {
  system_overview: "The Big Picture",
  setup_risk_radar: "Getting Started",
  failure_timeline: "What Could Go Wrong",
  security_risk: "Safety Check",
  safe_run_plan: "Let's Run It",
  recovery_strategy: "If Things Break",
};

export const PASS_ORDER = [
  "system_overview",
  "setup_risk_radar",
  "failure_timeline",
  "security_risk",
  "safe_run_plan",
  "recovery_strategy",
];

// Discovery types

export type AppMode = "analyze" | "discover";

export interface DiscoveryFilters {
  languages: string[];
  domain: string;
  scale: string;
  license_preference: string;
  actively_maintained: boolean | null;
}

export interface RecommendedRepo {
  rank: number;
  repo_name: string;
  github_url: string;
  stars: number;
  language: string;
  license: string;
  description: string;
  reasoning: string;
  strengths: string[];
  considerations: string[];
  match_score: number;
  tags: string[];
}

export interface DiscoveryResult {
  reasoning_steps: string[];
  summary: string;
  recommendations: RecommendedRepo[];
  query_interpretation: string;
}

export type DiscoveryStatus = "idle" | "searching" | "complete" | "error";

export interface DiscoveryState {
  status: DiscoveryStatus;
  message: string;
  reasoning: string[];
  result: DiscoveryResult | null;
  error?: string;
}

export const DEFAULT_FILTERS: DiscoveryFilters = {
  languages: [],
  domain: "",
  scale: "",
  license_preference: "",
  actively_maintained: null,
};

export const LANGUAGE_OPTIONS = [
  "Python",
  "TypeScript",
  "JavaScript",
  "Go",
  "Rust",
  "Java",
  "C++",
  "Ruby",
  "C#",
  "Swift",
];

export const DOMAIN_OPTIONS = [
  "Web Framework",
  "Command Line Tool",
  "Data Processing",
  "AI / Machine Learning",
  "DevOps / Infrastructure",
  "Database",
  "APIs / Backend",
  "Security",
  "UI / Design",
  "Mobile Apps",
];

export const SCALE_OPTIONS = [
  "Small & Focused (< 1K stars)",
  "Growing (1K-10K stars)",
  "Well-Known (10K-50K stars)",
  "Superstar (50K+ stars)",
];
