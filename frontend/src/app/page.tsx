"use client";

import { useState } from "react";
import { useAnalysis } from "@/hooks/useAnalysis";
import { useDiscovery } from "@/hooks/useDiscovery";
import InputBar from "@/components/InputBar";
import ProgressTracker from "@/components/ProgressTracker";
import AnalysisDashboard from "@/components/AnalysisDashboard";
import ModeTabs from "@/components/ModeTabs";
import DiscoveryInput from "@/components/DiscoveryInput";
import DiscoveryProgress from "@/components/DiscoveryProgress";
import DiscoveryResults from "@/components/DiscoveryResults";
import ThemeToggle from "@/components/ThemeToggle";
import { PASS_ORDER, AppMode, DiscoveryFilters } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import { Box, RotateCcw } from "lucide-react";

export default function Home() {
  const [mode, setMode] = useState<AppMode>("discover");
  const { state, analyze, reset } = useAnalysis();
  const {
    state: discoveryState,
    discover,
    reset: resetDiscovery,
  } = useDiscovery();

  const completedPasses = PASS_ORDER.filter(
    (name) => state.results[name as keyof typeof state.results] !== undefined
  );

  const isIdle = state.status === "idle";
  const isAnalyzing = state.status === "analyzing";
  const isComplete = state.status === "complete";
  const isError = state.status === "error";
  const hasResults = completedPasses.length > 0;

  const isDiscoveryIdle = discoveryState.status === "idle";
  const isSearching = discoveryState.status === "searching";
  const isDiscoveryComplete = discoveryState.status === "complete";
  const isDiscoveryError = discoveryState.status === "error";

  const handleAnalyzeFromDiscovery = (url: string) => {
    setMode("analyze");
    analyze(url);
  };

  const handleDiscover = (query: string, filters: DiscoveryFilters) => {
    discover(query, filters);
  };

  const handleReset = () => {
    if (mode === "analyze") {
      reset();
    } else {
      resetDiscovery();
    }
  };

  const showReset =
    (mode === "analyze" && !isIdle) ||
    (mode === "discover" && !isDiscoveryIdle);

  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <Box className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              <h1 className="text-lg font-semibold tracking-tight">
                Glassbox{" "}
                <span className="text-cyan-600 dark:text-cyan-400">OSS</span>
              </h1>
            </div>
            <ModeTabs mode={mode} onModeChange={setMode} />
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {showReset && (
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                {mode === "analyze" ? "Start Over" : "New Search"}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 px-6 py-8">
        <AnimatePresence mode="wait">
          {/* ===== ANALYZE MODE ===== */}
          {mode === "analyze" && isIdle && (
            <motion.div
              key="analyze-hero"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto text-center pt-24"
            >
              <h2 className="text-4xl font-bold tracking-tight mb-3">
                Get to Know Any{" "}
                <span className="text-cyan-600 dark:text-cyan-400">
                  Open Source
                </span>{" "}
                Project
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8 text-lg">
                Paste a GitHub link and we'll walk you through what it does,
                how to set it up, and what to watch out for — no jargon, just
                clarity.
              </p>
              <InputBar onSubmit={analyze} isLoading={false} />
            </motion.div>
          )}

          {mode === "analyze" && (isAnalyzing || isComplete || isError) && (
            <motion.div
              key="analyze-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="max-w-2xl mx-auto">
                <InputBar onSubmit={analyze} isLoading={isAnalyzing} />
              </div>

              {isError && (
                <div className="max-w-2xl mx-auto text-center">
                  <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-lg p-4">
                    <p className="text-red-600 dark:text-red-400 text-sm">
                      {state.error}
                    </p>
                  </div>
                </div>
              )}

              {isAnalyzing && (
                <ProgressTracker
                  currentPass={state.currentPass}
                  completedPasses={completedPasses}
                  reasoning={state.reasoning}
                  message={state.message}
                />
              )}

              {isComplete && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center text-sm text-cyan-600 dark:text-cyan-400"
                >
                  All done! Here's everything we found.
                </motion.div>
              )}

              {hasResults && (
                <AnalysisDashboard
                  results={state.results}
                  currentPass={state.currentPass}
                />
              )}
            </motion.div>
          )}

          {/* ===== DISCOVER MODE ===== */}
          {mode === "discover" && isDiscoveryIdle && (
            <motion.div
              key="discover-hero"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto text-center pt-24"
            >
              <h2 className="text-4xl font-bold tracking-tight mb-3">
                Find Your Next Favorite{" "}
                <span className="text-cyan-600 dark:text-cyan-400">
                  Open Source
                </span>{" "}
                Project
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8 text-lg">
                Open source powers the world — from the apps on your phone to
                the sites you visit every day. Tell us what you're building and
                we'll introduce you to the projects that can help.
              </p>
              <DiscoveryInput onSubmit={handleDiscover} isLoading={false} />
            </motion.div>
          )}

          {mode === "discover" &&
            (isSearching || isDiscoveryComplete || isDiscoveryError) && (
              <motion.div
                key="discover-results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="max-w-2xl mx-auto">
                  <DiscoveryInput
                    onSubmit={handleDiscover}
                    isLoading={isSearching}
                  />
                </div>

                {isDiscoveryError && (
                  <div className="max-w-2xl mx-auto text-center">
                    <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-lg p-4">
                      <p className="text-red-600 dark:text-red-400 text-sm">
                        {discoveryState.error}
                      </p>
                    </div>
                  </div>
                )}

                {isSearching && (
                  <DiscoveryProgress
                    message={discoveryState.message}
                    reasoning={discoveryState.reasoning}
                  />
                )}

                {isDiscoveryComplete && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center text-sm text-cyan-600 dark:text-cyan-400"
                  >
                    We found{" "}
                    {discoveryState.result?.recommendations.length || 0}{" "}
                    projects for you!
                  </motion.div>
                )}

                {discoveryState.result && (
                  <DiscoveryResults
                    result={discoveryState.result}
                    onAnalyze={handleAnalyzeFromDiscovery}
                  />
                )}
              </motion.div>
            )}
        </AnimatePresence>
      </div>
    </main>
  );
}
