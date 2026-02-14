"use client";

import { useState } from "react";
import { Search, Loader2 } from "lucide-react";

interface InputBarProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

export default function InputBar({ onSubmit, isLoading }: InputBarProps) {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim() && !isLoading) {
      onSubmit(url.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste a GitHub link (e.g., https://github.com/owner/repo)"
            className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={!url.trim() || isLoading}
          className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:text-gray-400 dark:disabled:text-gray-500 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
          {isLoading ? "Exploring..." : "Explore"}
        </button>
      </div>
    </form>
  );
}
