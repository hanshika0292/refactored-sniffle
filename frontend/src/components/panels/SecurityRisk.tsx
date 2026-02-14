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
        <div className="space-y-4">
          {/* Security rating */}
          <div className="flex items-center justify-between">
            <span
              className={`px-3 py-1 text-sm font-medium rounded-full border ${
                ratingColors[data.security_rating] || ratingColors.medium
              }`}
            >
              {data.security_rating?.toUpperCase()}
            </span>
            <div className="flex gap-3 text-xs">
              <span className="text-gray-400 dark:text-gray-500">
                Data:{" "}
                <span className="text-gray-600 dark:text-gray-300">
                  {data.data_exposure_risk}
                </span>
              </span>
              <span className="text-gray-400 dark:text-gray-500">
                Supply Chain:{" "}
                <span className="text-gray-600 dark:text-gray-300">
                  {data.supply_chain_risk}
                </span>
              </span>
            </div>
          </div>

          {/* Findings */}
          {data.findings && data.findings.length > 0 && (
            <div className="space-y-2">
              {data.findings.slice(0, 4).map((finding, i) => (
                <div
                  key={i}
                  className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2.5"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-medium uppercase ${
                        severityColors[finding.severity] || "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {finding.severity}
                    </span>
                    <span className="text-sm text-gray-800 dark:text-gray-200">
                      {finding.title}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {finding.description}
                  </p>
                  <p className="text-xs text-cyan-600 dark:text-cyan-400/70 mt-1">
                    Fix: {finding.recommendation}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Positive practices */}
          {data.positive_practices && data.positive_practices.length > 0 && (
            <div>
              <div className="text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1.5">
                What They're Doing Right
              </div>
              {data.positive_practices.slice(0, 3).map((practice, i) => (
                <div
                  key={i}
                  className="text-xs text-green-600 dark:text-green-400/70 flex gap-2 mb-1"
                >
                  <span className="shrink-0">&#10003;</span>
                  <span>{practice}</span>
                </div>
              ))}
            </div>
          )}

          {/* Missing protections */}
          {data.missing_protections && data.missing_protections.length > 0 && (
            <div>
              <div className="text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1.5">
                Room for Improvement
              </div>
              {data.missing_protections.slice(0, 3).map((item, i) => (
                <div
                  key={i}
                  className="text-xs text-red-500 dark:text-red-400/70 flex gap-2 mb-1"
                >
                  <span className="shrink-0">&#10007;</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </PanelCard>
  );
}
