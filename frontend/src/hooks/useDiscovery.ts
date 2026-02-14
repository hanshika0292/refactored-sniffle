"use client";

import { useState, useCallback, useRef } from "react";
import { DiscoveryState, DiscoveryFilters } from "@/lib/types";

const initialState: DiscoveryState = {
  status: "idle",
  message: "",
  reasoning: [],
  result: null,
};

function processEvent(
  event: Record<string, unknown>,
  setState: React.Dispatch<React.SetStateAction<DiscoveryState>>
) {
  switch (event.event_type) {
    case "discovery_start":
      setState((prev) => ({
        ...prev,
        message: event.message as string,
      }));
      break;

    case "discovery_thinking":
      setState((prev) => ({
        ...prev,
        message: event.message as string,
      }));
      break;

    case "discovery_complete":
      setState((prev) => ({
        ...prev,
        result: event.data as DiscoveryState["result"],
        reasoning: (event.reasoning as string[]) || [],
        message: event.message as string,
      }));
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
        status: "error",
        error: event.message as string,
        message: event.message as string,
      }));
      break;
  }
}

function parseSSELines(
  lines: string[],
  setState: React.Dispatch<React.SetStateAction<DiscoveryState>>
) {
  for (const rawLine of lines) {
    const line = rawLine.replace(/\r$/, "");
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

export function useDiscovery() {
  const [state, setState] = useState<DiscoveryState>(initialState);
  const abortRef = useRef<AbortController | null>(null);

  const discover = useCallback(
    async (query: string, filters: DiscoveryFilters, maxResults = 5) => {
      if (abortRef.current) {
        abortRef.current.abort();
      }
      const controller = new AbortController();
      abortRef.current = controller;

      setState({
        ...initialState,
        status: "searching",
        message: "Searching for matching projects...",
      });

      try {
        const response = await fetch("/api/discover", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query,
            filters,
            max_results: maxResults,
          }),
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
          const parts = buffer.split("\n");
          buffer = parts.pop() || "";

          parseSSELines(parts, setState);
        }

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
    },
    []
  );

  const reset = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
    }
    setState(initialState);
  }, []);

  return { state, discover, reset };
}
