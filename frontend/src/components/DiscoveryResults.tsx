"use client";

import { motion } from "framer-motion";
import {
  Star,
  ExternalLink,
  Search,
  ArrowRight,
  ThumbsUp,
  AlertTriangle,
} from "lucide-react";
import { DiscoveryResult, RecommendedRepo } from "@/lib/types";

interface DiscoveryResultsProps {
  result: DiscoveryResult;
  onAnalyze: (url: string) => void;
}

function scoreColor(score: number): string {
  if (score >= 80) return "text-green-600 dark:text-green-400";
  if (score >= 60) return "text-amber-600 dark:text-amber-400";
  return "text-orange-600 dark:text-orange-400";
}

function scoreBg(score: number): string {
  if (score >= 80)
    return "bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-800";
  if (score >= 60)
    return "bg-amber-100 dark:bg-amber-900/30 border-amber-300 dark:border-amber-800";
  return "bg-orange-100 dark:bg-orange-900/30 border-orange-300 dark:border-orange-800";
}

function formatStars(stars: number): string {
  if (stars >= 1000) return `${(stars / 1000).toFixed(1)}k`;
  return String(stars);
}

function RepoCard({
  repo,
  index,
  onAnalyze,
}: {
  repo: RecommendedRepo;
  index: number;
  onAnalyze: (url: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden"
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className={`text-lg font-bold ${scoreColor(repo.match_score)}`}
          >
            #{repo.rank}
          </span>
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
            {repo.repo_name}
          </h3>
        </div>
        <div
          className={`px-2 py-0.5 text-xs rounded-full border ${scoreBg(repo.match_score)} ${scoreColor(repo.match_score)}`}
        >
          {repo.match_score}% match
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          {repo.description}
        </p>

        {/* Meta badges */}
        <div className="flex flex-wrap gap-2">
          {repo.language && (
            <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs rounded-full">
              {repo.language}
            </span>
          )}
          {repo.stars > 0 && (
            <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs rounded-full flex items-center gap-1">
              <Star className="w-3 h-3 text-amber-500 dark:text-amber-400" />
              {formatStars(repo.stars)}
            </span>
          )}
          {repo.license && (
            <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs rounded-full">
              {repo.license}
            </span>
          )}
        </div>

        {/* Tags */}
        {repo.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {repo.tags.map((tag, i) => (
              <span
                key={i}
                className="px-1.5 py-0.5 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400 text-[10px] rounded border border-cyan-200 dark:border-cyan-900/40"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Reasoning */}
        <p className="text-xs text-gray-500 dark:text-gray-400 italic">
          {repo.reasoning}
        </p>

        {/* Strengths */}
        {repo.strengths.length > 0 && (
          <div>
            <div className="flex items-center gap-1 mb-1">
              <ThumbsUp className="w-3 h-3 text-green-600 dark:text-green-400" />
              <span className="text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500">
                Why you'll love it
              </span>
            </div>
            <div className="space-y-1">
              {repo.strengths.map((s, i) => (
                <div
                  key={i}
                  className="text-xs text-gray-500 dark:text-gray-400 flex items-start gap-1.5"
                >
                  <span className="text-green-600 mt-0.5">+</span>
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Considerations */}
        {repo.considerations.length > 0 && (
          <div>
            <div className="flex items-center gap-1 mb-1">
              <AlertTriangle className="w-3 h-3 text-amber-500 dark:text-amber-400" />
              <span className="text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500">
                Good to know
              </span>
            </div>
            <div className="space-y-1">
              {repo.considerations.map((c, i) => (
                <div
                  key={i}
                  className="text-xs text-gray-500 dark:text-gray-400 flex items-start gap-1.5"
                >
                  <span className="text-amber-600 mt-0.5">!</span>
                  <span>{c}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={() => onAnalyze(repo.github_url)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium rounded-lg transition-colors"
          >
            <Search className="w-3 h-3" />
            Explore This
            <ArrowRight className="w-3 h-3" />
          </button>
          <a
            href={repo.github_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium rounded-lg transition-colors border border-gray-300 dark:border-gray-700"
          >
            <ExternalLink className="w-3 h-3" />
            GitHub
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export default function DiscoveryResults({
  result,
  onAnalyze,
}: DiscoveryResultsProps) {
  return (
    <div className="space-y-6">
      {/* Summary */}
      {result.summary && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto text-center"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {result.query_interpretation}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
            {result.summary}
          </p>
        </motion.div>
      )}

      {/* Recommendations grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
        {result.recommendations.map((repo, i) => (
          <RepoCard
            key={repo.github_url}
            repo={repo}
            index={i}
            onAnalyze={onAnalyze}
          />
        ))}
      </div>
    </div>
  );
}
