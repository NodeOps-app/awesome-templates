"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Layout from "../../components/Layout";
import SearchBar from "../../components/SearchBar";
import PromptGrid from "../../components/PromptGrid";
import { getPrompts, getCategories } from "../../data/mockData";
import { Prompt, Category } from "../../types";

const DirectoryPage = () => {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const category = searchParams.get("category");
    if (category) {
      setSelectedCategory(category);
    } else {
      setSelectedCategory("all");
    }
  }, [searchParams]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [promptsData, categoriesData] = await Promise.all([
          getPrompts(),
          getCategories(),
        ]);
        setPrompts(promptsData);
        setCategories(categoriesData);
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Failed to load prompts");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredPrompts = useMemo(() => {
    let filtered = prompts;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (prompt) =>
          prompt.category.toLowerCase().replace(/\s+/g, "-") ===
          selectedCategory
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (prompt) =>
          prompt.title.toLowerCase().includes(query) ||
          prompt.description.toLowerCase().includes(query) ||
          prompt.skills.some((skill) => skill.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [searchQuery, selectedCategory, prompts]);

  if (isLoading) {
    return (
      <Layout
        title="Prompt of the day"
        showViewAll={false}
        selectedCategory={selectedCategory}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-primary/60 mt-4">Loading prompts...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout
        title="Prompt of the day"
        showViewAll={false}
        selectedCategory={selectedCategory}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-red-500 text-lg">{error}</p>
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
      showViewAll={false}
      selectedCategory={selectedCategory}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile Category Filter */}
        <div className="lg:hidden mb-6">
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedCategory === category.id
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

        {/* Main Content */}
        <div className="flex-1">
          {/* Search Bar */}

          {/* Results */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {selectedCategory === "all"
                  ? "All Prompts"
                  : categories.find((c) => c.id === selectedCategory)?.name ||
                    selectedCategory}{" "}
                Prompts
                <span className="text-primary/70 text-sm ml-1">
                  ({filteredPrompts.length} result
                  {filteredPrompts.length !== 1 ? "s" : ""})
                </span>
              </h2>

              <SearchBar
                placeholder="Search prompts..."
                value={searchQuery}
                onChange={setSearchQuery}
                className="w-96"
              />
            </div>

            <PromptGrid prompts={filteredPrompts} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DirectoryPage;
