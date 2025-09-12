"use client";

import React, { useState, useMemo } from "react";
import SearchBar from "./SearchBar";
import PromptGrid from "./PromptGrid";
import { Prompt, Category } from "../types";

interface DirectoryContentProps {
  prompts: Prompt[];
  categories: Category[];
  selectedCategory: string;
}

export default function DirectoryContent({
  prompts,
  categories,
  selectedCategory: initialSelectedCategory,
}: DirectoryContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(
    initialSelectedCategory
  );

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

  return (
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
  );
}
