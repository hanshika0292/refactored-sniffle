"use client";

import { AnalysisResults, PASS_ORDER } from "@/lib/types";
import SystemOverview from "@/components/panels/SystemOverview";
import SetupRiskRadar from "@/components/panels/SetupRiskRadar";
import FailureTimeline from "@/components/panels/FailureTimeline";
import SecurityRisk from "@/components/panels/SecurityRisk";
import SafeRunPlan from "@/components/panels/SafeRunPlan";
import RecoveryStrategy from "@/components/panels/RecoveryStrategy";
import ClaudeToolkit from "@/components/panels/ClaudeToolkit";

interface Props {
  results: AnalysisResults;
  currentPass: number;
}

export default function AnalysisDashboard({ results, currentPass }: Props) {
  const isPassLoading = (passIndex: number) => {
    return currentPass === passIndex + 1 && !results[PASS_ORDER[passIndex] as keyof AnalysisResults];
  };

  return (
    <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
      {/* Row 1 */}
      <SystemOverview
        data={results.system_overview}
        isLoading={isPassLoading(0)}
      />
      <SetupRiskRadar
        data={results.setup_risk_radar}
        isLoading={isPassLoading(1)}
      />
      <SecurityRisk
        data={results.security_risk}
        isLoading={isPassLoading(3)}
      />

      {/* Row 2 */}
      <FailureTimeline
        data={results.failure_timeline}
        isLoading={isPassLoading(2)}
      />
      <SafeRunPlan
        data={results.safe_run_plan}
        isLoading={isPassLoading(4)}
      />
      <RecoveryStrategy
        data={results.recovery_strategy}
        isLoading={isPassLoading(5)}
      />

      {/* Row 3: Full-width capstone */}
      <div className="lg:col-span-3 md:col-span-2">
        <ClaudeToolkit
          data={results.claude_toolkit}
          isLoading={isPassLoading(6)}
        />
      </div>
    </div>
  );
}
