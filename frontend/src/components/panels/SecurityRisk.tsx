"use client";

import { Shield } from "lucide-react";
import PanelCard from "@/components/ui/PanelCard";
import { SecurityRiskData } from "@/lib/types";

interface Props {
  data?: SecurityRiskData;
  isLoading: boolean;
}

const ratingColors: Record<string, string> = {
  low: "bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 border-green-300 dark:border-green-800",
  medium:
    "bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-800",
  high: "bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 border-orange-300 dark:border-orange-800",
  critical:
    "bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 border-red-300 dark:border-red-800",
};

const severityColors: Record<string, string> = {
  info: "text-blue-600 dark:text-blue-400",
  low: "text-green-600 dark:text-green-400",
  medium: "text-amber-600 dark:text-amber-400",
  high: "text-orange-600 dark:text-orange-400",
  critical: "text-red-600 dark:text-red-400",
};

export default function SecurityRisk({ data, isLoading }: Props) {
  return (
    <PanelCard
      title="Safety Check"
      icon={<Shield className="w-4 h-4" />}
      isLoading={isLoading}
      isEmpty={!data}
    >
      {data && (
        <div className="space-y-3">
          {/* Rating + risk summary */}
          <div className="flex items-center justify-between">
            <span
              className={`px-2.5 py-0.5 text-xs font-medium rounded-full border ${
                ratingColors[data.security_rating] || ratingColors.medium
              }`}
            >
              {data.security_rating?.toUpperCase()}
            </span>
            <div className="flex gap-3 text-[10px]">
              <span className="text-gray-400 dark:text-gray-500">
                Data: <span className="text-gray-600 dark:text-gray-300">{data.data_exposure_risk}</span>
              </span>
              <span className="text-gray-400 dark:text-gray-500">
                Supply: <span className="text-gray-600 dark:text-gray-300">{data.supply_chain_risk}</span>
              </span>
            </div>
          </div>

          {/* Findings — compact: severity + title + one-line fix */}
          {data.findings && data.findings.length > 0 && (
            <div className="space-y-1.5">
              {data.findings.slice(0, 3).map((finding, i) => (
                <div key={i} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-semibold uppercase ${
                        severityColors[finding.severity] || "text-gray-500"
                      }`}
                    >
                      {finding.severity}
                    </span>
                    <span className="text-xs text-gray-800 dark:text-gray-200 truncate">
                      {finding.title}
                    </span>
                  </div>
                  <p className="text-[10px] text-cyan-600 dark:text-cyan-400/70 mt-0.5 line-clamp-1">
                    Fix: {finding.recommendation}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Good + Bad — inline compact */}
          <div className="flex gap-4">
            {data.positive_practices && data.positive_practices.length > 0 && (
              <div className="flex-1 min-w-0">
                {data.positive_practices.slice(0, 2).map((p, i) => (
                  <div key={i} className="text-[10px] text-green-600 dark:text-green-400/70 flex gap-1 mb-0.5 leading-snug">
                    <span className="shrink-0">&#10003;</span>
                    <span className="line-clamp-1">{p}</span>
                  </div>
                ))}
              </div>
            )}
            {data.missing_protections && data.missing_protections.length > 0 && (
              <div className="flex-1 min-w-0">
                {data.missing_protections.slice(0, 2).map((m, i) => (
                  <div key={i} className="text-[10px] text-red-500 dark:text-red-400/70 flex gap-1 mb-0.5 leading-snug">
                    <span className="shrink-0">&#10007;</span>
                    <span className="line-clamp-1">{m}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </PanelCard>
  );
}
