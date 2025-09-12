import React from "react";
import PromptCard from "./PromptCard";
import { Prompt } from "../types";

interface PromptGridProps {
  prompts: Prompt[];
  className?: string;
}

const PromptGrid: React.FC<PromptGridProps> = ({ prompts, className = "" }) => {
  if (prompts.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-gray-400 text-lg">No prompts found</p>
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}
    >
      {prompts.map((prompt) => (
        <PromptCard key={prompt.id} prompt={prompt} />
      ))}
    </div>
  );
};

export default PromptGrid;
