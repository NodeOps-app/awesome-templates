import React, { Suspense } from "react";
import LayoutWrapper from "../components/LayoutWrapper";
import { getServerPrompts, getServerTrendingPrompts } from "../lib/data";
import { HomePageSkeleton } from "../components/LoadingSkeletons";
import Link from "next/link";

// Client component for trending prompts with refresh functionality
import TrendingPromptsSection from "../components/TrendingPromptsSection";

const HomePage = async () => {
  // Server-side data fetching
  const allPrompts = await getServerPrompts();
  const trendingPrompts = await getServerTrendingPrompts(allPrompts);

  return (
    <LayoutWrapper
      title="Prompt of the day"
      showViewAll={true}
      showSidebar={false}
    >
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
        <Suspense fallback={<HomePageSkeleton />}>
          <TrendingPromptsSection initialPrompts={trendingPrompts} />
        </Suspense>
      </div>
    </LayoutWrapper>
  );
};

export default HomePage;
