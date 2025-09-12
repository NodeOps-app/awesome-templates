import React, { Suspense } from "react";
import LayoutWrapper from "../../components/LayoutWrapper";
import { getServerPrompts, getServerCategories } from "../../lib/data";
import { DirectoryPageSkeleton } from "../../components/LoadingSkeletons";
import DirectoryContent from "../../components/DirectoryContent";

interface DirectoryPageProps {
  searchParams: Promise<{ category?: string }>;
}

const DirectoryPage = async ({ searchParams }: DirectoryPageProps) => {
  // Server-side data fetching
  const prompts = await getServerPrompts();

  // Get proper categories with counts
  const categoriesWithCounts = await getServerCategories(prompts);

  const resolvedParams = await searchParams;
  const selectedCategory = resolvedParams.category || "all";

  return (
    <LayoutWrapper
      title="Prompt of the day"
      showViewAll={false}
      selectedCategory={selectedCategory}
    >
      <Suspense fallback={<DirectoryPageSkeleton />}>
        <DirectoryContent
          prompts={prompts}
          categories={categoriesWithCounts}
          selectedCategory={selectedCategory}
        />
      </Suspense>
    </LayoutWrapper>
  );
};

export default DirectoryPage;
