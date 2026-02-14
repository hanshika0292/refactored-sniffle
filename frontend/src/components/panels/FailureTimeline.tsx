"use client";

import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import PanelCard from "@/components/ui/PanelCard";
import { FailureTimelineData } from "@/lib/types";

interface Props {
  data?: FailureTimelineData;
  isLoading: boolean;
}

const statusColors: Record<
  string,
  { dot: string; line: string; bg: string; text: string; badge: string }
> = {
  ok: {
    dot: "bg-green-500 dark:bg-green-400",
    line: "bg-green-200 dark:bg-green-800",
    bg: "bg-green-50 dark:bg-green-950/30",
    text: "text-green-700 dark:text-green-400",
    badge:
      "bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800",
  },
  warning: {
    dot: "bg-amber-500 dark:bg-amber-400",
    line: "bg-amber-200 dark:bg-amber-800",
    bg: "bg-amber-50 dark:bg-amber-950/30",
    text: "text-amber-700 dark:text-amber-400",
    badge:
      "bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  },
  critical: {
    dot: "bg-red-500 dark:bg-red-400",
    line: "bg-red-200 dark:bg-red-800",
    bg: "bg-red-50 dark:bg-red-950/30",
    text: "text-red-700 dark:text-red-400",
    badge:
      "bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800",
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
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 dark:text-gray-500">
                Survival Rate
              </span>
              <span className="text-base font-bold text-cyan-600 dark:text-cyan-400">
                {data.overall_survival_rate}
              </span>
            </div>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 text-right leading-tight max-w-[200px]">
              {data.critical_period}
            </p>
          </div>

          {/* Vertical timeline */}
          <div className="relative pl-5">
            {/* Connecting line */}
            <div className="absolute left-[7px] top-1 bottom-1 w-0.5 bg-gray-200 dark:bg-gray-800 rounded-full" />

            <div className="space-y-3">
              {data.timeline?.slice(0, 6).map((node, i) => {
                const colors = statusColors[node.status] || statusColors.ok;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.3 }}
                    className="relative"
                  >
                    {/* Dot */}
                    <div
                      className={`absolute -left-5 top-1.5 w-2.5 h-2.5 rounded-full ${colors.dot} ring-2 ring-white dark:ring-gray-900 z-10`}
                    />

                    {/* Content */}
                    <div className={`rounded-lg p-2.5 ${colors.bg}`}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span
                              className={`text-[10px] font-semibold uppercase tracking-wide ${colors.text}`}
                            >
                              {node.time_label}
                            </span>
                            <span
                              className={`text-[9px] px-1.5 py-0.5 rounded-full border ${colors.badge}`}
                            >
                              {node.probability}
                            </span>
                          </div>
                          <div className="text-xs font-medium text-gray-800 dark:text-gray-200">
                            {node.title}
                          </div>
                        </div>
                      </div>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 leading-relaxed line-clamp-2">
                        {node.description}
                      </p>
                      {node.mitigation && (
                        <p className="text-[10px] text-cyan-600 dark:text-cyan-400/70 mt-1">
                          Tip: {node.mitigation}
                        </p>
                      )}
                    </div>
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
