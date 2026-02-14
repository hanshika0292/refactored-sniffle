"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Copy, Check, Loader2 } from "lucide-react";
import { ClaudeToolkitData } from "@/lib/types";

interface Props {
  data?: ClaudeToolkitData;
  isLoading: boolean;
}

const techniqueBadgeColors: Record<string, string> = {
  "Chain of Thought":
    "bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 border-violet-300 dark:border-violet-700/50",
  "Role Prompting":
    "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700/50",
  "Structured Output":
    "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700/50",
  "Multi-Step Planning":
    "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700/50",
  "Contextual Grounding":
    "bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300 border-cyan-300 dark:border-cyan-700/50",
  "Red Team":
    "bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-700/50",
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
      title="Copy prompt to clipboard"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-green-500 dark:text-green-400" />
          <span className="text-green-600 dark:text-green-400">Copied!</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" />
          <span>Copy prompt</span>
        </>
      )}
    </button>
  );
}

export default function ClaudeToolkit({ data, isLoading }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-xl p-[1px] bg-gradient-to-r from-violet-500 via-cyan-500 to-violet-500"
    >
      <div className="bg-white dark:bg-gray-900 rounded-[11px] overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2.5">
          <span className="text-violet-500 dark:text-violet-400">
            <Sparkles className="w-4 h-4" />
          </span>
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            Your Claude Toolkit
          </h3>
        </div>

        {/* Content */}
        <div className="p-5">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-gray-300 dark:text-gray-600 animate-spin" />
            </div>
          ) : !data ? (
            <div className="text-center text-gray-400 dark:text-gray-600 py-8 text-sm">
              Hang tight, we&apos;re crafting your toolkit...
            </div>
          ) : (
            <div className="space-y-5">
              {/* Intro */}
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {data.intro}
              </p>

              {/* Prompt cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.prompts?.map((prompt, i) => {
                  const badgeColor =
                    techniqueBadgeColors[prompt.technique] ||
                    techniqueBadgeColors["Chain of Thought"];

                  return (
                    <div
                      key={i}
                      className="bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col"
                    >
                      {/* Card header */}
                      <div className="px-4 pt-4 pb-3 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-snug">
                            {prompt.title}
                          </h4>
                          <span
                            className={`shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full border ${badgeColor}`}
                          >
                            {prompt.technique}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {prompt.use_case}
                        </p>
                      </div>

                      {/* Prompt text */}
                      <div className="mx-4 mb-3 bg-gray-100 dark:bg-gray-950/60 rounded-lg p-3 flex-1">
                        <p className="text-[11px] text-gray-700 dark:text-gray-300 font-mono leading-relaxed whitespace-pre-wrap break-words">
                          {prompt.prompt_text}
                        </p>
                      </div>

                      {/* Footer */}
                      <div className="px-4 pb-3 flex items-center justify-between gap-2">
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 italic leading-snug flex-1">
                          {prompt.technique_explanation}
                        </p>
                        <CopyButton text={prompt.prompt_text} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
