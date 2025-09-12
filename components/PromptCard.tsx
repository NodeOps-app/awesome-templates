import React from "react";
import Link from "next/link";
import { CaretDown } from "@phosphor-icons/react";
import { Prompt } from "../types";

interface PromptCardProps {
  prompt: Prompt;
  className?: string;
}

const PromptCard: React.FC<PromptCardProps> = ({ prompt, className = "" }) => {
  return (
    <Link href={`/directory/${prompt.id}`}>
      <div
        className={`border border-primary/20 p-4 transition-colors cursor-pointer ${className}`}
      >
        <div className="bg-primary/5 border border-primary/10 p-3 mb-3">
          <p className="text-primary/50 text-sm leading-relaxed line-clamp-2">
            {prompt.description}
          </p>
        </div>
        <h3 className="font-semibold mb-2">{prompt.title}</h3>
        <div className="flex items-center gap-2 text-xs text-primary/50">
          <span>{prompt.skills[0]}</span>
          <span>{prompt.skills[1]}</span>
          <span className="text-primary/50">{prompt.skills[2]}</span>
          <CaretDown className="w-4 h-4 ml-auto -rotate-90" />
        </div>
      </div>
    </Link>
  );
};

export default PromptCard;
