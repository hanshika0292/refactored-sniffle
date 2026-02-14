"use client";

import { useState } from "react";
import { Compass, Loader2, ChevronDown, ChevronUp, Check } from "lucide-react";
import {
  DiscoveryFilters,
  DEFAULT_FILTERS,
  LANGUAGE_OPTIONS,
  DOMAIN_OPTIONS,
  SCALE_OPTIONS,
} from "@/lib/types";

interface DiscoveryInputProps {
  onSubmit: (query: string, filters: DiscoveryFilters) => void;
  isLoading: boolean;
}

export default function DiscoveryInput({ onSubmit, isLoading }: DiscoveryInputProps) {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<DiscoveryFilters>({ ...DEFAULT_FILTERS });
  const [showFilters, setShowFilters] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length >= 10 && !isLoading) {
      onSubmit(query.trim(), filters);
    }
  };

  const toggleLanguage = (lang: string) => {
    setFilters((prev) => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter((l) => l !== lang)
        : [...prev.languages, lang],
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-3">
      <div className="flex gap-3">
        <div className="flex-1">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What are you building or looking for? Tell us in your own words... (e.g., I want to build a personal blog with a nice design)"
            className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors resize-none h-20"
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={query.trim().length < 10 || isLoading}
          className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:text-gray-400 dark:disabled:text-gray-500 text-white font-medium rounded-lg transition-colors flex items-center gap-2 self-start"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Compass className="w-4 h-4" />
          )}
          {isLoading ? "Searching..." : "Discover"}
        </button>
      </div>

      {/* Filter toggle */}
      <button
        type="button"
        onClick={() => setShowFilters(!showFilters)}
        className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
      >
        {showFilters ? (
          <ChevronUp className="w-3 h-3" />
        ) : (
          <ChevronDown className="w-3 h-3" />
        )}
        {showFilters ? "Hide filters" : "Show filters"}
        {(filters.languages.length > 0 || filters.domain || filters.scale) && (
          <span className="ml-1 px-1.5 py-0.5 bg-cyan-100 dark:bg-cyan-900/40 text-cyan-600 dark:text-cyan-400 text-[10px] rounded-full">
            Active
          </span>
        )}
      </button>

      {/* Filters panel */}
      {showFilters && (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 space-y-4">
          {/* Languages */}
          <div>
            <div className="text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
              Languages
            </div>
            <div className="flex flex-wrap gap-1.5">
              {LANGUAGE_OPTIONS.map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => toggleLanguage(lang)}
                  className={`px-2.5 py-1 text-xs rounded-full border transition-colors ${
                    filters.languages.includes(lang)
                      ? "bg-cyan-100 dark:bg-cyan-900/40 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Domain */}
          <div>
            <div className="text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
              Domain
            </div>
            <div className="flex flex-wrap gap-1.5">
              {DOMAIN_OPTIONS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      domain: prev.domain === d ? "" : d,
                    }))
                  }
                  className={`px-2.5 py-1 text-xs rounded-full border transition-colors ${
                    filters.domain === d
                      ? "bg-cyan-100 dark:bg-cyan-900/40 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Scale */}
          <div>
            <div className="text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
              Scale
            </div>
            <div className="flex flex-wrap gap-1.5">
              {SCALE_OPTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      scale: prev.scale === s ? "" : s,
                    }))
                  }
                  className={`px-2.5 py-1 text-xs rounded-full border transition-colors ${
                    filters.scale === s
                      ? "bg-cyan-100 dark:bg-cyan-900/40 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Actively maintained */}
          <div>
            <button
              type="button"
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  actively_maintained:
                    prev.actively_maintained === true ? null : true,
                }))
              }
              className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              <div
                className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                  filters.actively_maintained === true
                    ? "bg-cyan-600 border-cyan-500"
                    : "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                }`}
              >
                {filters.actively_maintained === true && (
                  <Check className="w-3 h-3 text-white" />
                )}
              </div>
              Only show actively maintained projects
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
