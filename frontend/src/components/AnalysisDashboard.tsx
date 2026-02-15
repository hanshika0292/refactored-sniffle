"use client";

import { useRef, useEffect } from "react";
import { AnalysisResults, AnalysisStatus, PASS_ORDER } from "@/lib/types";
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
  status?: AnalysisStatus;
}

export default function AnalysisDashboard({ results, currentPass, status }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const completedCountRef = useRef(0);

  // For parallel: a panel is loading if we're analyzing and its data hasn't arrived
  const isPassLoading = (passName: string) => {
    if (status === "analyzing") {
      return !results[passName as keyof AnalysisResults];
    }
    return false;
  };

  // Auto-scroll when new results arrive
  const completedCount = PASS_ORDER.filter(
    (name) => results[name as keyof AnalysisResults] !== undefined
  ).length;

  useEffect(() => {
    if (completedCount > completedCountRef.current) {
      completedCountRef.current = completedCount;
      scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [completedCount]);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-4">
      {/* Row 1: High-impact — Let's Run It + overview panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
        <SafeRunPlan
          data={results.safe_run_plan}
          isLoading={isPassLoading("safe_run_plan")}
        />
        <SystemOverview
          data={results.system_overview}
          isLoading={isPassLoading("system_overview")}
        />
        <SetupRiskRadar
          data={results.setup_risk_radar}
          isLoading={isPassLoading("setup_risk_radar")}
        />
      </div>

      {/* Row 2: Claude Toolkit — full width */}
      <ClaudeToolkit
        data={results.claude_toolkit}
        isLoading={isPassLoading("claude_toolkit")}
      />

      {/* Row 3: Risk & recovery panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
        <SecurityRisk
          data={results.security_risk}
          isLoading={isPassLoading("security_risk")}
        />
        <FailureTimeline
          data={results.failure_timeline}
          isLoading={isPassLoading("failure_timeline")}
        />
        <RecoveryStrategy
          data={results.recovery_strategy}
          isLoading={isPassLoading("recovery_strategy")}
        />
      </div>

      {/* Scroll anchor */}
      <div ref={scrollRef} />
    </div>
  );
}
