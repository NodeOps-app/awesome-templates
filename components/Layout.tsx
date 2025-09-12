import React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Header from "./Header";
import CategoryFilter from "./CategoryFilter";
import { categories } from "../data/mockData";

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  showViewAll?: boolean;
  selectedCategory?: string;
  showSidebar?: boolean;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  title,
  showViewAll = false,
  selectedCategory = "all",
  showSidebar = true,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header title={title} showViewAll={showViewAll} />

      {/* Fixed Sidebar - Only show if showSidebar is true */}
      {showSidebar && (
        <CategoryFilter
          categories={categories}
          selectedCategory={currentCategory}
          onCategoryChange={handleCategoryChange}
        />
      )}

      <main className={`pt-16 ${showSidebar ? "lg:ml-64" : ""}`}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
