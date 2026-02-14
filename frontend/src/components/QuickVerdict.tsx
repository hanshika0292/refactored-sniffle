"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AnalysisResults } from "@/lib/types";
import {
  Layers,
  AlertTriangle,
  HeartPulse,
  Shield,
} from "lucide-react";

interface QuickVerdictProps {
  results: AnalysisResults;
}

function riskColor(level: string): string {
  switch (level) {
    case "low":
      return "text-green-600 dark:text-green-400";
    case "medium":
      return "text-amber-600 dark:text-amber-400";
    case "high":
      return "text-orange-600 dark:text-orange-400";
    case "critical":
      return "text-red-600 dark:text-red-400";
    default:
      return "text-gray-500";
  }
}

function riskBg(level: string): string {
  switch (level) {
    case "low":
      return "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800";
    case "medium":
      return "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800";
    case "high":
      return "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800";
    case "critical":
      return "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800";
    default:
      return "bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800";
  }
}

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 10 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 25 } },
};

export default function QuickVerdict({ results }: QuickVerdictProps) {
  const { system_overview, setup_risk_radar, failure_timeline, security_risk } = results;

  // Don't render until at least pass 1 is done
  if (!system_overview) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-7xl mx-auto mb-6"
    >
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3">
        <div className="flex flex-wrap items-center gap-3">
          <AnimatePresence mode="popLayout">
            {/* Architecture + Purpose (pass 1) */}
            {system_overview && (
              <motion.div
                key="arch"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="flex items-center gap-2 px-3 py-1.5 bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800 rounded-lg"
              >
                <Layers className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
                <div className="text-xs">
                  <span className="font-medium text-cyan-700 dark:text-cyan-300">
                    {system_overview.architecture_type}
                  </span>
                  <span className="text-gray-400 dark:text-gray-500 mx-1.5">|</span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {system_overview.components.length} components
                  </span>
                </div>
              </motion.div>
            )}

            {/* Risk + Complexity (pass 2) */}
            {setup_risk_radar && (
              <motion.div
                key="risk"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className={`flex items-center gap-2 px-3 py-1.5 border rounded-lg ${riskBg(setup_risk_radar.overall_risk)}`}
              >
                <AlertTriangle className={`w-3.5 h-3.5 shrink-0 ${riskColor(setup_risk_radar.overall_risk)}`} />
                <div className="text-xs">
                  <span className={`font-medium capitalize ${riskColor(setup_risk_radar.overall_risk)}`}>
                    {setup_risk_radar.overall_risk} risk
                  </span>
                  <span className="text-gray-400 dark:text-gray-500 mx-1.5">|</span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {setup_risk_radar.estimated_setup_time}
                  </span>
                </div>
              </motion.div>
            )}

            {/* Survival rate (pass 3) */}
            {failure_timeline && (
              <motion.div
                key="survival"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg"
              >
                <HeartPulse className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
                <div className="text-xs">
                  <span className="font-medium text-purple-700 dark:text-purple-300">
                    {failure_timeline.overall_survival_rate}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400 ml-1">survival</span>
                </div>
              </motion.div>
            )}

            {/* Security rating (pass 4) */}
            {security_risk && (
              <motion.div
                key="security"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className={`flex items-center gap-2 px-3 py-1.5 border rounded-lg ${riskBg(security_risk.security_rating)}`}
              >
                <Shield className={`w-3.5 h-3.5 shrink-0 ${riskColor(security_risk.security_rating)}`} />
                <div className="text-xs">
                  <span className={`font-medium capitalize ${riskColor(security_risk.security_rating)}`}>
                    {security_risk.security_rating}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400 ml-1">security</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
