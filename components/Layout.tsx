"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Header from "./Header";
import CategoryFilter from "./CategoryFilter";
import { OpenAIConfig, Category } from "../types";
import { openaiService } from "../lib/openai";

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  showViewAll?: boolean;
  selectedCategory?: string;
  showSidebar?: boolean;
  categories?: Category[];
  totalCount?: number;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  title,
  showViewAll = false,
  selectedCategory = "all",
  showSidebar = true,
  categories = [],
  totalCount = 0,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // Load OpenAI configuration on mount
  useEffect(() => {
    const savedConfig = localStorage.getItem("openai-config");
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        openaiService.setConfig(config);
      } catch (e) {
        console.error("Failed to parse saved OpenAI config:", e);
      }
    }
  }, []);

  // Determine the current category based on URL
  const getCurrentCategory = () => {
    if (pathname === "/directory") {
      const category = searchParams.get("category");
      return category || "all";
    }
    // For prompt detail pages, we'll use the selectedCategory prop
    return selectedCategory;
  };

  const currentCategory = getCurrentCategory();

  const handleCategoryChange = (categoryId: string) => {
    if (categoryId === "all") {
      router.push("/directory");
    } else {
      router.push(`/directory?category=${categoryId}`);
    }
  };

  const handleConfigChange = (config: OpenAIConfig | null) => {
    // Configuration change handler - can be extended if needed
    console.log("Configuration changed:", config);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header
        title={title}
        showViewAll={showViewAll}
        onConfigChange={handleConfigChange}
      />

      {/* Fixed Sidebar - Only show if showSidebar is true */}
      {showSidebar && categories.length > 0 && (
        <CategoryFilter
          categories={categories}
          selectedCategory={currentCategory}
          onCategoryChange={handleCategoryChange}
          totalCount={totalCount}
        />
      )}

      <main className={`pt-16 ${showSidebar ? "lg:ml-64" : ""}`}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
