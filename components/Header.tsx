"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Gear, Eye } from "@phosphor-icons/react";
import OpenAIConfigModal from "./OpenAIConfigModal";
import { OpenAIConfig } from "../types";

interface HeaderProps {
  title: string;
  showViewAll?: boolean;
  viewAllLink?: string;
  onConfigChange?: (config: OpenAIConfig | null) => void;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showViewAll = false,
  viewAllLink = "/directory",
  onConfigChange,
}) => {
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  const handleConfigSaved = (config: OpenAIConfig) => {
    onConfigChange?.(config);
  };

  const handleConfigModalClose = () => {
    setIsConfigModalOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-primary/10">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link
              href="/"
              className="flex items-center gap-3 text-2xl font-bold"
            >
              {title}
            </Link>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsConfigModalOpen(true)}
                className="flex items-center gap-2 px-3 py-2 border border-primary/20 hover:border-primary/40 hover:bg-primary/5 rounded transition-colors"
                title="Configure OpenAI API"
              >
                <Gear className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">Configure</span>
              </button>

              {showViewAll && (
                <Link
                  href={viewAllLink}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-background font-medium transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  View Directory
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <OpenAIConfigModal
        isOpen={isConfigModalOpen}
        onClose={handleConfigModalClose}
        onConfigSaved={handleConfigSaved}
      />
    </>
  );
};

export default Header;
