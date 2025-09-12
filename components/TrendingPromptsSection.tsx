"use client";

import React, { useState, useEffect } from "react";
import PromptGrid from "./PromptGrid";
import { trendingService } from "../lib/trending";
import { Prompt } from "../types";

interface TrendingPromptsSectionProps {
  initialPrompts: Prompt[];
}

export default function TrendingPromptsSection({
  initialPrompts,
}: TrendingPromptsSectionProps) {
  const [trendingPrompts, setTrendingPrompts] =
    useState<Prompt[]>(initialPrompts);
  const [error, setError] = useState<string | null>(null);
  const [cacheInfo, setCacheInfo] = useState<{
    hasCache: boolean;
    date?: string;
    age?: number;
  }>({ hasCache: false });

  useEffect(() => {
    // On client mount, get the actual trending prompts from localStorage
    // This will either use cached prompts or generate new ones based on 24-hour rotation
    const loadTrendingPrompts = async () => {
      try {
        const actualTrending = await trendingService.getTrendingPrompts(
          initialPrompts
        );
        setTrendingPrompts(actualTrending);
        setCacheInfo(trendingService.getCacheInfo());
      } catch (err) {
        console.error("Error loading trending prompts:", err);
        setError("Failed to load trending prompts");
      }
    };

    loadTrendingPrompts();
  }, [initialPrompts]);

  return (
    <section>
      <div className="mb-6">
        <h2 className="text-xl font-semibold">
          Trending Prompts
          {trendingPrompts.length > 0 && (
            <span className="text-primary/70 text-sm ml-2">
              ({trendingPrompts.length} prompts)
            </span>
          )}
        </h2>
        {cacheInfo.hasCache && (
          <p className="text-sm text-primary/60 mt-1">
            Refreshes daily • Last updated: {cacheInfo.date}
            {cacheInfo.age !== undefined && ` (${cacheInfo.age}h ago)`}
          </p>
        )}
      </div>

      {error ? (
        <div className="text-center py-8">
          <p className="text-red-500">{error}</p>
        </div>
      ) : (
        <PromptGrid prompts={trendingPrompts} />
      )}
    </section>
  );
}
