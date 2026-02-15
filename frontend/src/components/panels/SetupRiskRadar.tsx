"use client";

import { AlertTriangle } from "lucide-react";
import PanelCard from "@/components/ui/PanelCard";
import { SetupRiskRadarData } from "@/lib/types";

interface Props {
  data?: SetupRiskRadarData;
  isLoading: boolean;
}

const riskColors: Record<string, string> = {
  low: "bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 border-green-300 dark:border-green-800",
  medium:
    "bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-800",
  high: "bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 border-orange-300 dark:border-orange-800",
  critical:
    "bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 border-red-300 dark:border-red-800",
};

const severityDots: Record<string, string> = {
  low: "bg-green-500 dark:bg-green-400",
  medium: "bg-amber-500 dark:bg-amber-400",
  high: "bg-orange-500 dark:bg-orange-400",
  critical: "bg-red-500 dark:bg-red-400",
};

export default function SetupRiskRadar({ data, isLoading }: Props) {
  return (
    <PanelCard
      title="Getting Started"
      icon={<AlertTriangle className="w-4 h-4" />}
      isLoading={isLoading}
      isEmpty={!data}
    >
      {data && (
        <div className="space-y-3">
          {/* Overall risk + setup time */}
          <div className="flex items-center justify-between">
            <span
              className={`px-2.5 py-0.5 text-xs font-medium rounded-full border ${
                riskColors[data.overall_risk] || riskColors.medium
              }`}
            >
              {data.overall_risk?.toUpperCase()} RISK
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Setup: <span className="text-gray-700 dark:text-gray-300">{data.estimated_setup_time}</span>
            </span>
          </div>

          {/* Complexity bar */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-gray-400 dark:text-gray-500">Complexity</span>
              <span className="text-gray-500 dark:text-gray-400">{data.complexity_score}/10</span>
            </div>
            <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-amber-500 rounded-full transition-all"
                style={{ width: `${(data.complexity_score || 0) * 10}%` }}
              />
            </div>
          </div>

          {/* Risk items — compact: title + severity only */}
          <div className="space-y-1">
            {data.risks?.slice(0, 4).map((risk, i) => (
              <div key={i} className="flex items-center gap-2 py-1">
                <div
                  className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    severityDots[risk.severity] || severityDots.medium
                  }`}
                />
                <span className="text-xs text-gray-700 dark:text-gray-300 flex-1 truncate">
                  {risk.title}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 rounded shrink-0">
                  {risk.category}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </PanelCard>
  );
}
