import React from "react";
import { Hash } from "@phosphor-icons/react";
import { Category } from "../types";

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  className?: string;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  className = "",
}) => {
  return (
    <div
      className={`fixed left-0 top-16 bottom-0 w-64  border-r border-primary/10 p-6 overflow-y-auto hidden lg:block ${className}`}
    >
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-lg font-semibold">Categories</h3>
      </div>
      <div className="space-y-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`w-full text-left px-3 py-2 transition-colors cursor-pointer ${
              selectedCategory === category.id
                ? "bg-primary/10 text-white"
                : "text-gray-400 hover:text-white hover:bg-primary/5"
            }`}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4" />
                <span>{category.name}</span>
              </div>
              <span className="text-xs text-gray-500">({category.count})</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
