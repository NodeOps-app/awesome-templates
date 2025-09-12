import React, { Suspense } from "react";
import { notFound } from "next/navigation";
import LayoutWrapper from "../../../components/LayoutWrapper";
import {
  getServerPrompts,
  getServerPromptById,
  getServerCategories,
} from "../../../lib/data";
import { PromptDetailSkeleton } from "../../../components/LoadingSkeletons";
import PromptDetailWrapper from "../../../components/PromptDetailWrapper";

interface PromptPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Generate static params for all prompts at build time
export async function generateStaticParams() {
  try {
    const prompts = await getServerPrompts();
    return prompts.map((prompt) => ({
      id: prompt.id.toString(),
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

const PromptPage = async ({ params }: PromptPageProps) => {
  const resolvedParams = await params;
  const promptId = parseInt(resolvedParams.id);

  // Server-side data fetching
  const prompt = await getServerPromptById(promptId);

  if (!prompt) {
    notFound();
  }

  // Get proper categories with counts
  const allPrompts = await getServerPrompts();
  const categoriesWithCounts = await getServerCategories(allPrompts);

  return (
    <LayoutWrapper
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
              {categoriesWithCounts.map((category) => (
                <button
                  key={category.id}
                  className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                    category.id ===
                    prompt.category.toLowerCase().replace(/\s+/g, "-")
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
          <Suspense fallback={<PromptDetailSkeleton />}>
            <PromptDetailWrapper prompt={prompt} />
          </Suspense>
        </div>
      </div>
    </LayoutWrapper>
  );
};

export default PromptPage;
