import React from "react";
import { MagnifyingGlass } from "@phosphor-icons/react";

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search prompts...",
  value = "",
  onChange,
  className = "",
}) => {
  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full border border-primary/10 px-4 py-3 focus:outline-none"
      />
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
        <MagnifyingGlass className="w-5 h-5 text-gray-400" />
      </div>
    </div>
  );
};

export default SearchBar;
