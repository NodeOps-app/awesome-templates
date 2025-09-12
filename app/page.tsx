"use client";

import React from "react";
import Layout from "../components/Layout";
import PromptGrid from "../components/PromptGrid";
import { mockPrompts } from "../data/mockData";
import Link from "next/link";

const HomePage = () => {
  const trendingPrompts = mockPrompts.slice(0, 8);

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
            <h2 className="text-xl font-semibold">Trending Prompts</h2>
          </div>

          <PromptGrid prompts={trendingPrompts} />
        </section>
      </div>
    </Layout>
  );
};

export default HomePage;
