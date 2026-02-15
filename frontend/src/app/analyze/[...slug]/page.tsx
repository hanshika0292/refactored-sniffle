"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAnalysis } from "@/hooks/useAnalysis";
import ProgressTracker from "@/components/ProgressTracker";
import AnalysisDashboard from "@/components/AnalysisDashboard";
import QuickVerdict from "@/components/QuickVerdict";
import ThemeToggle from "@/components/ThemeToggle";
import { PASS_ORDER } from "@/lib/types";
import { motion } from "framer-motion";
import { Box, ArrowLeft, RotateCcw } from "lucide-react";
import Link from "next/link";

export default function AnalyzePage() {
  const params = useParams();
  const router = useRouter();
  const { state, analyze, reset } = useAnalysis();
  const hasStarted = useRef(false);
  const [isCached, setIsCached] = useState(false);

  // Build repo path from slug segments
  const slug = params.slug as string[];
  const repoPath = slug?.join("/") ?? "";
  const repoUrl = `https://github.com/${repoPath}`;

  // Auto-start analysis on mount
  useEffect(() => {
    if (!repoPath || hasStarted.current) return;
    hasStarted.current = true;
    analyze(repoUrl);
  }, [repoPath, repoUrl, analyze]);

  // Track whether results came from cache
  useEffect(() => {
    if (state.status === "complete" && state.message === "Loaded from cache") {
      setIsCached(true);
    } else if (state.status === "analyzing") {
      setIsCached(false);
    }
  }, [state.status, state.message]);

  const completedPasses = PASS_ORDER.filter(
    (name) => state.results[name as keyof typeof state.results] !== undefined
  );

  const isAnalyzing = state.status === "analyzing";
  const isComplete = state.status === "complete";
  const isError = state.status === "error";
  const hasResults = completedPasses.length > 0;

  const handleReanalyze = () => {
    hasStarted.current = false;
    reset();
    setIsCached(false);
    // Small delay to let reset settle, then re-analyze
    setTimeout(() => {
      hasStarted.current = true;
      analyze(repoUrl, true);
    }, 50);
  };

  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
            >
              <Box className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              <h1 className="text-lg font-semibold tracking-tight">
                Glassbox{" "}
                <span className="text-cyan-600 dark:text-cyan-400">OSS</span>
              </h1>
            </Link>
            <span className="text-gray-300 dark:text-gray-600">·</span>
            <span className="text-sm text-gray-600 dark:text-gray-400 font-mono">
              {repoPath}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {isCached && (
              <button
                onClick={handleReanalyze}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/20 hover:bg-cyan-100 dark:hover:bg-cyan-900/40 border border-cyan-200 dark:border-cyan-800 rounded-lg transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                Re-analyze
              </button>
            )}
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              <ArrowLeft className="w-3 h-3" />
              Back
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 px-6 py-8">
        <div className="space-y-6">
          {isError && (
            <div className="max-w-2xl mx-auto text-center">
              <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-lg p-4">
                <p className="text-red-600 dark:text-red-400 text-sm">
                  {state.error}
                </p>
              </div>
              <button
                onClick={handleReanalyze}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Try Again
              </button>
            </div>
          )}

          {isAnalyzing && (
            <ProgressTracker
              currentPass={state.currentPass}
              completedPasses={completedPasses}
              reasoning={state.reasoning}
              message={state.message}
              status={state.status}
            />
          )}

          {isComplete && !isCached && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-sm text-cyan-600 dark:text-cyan-400"
            >
              All done! Here&apos;s everything we found.
            </motion.div>
          )}

          {isCached && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-xs text-gray-400 dark:text-gray-500"
            >
              Showing cached results. Click &quot;Re-analyze&quot; for a fresh scan.
            </motion.div>
          )}

          {hasResults && <QuickVerdict results={state.results} />}

          {(hasResults || isAnalyzing) && (
            <AnalysisDashboard
              results={state.results}
              currentPass={state.currentPass}
              status={state.status}
            />
          )}
        </div>
      </div>
    </main>
  );
}
