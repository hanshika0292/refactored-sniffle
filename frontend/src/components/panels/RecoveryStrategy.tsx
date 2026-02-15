"use client";

import { RotateCcw } from "lucide-react";
import PanelCard from "@/components/ui/PanelCard";
import { RecoveryStrategyData } from "@/lib/types";

interface Props {
  data?: RecoveryStrategyData;
  isLoading: boolean;
}

const severityColors: Record<string, string> = {
  low: "text-green-600 dark:text-green-400",
  medium: "text-amber-600 dark:text-amber-400",
  high: "text-orange-600 dark:text-orange-400",
  critical: "text-red-600 dark:text-red-400",
};

export default function RecoveryStrategy({ data, isLoading }: Props) {
  return (
    <PanelCard
      title="If Things Break"
      icon={<RotateCcw className="w-4 h-4" />}
      isLoading={isLoading}
      isEmpty={!data}
    >
      {data && (
        <div className="space-y-3">
          {/* Rollback — compact numbered list */}
          <div>
            <div className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1.5">
              How to Undo
            </div>
            <div className="space-y-1">
              {data.rollback_plan?.slice(0, 4).map((step, i) => (
                <div key={i} className="flex gap-2 text-xs">
                  <span className="text-cyan-600 dark:text-cyan-500 font-mono w-3 shrink-0 text-right">
                    {step.step_number}.
                  </span>
                  <span className="text-gray-700 dark:text-gray-300 truncate">
                    {step.action}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recovery scenarios — title + severity + recovery time only */}
          {data.recovery_scenarios && data.recovery_scenarios.length > 0 && (
            <div>
              <div className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1.5">
                What If...
              </div>
              <div className="space-y-1">
                {data.recovery_scenarios.slice(0, 3).map((scenario, i) => (
                  <div key={i} className="flex items-center justify-between gap-2 py-1 bg-gray-50 dark:bg-gray-800/50 rounded px-2">
                    <span className="text-xs text-gray-700 dark:text-gray-300 truncate">
                      {scenario.scenario}
                    </span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[10px] font-medium ${severityColors[scenario.severity] || "text-gray-500"}`}>
                        {scenario.severity}
                      </span>
                      <span className="text-[10px] text-gray-400 dark:text-gray-500">
                        {scenario.estimated_recovery_time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Nuclear option — single line */}
          {data.nuclear_option && (
            <div className="text-[10px] text-red-500 dark:text-red-400/70 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded px-2 py-1.5 flex items-center gap-2">
              <span className="font-medium shrink-0">Start Fresh</span>
              <span className="text-gray-500 dark:text-gray-400 truncate">{data.nuclear_option.description}</span>
              <span className="shrink-0 px-1 py-0.5 bg-red-100 dark:bg-red-900/40 rounded text-[9px]">
                Loss: {data.nuclear_option.data_loss_risk}
              </span>
            </div>
          )}
        </div>
      )}
    </PanelCard>
  );
}
