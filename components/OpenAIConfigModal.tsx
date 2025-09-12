import React, { useState, useEffect } from "react";
import { X, Check, WarningCircle } from "@phosphor-icons/react";
import { OpenAIConfig, OpenAIModel } from "../types";
import { openaiService } from "../lib/openai";

interface OpenAIConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigSaved: (config: OpenAIConfig) => void;
}

const OpenAIConfigModal: React.FC<OpenAIConfigModalProps> = ({
  isOpen,
  onClose,
  onConfigSaved,
}) => {
  const [config, setConfig] = useState<OpenAIConfig>({
    apiKey: "",
    baseURL: "https://api.openai.com/v1",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [acknowledgeWarning, setAcknowledgeWarning] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Load existing config from localStorage
      const savedConfig = localStorage.getItem("openai-config");
      if (savedConfig) {
        try {
          const parsed = JSON.parse(savedConfig);
          setConfig(parsed);
        } catch (e) {
          console.error("Failed to parse saved config:", e);
        }
      }
    }
  }, [isOpen]);

  const handleSave = async () => {
    if (!config.apiKey.trim() || !config.baseURL.trim()) {
      setError("Please fill in all required fields");
      return;
    }

    if (!acknowledgeWarning) {
      setError("Please acknowledge the security warning before proceeding");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Test the configuration by fetching models
      openaiService.setConfig(config);
      await openaiService.getModels();

      // Save to localStorage
      localStorage.setItem("openai-config", JSON.stringify(config));

      setSuccess(true);
      setTimeout(() => {
        onConfigSaved(config);
        onClose();
        setSuccess(false);
      }, 1000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to connect to OpenAI API"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleSave();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background border border-primary/20 rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-primary/10">
          <h2 className="text-xl font-semibold">Configure OpenAI API</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-primary/10 rounded transition-colors"
            disabled={isLoading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Security Warning */}
          <div className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded text-yellow-800 dark:text-yellow-200">
            <WarningCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium mb-1">Security Notice</p>
              <p className="text-xs">
                Your API key will be stored in browser localStorage. Only use
                this in trusted environments. Never share your API key or use it
                in public/shared computers.
              </p>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-red-700 dark:text-red-300">
              <WarningCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded text-green-700 dark:text-green-300">
              <Check className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">Configuration saved successfully!</span>
            </div>
          )}

          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium mb-2">
              API Key *
            </label>
            <input
              id="apiKey"
              type="password"
              value={config.apiKey}
              onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
              onKeyPress={handleKeyPress}
              placeholder="sk-..."
              className="w-full px-3 py-2 border border-primary/20 rounded focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 bg-background"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="baseURL" className="block text-sm font-medium mb-2">
              Base URL *
            </label>
            <input
              id="baseURL"
              type="url"
              value={config.baseURL}
              onChange={(e) =>
                setConfig({ ...config, baseURL: e.target.value })
              }
              onKeyPress={handleKeyPress}
              placeholder="https://api.openai.com/v1"
              className="w-full px-3 py-2 border border-primary/20 rounded focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 bg-background"
              disabled={isLoading}
            />
            <p className="text-xs text-primary/60 mt-1">
              Use the default URL for OpenAI, or enter a custom endpoint for
              compatible APIs
            </p>
          </div>

          {/* Security Acknowledgment */}
          <div className="flex items-start gap-2">
            <input
              id="acknowledgeWarning"
              type="checkbox"
              checked={acknowledgeWarning}
              onChange={(e) => setAcknowledgeWarning(e.target.checked)}
              className="mt-1 w-4 h-4 text-primary border-primary/20 rounded focus:ring-primary/20 focus:ring-2"
            />
            <label
              htmlFor="acknowledgeWarning"
              className="text-sm text-primary/80"
            >
              I understand the security risks of storing my API key in browser
              localStorage and will only use this in trusted environments.
            </label>
          </div>
        </div>

        <div className="flex gap-3 p-6 border-t border-primary/10">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-primary/20 text-primary hover:bg-primary/5 rounded transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={
              isLoading ||
              !config.apiKey.trim() ||
              !config.baseURL.trim() ||
              !acknowledgeWarning
            }
            className="flex-1 px-4 py-2 bg-primary text-background hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Save & Test
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OpenAIConfigModal;
