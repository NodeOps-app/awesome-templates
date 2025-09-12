"use client";

import React, { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import Layout from "../../../components/Layout";
import PromptDetail from "../../../components/PromptDetail";
import { getPromptById, getCategories } from "../../../data/mockData";
import { Prompt, Category } from "../../../types";

interface PromptPageProps {
  params: Promise<{
    id: string;
  }>;
}

const PromptPage = ({ params }: PromptPageProps) => {
  const resolvedParams = React.use(params);
  const promptId = parseInt(resolvedParams.id);
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [promptData, categoriesData] = await Promise.all([
          getPromptById(promptId),
          getCategories(),
        ]);

        if (!promptData) {
          notFound();
        }

        setPrompt(promptData);
        setCategories(categoriesData);
      } catch (err) {
        console.error("Error loading prompt:", err);
        setError("Failed to load prompt");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [promptId]);

  if (isLoading) {
    return (
      <Layout title="Prompt of the day" showViewAll={true}>
        <div className="h-[calc(100vh-4rem)] px-4 sm:px-6 lg:px-8 py-4 overflow-hidden">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-primary/60 mt-4">Loading prompt...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !prompt) {
    return (
      <Layout title="Prompt of the day" showViewAll={true}>
        <div className="h-[calc(100vh-4rem)] px-4 sm:px-6 lg:px-8 py-4 overflow-hidden">
          <div className="text-center py-12">
            <p className="text-red-500 text-lg">
              {error || "Prompt not found"}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/80"
            >
              Retry
            </button>
          </div>
        </div>
      </Layout>
    );
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
