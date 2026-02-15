"use client";

import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import PanelCard from "@/components/ui/PanelCard";
import { FailureTimelineData } from "@/lib/types";

interface Props {
  data?: FailureTimelineData;
  isLoading: boolean;
}

const statusColors: Record<string, { dot: string; text: string }> = {
  ok: {
    dot: "bg-green-500 dark:bg-green-400",
    text: "text-green-700 dark:text-green-400",
  },
  warning: {
    dot: "bg-amber-500 dark:bg-amber-400",
    text: "text-amber-700 dark:text-amber-400",
  },
  critical: {
    dot: "bg-red-500 dark:bg-red-400",
    text: "text-red-700 dark:text-red-400",
  },
};

export default function FailureTimeline({ data, isLoading }: Props) {
  return (
    <PanelCard
      title="What Could Go Wrong"
      icon={<Clock className="w-4 h-4" />}
      isLoading={isLoading}
      isEmpty={!data}
    >
      {data && (
        <div className="space-y-3">
          {/* Header stats */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 dark:text-gray-500">Survival</span>
              <span className="text-sm font-bold text-cyan-600 dark:text-cyan-400">
                {data.overall_survival_rate}
              </span>
            </div>
            <span className="text-[10px] text-gray-400 dark:text-gray-500 max-w-[180px] text-right truncate">
              {data.critical_period}
            </span>
          </div>

          {/* Compact timeline */}
          <div className="relative pl-4">
            <div className="absolute left-[5px] top-1 bottom-1 w-0.5 bg-gray-200 dark:bg-gray-800 rounded-full" />
            <div className="space-y-1.5">
              {data.timeline?.slice(0, 5).map((node, i) => {
                const colors = statusColors[node.status] || statusColors.ok;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="relative flex items-center gap-2 py-0.5"
                  >
                    <div
                      className={`absolute -left-4 w-2 h-2 rounded-full ${colors.dot} ring-2 ring-white dark:ring-gray-900 z-10`}
                    />
                    <span className={`text-[10px] font-semibold uppercase ${colors.text} shrink-0 w-14`}>
                      {node.time_label}
                    </span>
                    <span className="text-xs text-gray-700 dark:text-gray-300 truncate flex-1">
                      {node.title}
                    </span>
                    <span className="text-[9px] text-gray-400 dark:text-gray-500 shrink-0">
                      {node.probability}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </PanelCard>
  );
}
