"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { ReactNode } from "react";

interface PanelCardProps {
  title: string;
  icon: ReactNode;
  isLoading?: boolean;
  isEmpty?: boolean;
  className?: string;
  children: ReactNode;
}

export default function PanelCard({
  title,
  icon,
  isLoading,
  isEmpty,
  className = "",
  children,
}: PanelCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden ${className}`}
    >
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2">
        <span className="text-cyan-600 dark:text-cyan-400">{icon}</span>
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
          {title}
        </h3>
      </div>
      <div className="p-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 text-gray-300 dark:text-gray-600 animate-spin" />
          </div>
        ) : isEmpty ? (
          <div className="text-center text-gray-400 dark:text-gray-600 py-8 text-sm">
            Hang tight, we're looking into this...
          </div>
        ) : (
          children
        )}
      </div>
    </motion.div>
  );
}
