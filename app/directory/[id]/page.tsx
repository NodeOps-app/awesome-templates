"use client";

import React from "react";
import { notFound } from "next/navigation";
import Layout from "../../../components/Layout";
import PromptDetail from "../../../components/PromptDetail";
import { mockPrompts, categories } from "../../../data/mockData";

interface PromptPageProps {
  params: Promise<{
    id: string;
  }>;
}

const PromptPage = ({ params }: PromptPageProps) => {
  const resolvedParams = React.use(params);
  const promptId = parseInt(resolvedParams.id);
  const prompt = mockPrompts.find((p) => p.id === promptId);

  if (!prompt) {
    notFound();
  }

  return (
    <Layout
      title="Prompt of the day"
      showViewAll={true}
      selectedCategory={prompt.category}
    >
      <div className="h-[calc(100vh-4rem)] px-4 sm:px-6 lg:px-8 py-4 overflow-hidden">
        {/* Mobile Category Filter */}
        <div className="lg:hidden mb-4">
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                    category.id === prompt.category
                      ? "bg-primary text-white"
                      : "text-primary/70 hover:text-primary hover:bg-primary/10"
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="h-full">
          <PromptDetail prompt={prompt} />
        </div>
      </div>
    </Layout>
  );
};

export default PromptPage;
