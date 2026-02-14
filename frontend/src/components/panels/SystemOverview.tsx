"use client";

import { Cpu } from "lucide-react";
import PanelCard from "@/components/ui/PanelCard";
import { SystemOverviewData } from "@/lib/types";

interface Props {
  data?: SystemOverviewData;
  isLoading: boolean;
}

export default function SystemOverview({ data, isLoading }: Props) {
  return (
    <PanelCard
      title="The Big Picture"
      icon={<Cpu className="w-4 h-4" />}
      isLoading={isLoading}
      isEmpty={!data}
    >
      {data && (
        <div className="space-y-4">
          {/* Purpose */}
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            {data.purpose}
          </p>

          {/* Architecture badge */}
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500">
              How It's Built
            </span>
            <span className="px-2 py-0.5 bg-cyan-100 dark:bg-cyan-900/40 text-cyan-600 dark:text-cyan-400 text-xs rounded-full border border-cyan-200 dark:border-cyan-800">
              {data.architecture_type}
            </span>
          </div>

          {/* Components */}
          <div>
            <div className="text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
              Building Blocks
            </div>
            <div className="space-y-2">
              {data.components?.slice(0, 5).map((comp, i) => (
                <div
                  key={i}
                  className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2.5"
                >
                  <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {comp.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {comp.description}
                  </div>
                  <div className="flex gap-1.5 mt-1.5 flex-wrap">
                    {comp.tech?.map((t, j) => (
                      <span
                        key={j}
                        className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-[10px] rounded"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Data flows */}
          {data.data_flows && data.data_flows.length > 0 && (
            <div>
              <div className="text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
                How Data Moves
              </div>
              {data.data_flows.slice(0, 4).map((flow, i) => (
                <div
                  key={i}
                  className="text-xs text-gray-500 dark:text-gray-400 flex gap-2 mb-1"
                >
                  <span className="text-cyan-600 dark:text-cyan-500 shrink-0">
                    &#8594;
                  </span>
                  <span>{flow}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </PanelCard>
  );
}
