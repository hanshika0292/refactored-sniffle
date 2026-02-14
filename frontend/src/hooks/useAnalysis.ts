"use client";

import { useState, useCallback, useRef } from "react";
import { AnalysisState, AnalysisResults } from "@/lib/types";

const initialState: AnalysisState = {
  status: "idle",
  currentPass: 0,
  currentPassName: "",
  message: "",
  reasoning: [],
  results: {},
};

function processEvent(
  event: Record<string, unknown>,
  setState: React.Dispatch<React.SetStateAction<AnalysisState>>
) {
  switch (event.event_type) {
    case "analysis_start":
      setState((prev) => ({
        ...prev,
        message: event.message as string,
      }));
      break;

    case "pass_start":
      setState((prev) => ({
        ...prev,
        currentPass: event.pass_number as number,
        currentPassName: event.pass_name as string,
        message: event.message as string,
        reasoning: [],
      }));
      break;

    case "pass_complete":
      setState((prev) => {
        const newResults: AnalysisResults = { ...prev.results };
        const key = event.pass_name as keyof AnalysisResults;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (newResults as any)[key] = event.data;

        return {
          ...prev,
          results: newResults,
          message: event.message as string,
          reasoning: (event.reasoning as string[]) || [],
        };
      });
      break;

    case "done":
      setState((prev) => ({
        ...prev,
        status: "complete",
        message: event.message as string,
      }));
      break;

    case "error":
      setState((prev) => ({
        ...prev,
        message: event.message as string,
      }));
      break;
  }
}

function parseSSELines(
  lines: string[],
  setState: React.Dispatch<React.SetStateAction<AnalysisState>>
) {
  for (const rawLine of lines) {
    const line = rawLine.replace(/\r$/, ""); // handle \r\n
    if (!line.startsWith("data:")) continue;

    const jsonStr = line.slice(5).trim();
    if (!jsonStr) continue;

    try {
      const event = JSON.parse(jsonStr);
      processEvent(event, setState);
    } catch {
      // Skip malformed events
    }
  }
}

export function useAnalysis() {
  const [state, setState] = useState<AnalysisState>(initialState);
  const abortRef = useRef<AbortController | null>(null);

  const analyze = useCallback(async (url: string) => {
    // Cancel any existing request
    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;

    setState({
      ...initialState,
      status: "analyzing",
      message: "Fetching repository content...",
    });

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Split on double newline (SSE event boundary) or single newlines
        const parts = buffer.split("\n");
        buffer = parts.pop() || "";

        parseSSELines(parts, setState);
      }

      // Process any remaining data in buffer
      if (buffer.trim()) {
        parseSSELines(buffer.split("\n"), setState);
      }
    } catch (err) {
      if ((err as Error).name === "AbortError") return;

      setState((prev) => ({
        ...prev,
        status: "error",
        error: (err as Error).message,
        message: `Error: ${(err as Error).message}`,
      }));
    }
  }, []);

  const reset = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
    }
    setState(initialState);
  }, []);

  return { state, analyze, reset };
}
