"use client";

import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import PromptGrid from "../components/PromptGrid";
import { getPrompts } from "../data/mockData";
import { trendingService } from "../lib/trending";
import { Prompt } from "../types";
import Link from "next/link";

const HomePage = () => {
  const [trendingPrompts, setTrendingPrompts] = useState<Prompt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cacheInfo, setCacheInfo] = useState<{
    hasCache: boolean;
    date?: string;
    age?: number;
  }>({ hasCache: false });

  useEffect(() => {
    const loadTrendingPrompts = async () => {
      try {
        setIsLoading(true);
        const allPrompts = await getPrompts();
        const trending = await trendingService.getTrendingPrompts(allPrompts);
        setTrendingPrompts(trending);

        // Update cache info
        setCacheInfo(trendingService.getCacheInfo());
      } catch (err) {
        console.error("Error loading trending prompts:", err);
        setError("Failed to load trending prompts");
      } finally {
        setIsLoading(false);
      }
    };

    loadTrendingPrompts();
  }, []);

  const handleRefreshTrending = async () => {
    try {
      setIsLoading(true);
      const allPrompts = await getPrompts();
      const trending = await trendingService.refreshTrendingPrompts(allPrompts);
      setTrendingPrompts(trending);
      setCacheInfo(trendingService.getCacheInfo());
    } catch (err) {
      console.error("Error refreshing trending prompts:", err);
      setError("Failed to refresh trending prompts");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout title="Prompt of the day" showViewAll={true} showSidebar={false}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Prompt Engine Section */}
        <section className="mb-12 flex flex-col items-center mt-8">
          <h1 className="text-4xl font-semibold">Prompt Engine</h1>
          <p className="text-primary/40 text-sm mt-2">
            Prompt Engine is a directory of prompts for various AI tools.
          </p>
          <Link
            href="/directory"
            className="px-4 py-2 bg-primary text-background font-medium transition-colors mt-5"
          >
            View Directory
          </Link>
        </section>

        {/* Trending Prompts Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
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
            <button
              onClick={handleRefreshTrending}
              disabled={isLoading}
              className="flex items-center gap-2 px-3 py-2 text-sm text-primary/70 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Refresh trending prompts"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh
            </button>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-primary/60 mt-2">Loading prompts...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500">{error}</p>
            </div>
          ) : (
            <PromptGrid prompts={trendingPrompts} />
          )}
        </section>
      </div>
    </Layout>
  );
};

export default HomePage;
