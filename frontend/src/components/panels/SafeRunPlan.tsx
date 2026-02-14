"use client";

import { useState } from "react";
import {
  Play,
  Copy,
  Check,
  Terminal,
  AlertTriangle,
  Shield,
} from "lucide-react";
import PanelCard from "@/components/ui/PanelCard";
import { SafeRunPlanData } from "@/lib/types";

interface Props {
  data?: SafeRunPlanData;
  isLoading: boolean;
}

const riskBadge: Record<string, { bg: string; icon: React.ReactNode }> = {
  safe: {
    bg: "bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 border border-green-300 dark:border-green-800/50",
    icon: <Shield className="w-3 h-3" />,
  },
  caution: {
    bg: "bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 border border-amber-300 dark:border-amber-800/50",
    icon: <AlertTriangle className="w-3 h-3" />,
  },
  danger: {
    bg: "bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-800/50",
    icon: <AlertTriangle className="w-3 h-3" />,
  },
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
      className="shrink-0 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
      title="Copy to clipboard"
    >
      {copied ? (
        <Check className="w-3 h-3 text-green-500 dark:text-green-400" />
      ) : (
        <Copy className="w-3 h-3" />
      )}
    </button>
  );
}

function CopyAllButton({ commands }: { commands: string[] }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(commands.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (commands.length <= 1) return null;

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1 text-[10px] text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
      title="Copy all commands"
    >
      {copied ? (
        <>
          <Check className="w-3 h-3 text-green-500 dark:text-green-400" />
          <span className="text-green-500 dark:text-green-400">Copied!</span>
        </>
      ) : (
        <>
          <Copy className="w-3 h-3" />
          <span>Copy all</span>
        </>
      )}
    </button>
  );
}

export default function SafeRunPlan({ data, isLoading }: Props) {
  return (
    <PanelCard
      title="Let's Run It"
      icon={<Play className="w-4 h-4" />}
      isLoading={isLoading}
      isEmpty={!data}
    >
      {data && (
        <div className="space-y-4">
          {/* Meta info */}
          <div className="flex items-center gap-4 text-xs">
            <span className="text-gray-400 dark:text-gray-500">
              Time needed:{" "}
              <span className="text-gray-600 dark:text-gray-300">
                {data.estimated_time}
              </span>
            </span>
            <span className="text-gray-400 dark:text-gray-500">
              Safety tip:{" "}
              <span className="text-cyan-600 dark:text-cyan-400">
                {data.sandbox_recommendation}
              </span>
            </span>
          </div>

          {/* Steps */}
          <div className="space-y-3">
            {data.steps?.map((step, i) => {
              const risk = riskBadge[step.risk_level] || riskBadge.safe;
              return (
                <div
                  key={i}
                  className="bg-gray-50 dark:bg-gray-800/50 rounded-lg overflow-hidden"
                >
                  {/* Step header */}
                  <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-200 dark:border-gray-800/50">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-cyan-100 dark:bg-cyan-900/40 text-cyan-600 dark:text-cyan-400 text-[10px] font-bold shrink-0">
                      {step.step_number}
                    </span>
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200 flex-1">
                      {step.title}
                    </span>
                    <span
                      className={`flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full ${risk.bg}`}
                    >
                      {risk.icon}
                      {step.risk_level}
                    </span>
                  </div>

                  {/* Commands block */}
                  {step.commands && step.commands.length > 0 && (
                    <div className="bg-gray-100 dark:bg-gray-950/80 mx-2 mt-2 rounded-md overflow-hidden">
                      <div className="flex items-center justify-between px-2.5 py-1 border-b border-gray-200 dark:border-gray-800/50">
                        <div className="flex items-center gap-1.5 text-[10px] text-gray-400 dark:text-gray-500">
                          <Terminal className="w-3 h-3" />
                          <span>Commands</span>
                        </div>
                        <CopyAllButton commands={step.commands} />
                      </div>
                      <div className="p-2 space-y-1">
                        {step.commands.map((cmd, j) => (
                          <div
                            key={j}
                            className="flex items-center gap-2 group"
                          >
                            <code className="flex-1 text-[11px] text-cyan-700 dark:text-cyan-300/80 font-mono px-1.5 py-0.5 leading-relaxed">
                              <span className="text-gray-400 dark:text-gray-600 select-none">
                                ${" "}
                              </span>
                              {cmd}
                            </code>
                            <CopyButton text={cmd} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  {step.notes && (
                    <p className="text-[11px] text-gray-400 dark:text-gray-500 px-3 py-2 leading-relaxed">
                      {step.notes}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Env vars */}
          {data.env_vars && data.env_vars.length > 0 && (
            <div>
              <div className="text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
                Settings You'll Need
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg overflow-hidden">
                {data.env_vars.slice(0, 5).map((v, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-3 py-2 text-xs border-b border-gray-200 dark:border-gray-800 last:border-0"
                  >
                    <div className="flex items-center gap-1.5 shrink-0">
                      <code className="text-cyan-600 dark:text-cyan-400 font-mono text-[11px]">
                        {v.name}
                      </code>
                      <CopyButton text={`${v.name}=${v.example}`} />
                    </div>
                    <span className="text-gray-400 dark:text-gray-500 flex-1 truncate">
                      {v.description}
                    </span>
                    {v.required && (
                      <span className="text-red-500 dark:text-red-400/60 text-[10px] shrink-0">
                        required
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Smoke test */}
          {data.smoke_test && (
            <div className="bg-cyan-50 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-900/40 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs text-cyan-600 dark:text-cyan-400 font-medium">
                  Quick Health Check
                </div>
              </div>
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-950/60 rounded-md px-2.5 py-1.5">
                <code className="flex-1 text-[11px] text-cyan-700 dark:text-cyan-300/80 font-mono">
                  <span className="text-gray-400 dark:text-gray-600 select-none">
                    ${" "}
                  </span>
                  {data.smoke_test.command}
                </code>
                <CopyButton text={data.smoke_test.command} />
              </div>
              <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-2">
                Expected: {data.smoke_test.expected_output}
              </p>
            </div>
          )}
        </div>
      )}
    </PanelCard>
  );
}
