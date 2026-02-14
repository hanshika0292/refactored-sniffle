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
        <div className="space-y-4">
          {/* Rollback plan */}
          <div>
            <div className="text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
              How to Undo
            </div>
            <div className="space-y-1.5">
              {data.rollback_plan?.slice(0, 4).map((step, i) => (
                <div key={i} className="flex gap-2 text-xs">
                  <span className="text-cyan-600 dark:text-cyan-500 font-mono w-4 shrink-0">
                    {step.step_number}.
                  </span>
                  <div>
                    <span className="text-gray-800 dark:text-gray-200">
                      {step.action}
                    </span>
                    {step.command && (
                      <code className="block text-[10px] text-cyan-700 dark:text-cyan-300/60 bg-gray-100 dark:bg-gray-950 px-1.5 py-0.5 rounded mt-0.5 font-mono">
                        $ {step.command}
                      </code>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recovery scenarios */}
          {data.recovery_scenarios && data.recovery_scenarios.length > 0 && (
            <div>
              <div className="text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
                What If...
              </div>
              <div className="space-y-2">
                {data.recovery_scenarios.slice(0, 3).map((scenario, i) => (
                  <div
                    key={i}
                    className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-800 dark:text-gray-200">
                        {scenario.scenario}
                      </span>
                      <span
                        className={`text-[10px] ${
                          severityColors[scenario.severity] ||
                          "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {scenario.severity}
                      </span>
                    </div>
                    <div className="mt-1.5 space-y-0.5">
                      {scenario.steps?.slice(0, 3).map((step, j) => (
                        <div
                          key={j}
                          className="text-[11px] text-gray-500 dark:text-gray-400 flex gap-1.5"
                        >
                          <span className="text-gray-400 dark:text-gray-600">
                            {j + 1}.
                          </span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                    <div className="text-[10px] text-gray-400 dark:text-gray-600 mt-1">
                      Recovery: {scenario.estimated_recovery_time}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Nuclear option */}
          {data.nuclear_option && (
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-lg p-2.5">
              <div className="text-xs text-red-600 dark:text-red-400 font-medium mb-1 flex items-center gap-1.5">
                Start Fresh
                <span className="text-[9px] px-1 py-0.5 bg-red-100 dark:bg-red-900/40 rounded">
                  Data loss: {data.nuclear_option.data_loss_risk}
                </span>
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-1.5">
                {data.nuclear_option.description}
              </p>
              {data.nuclear_option.steps?.slice(0, 3).map((step, i) => (
                <div
                  key={i}
                  className="text-[11px] text-red-500 dark:text-red-300/60 flex gap-1.5 mb-0.5"
                >
                  <span>{i + 1}.</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          )}

          {/* Monitoring */}
          {data.monitoring_recommendations &&
            data.monitoring_recommendations.length > 0 && (
              <div>
                <div className="text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1.5">
                  Keep an Eye On
                </div>
                {data.monitoring_recommendations
                  .slice(0, 3)
                  .map((rec, i) => (
                    <div
                      key={i}
                      className="text-xs text-gray-500 dark:text-gray-400 flex gap-2 mb-1"
                    >
                      <span className="text-cyan-600 dark:text-cyan-500 shrink-0">
                        &#8226;
                      </span>
                      <span>{rec}</span>
                    </div>
                  ))}
              </div>
            )}
        </div>
      )}
    </PanelCard>
  );
}
