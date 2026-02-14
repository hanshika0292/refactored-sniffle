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
        <div className="space-y-4">
          {/* Overall risk badge */}
          <div className="flex items-center justify-between">
            <span
              className={`px-3 py-1 text-sm font-medium rounded-full border ${
                riskColors[data.overall_risk] || riskColors.medium
              }`}
            >
              {data.overall_risk?.toUpperCase()} RISK
            </span>
            <div className="text-right">
              <div className="text-xs text-gray-400 dark:text-gray-500">
                Time to Set Up
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {data.estimated_setup_time}
              </div>
            </div>
          </div>

          {/* Complexity score */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-gray-400 dark:text-gray-500">
                Complexity
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                {data.complexity_score}/10
              </span>
            </div>
            <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-amber-500 rounded-full transition-all"
                style={{ width: `${(data.complexity_score || 0) * 10}%` }}
              />
            </div>
          </div>

          {/* Risk items */}
          <div className="space-y-2">
            {data.risks?.slice(0, 5).map((risk, i) => (
              <div
                key={i}
                className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2.5"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      severityDots[risk.severity] || severityDots.medium
                    }`}
                  />
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {risk.title}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-4">
                  {risk.description}
                </p>
                <div className="flex gap-2 mt-1.5 ml-4">
                  <span className="text-[10px] px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded">
                    {risk.category}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded">
                    {risk.likelihood} likelihood
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </PanelCard>
  );
}
