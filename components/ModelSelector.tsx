import React, { useState, useEffect, useCallback } from "react";
import {
  CaretDown,
  Check,
  WarningCircle,
  ArrowClockwise,
} from "@phosphor-icons/react";
import { OpenAIModel } from "../types";
import { openaiService } from "../lib/openai";

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (modelId: string) => void;
  disabled?: boolean;
  refreshTrigger?: number; // Add this to trigger refresh when config changes
}

const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedModel,
  onModelChange,
  disabled = false,
  refreshTrigger = 0,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [models, setModels] = useState<OpenAIModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadModels = useCallback(async () => {
    console.log("🔄 Loading models...", {
      isConfigured: openaiService.isConfigured(),
      config: openaiService.getConfig(),
    });
    setIsLoading(true);
    setError(null);

    try {
      console.log("📡 Making API request to fetch models...");
      const fetchedModels = await openaiService.getModels();
      console.log("✅ Fetched models:", fetchedModels);

      // Filter for chat completion models and sort by name
      // Include more model types and exclude embedding models
      const chatModels = fetchedModels
        .filter((model) => {
          const isChatModel =
            model.id.includes("gpt") ||
            model.id.includes("claude") ||
            model.id.includes("llama") ||
            model.id.includes("qwen") ||
            model.id.includes("gemini") ||
            model.id.includes("mistral") ||
            model.id.includes("phi") ||
            model.id.includes("command") ||
            model.id.includes("instruct") ||
            model.id.includes("chat");

          const isNotEmbedding =
            !model.id.includes("embed") &&
            !model.id.includes("ada") &&
            !model.id.includes("babbage") &&
            !model.id.includes("curie") &&
            !model.id.includes("davinci");

          const shouldInclude = isChatModel && isNotEmbedding;

          console.log(`🔍 Model ${model.id}:`, {
            isChatModel,
            isNotEmbedding,
            shouldInclude,
          });

          return shouldInclude;
        })
        .sort((a, b) => a.id.localeCompare(b.id));

      console.log("✅ Filtered chat models:", chatModels);

      // If no chat models found, show all models as fallback
      const finalModels = chatModels.length > 0 ? chatModels : fetchedModels;

      if (chatModels.length === 0 && fetchedModels.length > 0) {
        console.log("⚠️ No chat models found, showing all models as fallback");
      }

      setModels(finalModels);

      // Auto-select first model if none selected
      if (!selectedModel && finalModels.length > 0) {
        onModelChange(finalModels[0].id);
      }
    } catch (err) {
      console.error("Error loading models:", err);
      setError(err instanceof Error ? err.message : "Failed to load models");
    } finally {
      setIsLoading(false);
    }
  }, [selectedModel, onModelChange]);

  useEffect(() => {
    console.log("🔍 useEffect: checking if configured", {
      isConfigured: openaiService.isConfigured(),
    });
    if (openaiService.isConfigured()) {
      console.log("✅ OpenAI is configured, loading models...");
      loadModels();
    }
  }, [loadModels]);

  // Load models when refreshTrigger changes (e.g., when config is updated)
  useEffect(() => {
    console.log("🔄 useEffect: refreshTrigger changed", {
      refreshTrigger,
      isConfigured: openaiService.isConfigured(),
    });
    if (openaiService.isConfigured() && refreshTrigger > 0) {
      console.log("✅ Refresh trigger activated, loading models...");
      loadModels();
    }
  }, [refreshTrigger, loadModels]);

  // Also try to load models when the dropdown is opened
  const handleDropdownToggle = () => {
    console.log("🔽 Dropdown toggle clicked", {
      isOpen,
      isConfigured: openaiService.isConfigured(),
      modelsLength: models.length,
      isLoading,
    });
    if (
      !isOpen &&
      openaiService.isConfigured() &&
      models.length === 0 &&
      !isLoading
    ) {
      console.log("🔄 Loading models on dropdown open...");
      loadModels();
    }
    setIsOpen(!isOpen);
  };

  const handleModelSelect = (modelId: string) => {
    onModelChange(modelId);
    setIsOpen(false);
  };

  const selectedModelData = models.find((model) => model.id === selectedModel);

  if (!openaiService.isConfigured()) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 border border-primary/20 rounded bg-primary/5 text-primary/60">
        <WarningCircle className="w-4 h-4" />
        <span className="text-sm">Configure OpenAI endpoint first</span>
      </div>
    );
  }

  const handleRefresh = () => {
    loadModels();
  };

  return (
    <div className="relative">
      <div className="flex gap-2">
        <button
          onClick={() => !disabled && handleDropdownToggle()}
          disabled={disabled || isLoading}
          className="flex-1 flex items-center justify-between gap-2 px-3 py-2 border border-primary/20 rounded hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 disabled:opacity-50 disabled:cursor-not-allowed bg-background"
        >
          <div className="flex items-center gap-2 min-w-0">
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                <span className="text-sm text-primary/60">
                  Loading models...
                </span>
              </>
            ) : error ? (
              <>
                <WarningCircle className="w-4 h-4 text-red-500" />
                <span className="text-sm text-red-500">
                  Error loading models
                </span>
              </>
            ) : selectedModelData ? (
              <>
                <span className="text-sm font-medium truncate">
                  {selectedModelData.id}
                </span>
                <span className="text-xs text-primary/60 truncate">
                  ({selectedModelData.owned_by})
                </span>
              </>
            ) : (
              <span className="text-sm text-primary/60">Select a model</span>
            )}
          </div>
          <CaretDown
            className={`w-4 h-4 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="px-3 py-2 border border-primary/20 rounded hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 disabled:opacity-50 disabled:cursor-not-allowed bg-background"
          title="Refresh models"
        >
          <ArrowClockwise
            className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
          />
        </button>
      </div>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-primary/20 rounded shadow-lg z-20 max-h-60 overflow-y-auto">
            {models.length === 0 ? (
              <div className="p-3 text-center text-sm text-primary/60">
                {isLoading ? "Loading models..." : "No models available"}
              </div>
            ) : (
              models.map((model) => (
                <button
                  key={model.id}
                  onClick={() => handleModelSelect(model.id)}
                  className="w-full flex items-center justify-between gap-2 px-3 py-2 hover:bg-primary/5 text-left transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium truncate">
                      {model.id}
                    </div>
                    <div className="text-xs text-primary/60 truncate">
                      {model.owned_by}
                    </div>
                  </div>
                  {selectedModel === model.id && (
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  )}
                </button>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ModelSelector;
