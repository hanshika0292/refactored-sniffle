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
  { bg: string; border: string; dot: string; text: string }
> = {
  ok: {
    bg: "bg-green-50 dark:bg-green-900/20",
    border: "border-green-300 dark:border-green-700",
    dot: "bg-green-500 dark:bg-green-400",
    text: "text-green-600 dark:text-green-400",
  },
  warning: {
    bg: "bg-amber-50 dark:bg-amber-900/20",
    border: "border-amber-300 dark:border-amber-700",
    dot: "bg-amber-500 dark:bg-amber-400",
    text: "text-amber-600 dark:text-amber-400",
  },
  critical: {
    bg: "bg-red-50 dark:bg-red-900/20",
    border: "border-red-300 dark:border-red-700",
    dot: "bg-red-500 dark:bg-red-400",
    text: "text-red-600 dark:text-red-400",
  },
};

export default function FailureTimeline({ data, isLoading }: Props) {
  return (
    <PanelCard
      title="What Could Go Wrong"
      icon={<Clock className="w-4 h-4" />}
      isLoading={isLoading}
      isEmpty={!data}
      className=""
    >
      {data && (
        <div className="space-y-4">
          {/* Header stats */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400 dark:text-gray-500">
                Survival Rate
              </span>
              <span className="text-lg font-bold text-cyan-600 dark:text-cyan-400">
                {data.overall_survival_rate}
              </span>
            </div>
            <div className="text-xs text-gray-400 dark:text-gray-500 max-w-xs text-right">
              {data.critical_period}
            </div>
          </div>

          {/* Horizontal timeline */}
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-200 dark:bg-gray-800" />
            <div className="flex justify-between relative">
              {data.timeline?.map((node, i) => {
                const colors = statusColors[node.status] || statusColors.ok;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.15, duration: 0.4 }}
                    className="flex flex-col items-center flex-1 group"
                  >
                    {/* Node dot */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.15 + 0.2, type: "spring" }}
                      className={`w-8 h-8 rounded-full ${colors.bg} border-2 ${colors.border} flex items-center justify-center z-10`}
                    >
                      <div
                        className={`w-2.5 h-2.5 rounded-full ${colors.dot}`}
                      />
                    </motion.div>

                    {/* Time label */}
                    <div
                      className={`text-[10px] font-medium mt-1.5 ${colors.text}`}
                    >
                      {node.time_label}
                    </div>

                    {/* Event card */}
                    <div
                      className={`mt-2 w-full px-2 py-2 ${colors.bg} border ${colors.border} rounded-lg`}
                    >
                      <div className="text-xs font-medium text-gray-800 dark:text-gray-200 text-center">
                        {node.title}
                      </div>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 text-center leading-tight">
                        {node.description}
                      </p>
                      <div className="flex justify-center mt-1.5">
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded-full ${colors.bg} ${colors.text} border ${colors.border}`}
                        >
                          {node.probability}
                        </span>
                      </div>
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
