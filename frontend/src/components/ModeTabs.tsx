"use client";

import { AppMode } from "@/lib/types";
import { motion } from "framer-motion";
import { Search, Compass } from "lucide-react";

interface ModeTabsProps {
  mode: AppMode;
  onModeChange: (mode: AppMode) => void;
}

const tabs: { key: AppMode; label: string; icon: React.ReactNode }[] = [
  { key: "analyze", label: "Explore", icon: <Search className="w-3.5 h-3.5" /> },
  { key: "discover", label: "Discover", icon: <Compass className="w-3.5 h-3.5" /> },
];

export default function ModeTabs({ mode, onModeChange }: ModeTabsProps) {
  return (
    <div className="flex items-center bg-gray-100 dark:bg-gray-900 rounded-lg p-0.5 border border-gray-200 dark:border-gray-800">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onModeChange(tab.key)}
          className={`relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            mode === tab.key
              ? "text-gray-900 dark:text-white"
              : "text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          {mode === tab.key && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-white dark:bg-gray-800 rounded-md shadow-sm"
              transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
            />
          )}
          <span className="relative flex items-center gap-1.5">
            {tab.icon}
            {tab.label}
          </span>
        </button>
      ))}
    </div>
  );
}
