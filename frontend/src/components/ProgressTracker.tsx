"use client";

import { motion } from "framer-motion";
import { Check, Loader2, Circle } from "lucide-react";
import { PASS_ORDER, PASS_NAMES, AnalysisStatus } from "@/lib/types";

interface ProgressTrackerProps {
  currentPass: number;
  completedPasses: string[];
  reasoning: string[];
  message: string;
  status?: AnalysisStatus;
}

export default function ProgressTracker({
  completedPasses,
  reasoning,
  message,
  status,
}: ProgressTrackerProps) {
  const isAnalyzing = status === "analyzing";

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      {/* Step indicators */}
      <div className="relative flex items-start justify-between mb-6">
        {/* Connecting line (background) */}
        <div className="absolute top-4 left-4 right-4 h-px bg-gray-200 dark:bg-gray-800" />
        {/* Connecting line (progress fill) */}
        <motion.div
          className="absolute top-4 left-4 h-px bg-cyan-600 origin-left"
          initial={{ width: 0 }}
          animate={{
            width:
              completedPasses.length > 0
                ? `${((Math.max(0, completedPasses.length - 1)) / (PASS_ORDER.length - 1)) * 100}%`
                : "0%",
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          style={{ maxWidth: "calc(100% - 2rem)" }}
        />

        {PASS_ORDER.map((passName) => {
          const isComplete = completedPasses.includes(passName);
          // In parallel mode, all non-completed passes are active
          const isActive = isAnalyzing && !isComplete;

          return (
            <div
              key={passName}
              className="relative flex flex-col items-center"
              style={{ width: `${100 / PASS_ORDER.length}%` }}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{
                  scale: isActive ? 1.1 : 1,
                  opacity: isComplete || isActive ? 1 : 0.4,
                }}
                className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                  isComplete
                    ? "bg-cyan-600 text-white"
                    : isActive
                    ? "bg-cyan-100 dark:bg-cyan-600/30 text-cyan-600 dark:text-cyan-400 ring-2 ring-cyan-500"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500"
                }`}
              >
                {isComplete ? (
                  <Check className="w-4 h-4" />
                ) : isActive ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Circle className="w-3 h-3" />
                )}
              </motion.div>
              <span
                className={`mt-2 text-[10px] text-center leading-tight max-w-[80px] ${
                  isComplete || isActive
                    ? "text-gray-700 dark:text-gray-300"
                    : "text-gray-400 dark:text-gray-600"
                }`}
              >
                {PASS_NAMES[passName]}
              </span>
            </div>
          );
        })}
      </div>

      {/* Status message */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-400 mb-3">
        {message || `Running all passes in parallel (${completedPasses.length}/${PASS_ORDER.length} done)`}
      </div>

      {/* Reasoning chain */}
      {reasoning.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-lg p-4 max-h-32 overflow-y-auto"
        >
          <div className="text-xs text-gray-400 dark:text-gray-500 mb-2 uppercase tracking-wider">
            What we&apos;re thinking...
          </div>
          {reasoning.slice(-3).map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="text-xs text-gray-500 dark:text-gray-400 flex gap-2 mb-1"
            >
              <span className="text-cyan-600 dark:text-cyan-500 shrink-0">
                -&gt;
              </span>
              <span>{step}</span>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
