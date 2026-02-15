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
        <div className="space-y-3">
          {/* Purpose — compact */}
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">
            {data.purpose}
          </p>

          {/* Architecture badge */}
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-cyan-100 dark:bg-cyan-900/40 text-cyan-600 dark:text-cyan-400 text-xs rounded-full border border-cyan-200 dark:border-cyan-800">
              {data.architecture_type}
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {data.components?.length} components
            </span>
          </div>

          {/* Components — name + tech tags only */}
          <div className="space-y-1.5">
            {data.components?.slice(0, 4).map((comp, i) => (
              <div key={i} className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {comp.name}
                </span>
                {comp.tech?.slice(0, 3).map((t, j) => (
                  <span
                    key={j}
                    className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-[10px] rounded"
                  >
                    {t}
                  </span>
                ))}
              </div>
            ))}
          </div>

          {/* Key deps — compact inline */}
          {data.key_dependencies && data.key_dependencies.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              <span className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 self-center mr-1">
                Deps
              </span>
              {data.key_dependencies.slice(0, 5).map((dep, i) => (
                <span
                  key={i}
                  className="px-1.5 py-0.5 bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 text-[10px] rounded border border-gray-200 dark:border-gray-700"
                  title={dep.purpose}
                >
                  {dep.name}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </PanelCard>
  );
}
