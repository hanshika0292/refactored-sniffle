"use client";

import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface DiscoveryProgressProps {
  message: string;
  reasoning: string[];
}

export default function DiscoveryProgress({
  message,
  reasoning,
}: DiscoveryProgressProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Loader2 className="w-5 h-5 text-cyan-600 dark:text-cyan-400 animate-spin" />
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {message}
          </span>
        </div>

        {reasoning.length > 0 && (
          <div className="space-y-1.5 pl-8">
            {reasoning.slice(-3).map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-xs text-gray-400 dark:text-gray-500 flex items-start gap-2"
              >
                <span className="text-cyan-300 dark:text-cyan-800 mt-0.5">
                  -
                </span>
                <span>{step}</span>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
