import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useEffect,
  useRef,
} from "react";
import { PaperPlaneTilt, Spinner, WarningCircle } from "@phosphor-icons/react";
import { ChatMessage } from "../types";
import { openaiService } from "../lib/openai";
import ModelSelector from "./ModelSelector";
import { MarkdownRenderer } from "../lib/markdown";

interface ChatProps {
  promptTitle: string;
  promptContent?: string;
  onTryPrompt?: () => void;
  className?: string;
  promptId: number;
}

export interface ChatRef {
  handleTryPrompt: () => void;
}

const Chat = forwardRef<ChatRef, ChatProps>(
  (
    { promptTitle, promptContent, onTryPrompt, className = "", promptId },
    ref
  ) => {
    const [chatMessage, setChatMessage] = useState("");
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [selectedModel, setSelectedModel] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [streamingResponse, setStreamingResponse] = useState("");
    const [isStreaming, setIsStreaming] = useState(false);
    const chatHistoryRef = useRef<HTMLDivElement>(null);

    // Load chat history from localStorage on mount
    useEffect(() => {
      const savedHistory = localStorage.getItem(`chat-${promptId}`);
      if (savedHistory) {
        try {
          const parsed = JSON.parse(savedHistory);
          setChatHistory(parsed);
        } catch (e) {
          console.error("Failed to parse saved chat history:", e);
        }
      }
    }, [promptId]);

    // Save chat history to localStorage whenever it changes
    useEffect(() => {
      if (chatHistory.length > 0) {
        localStorage.setItem(`chat-${promptId}`, JSON.stringify(chatHistory));
      }
    }, [chatHistory, promptId]);

    // Auto-scroll to bottom when new messages are added or streaming updates
    useEffect(() => {
      if (chatHistoryRef.current) {
        chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
      }
    }, [chatHistory, streamingResponse, isStreaming]);

    // Trigger model refresh when OpenAI is configured
    useEffect(() => {
      if (openaiService.isConfigured()) {
        setRefreshTrigger((prev) => prev + 1);
      }
    }, []);

    const handleTryPrompt = () => {
      if (promptContent) {
        setChatMessage(promptContent);
      }
      if (onTryPrompt) {
        onTryPrompt();
      }
    };

    useImperativeHandle(ref, () => ({
      handleTryPrompt,
    }));

    const handleSendMessage = async () => {
      if (!chatMessage.trim() || isLoading || isStreaming) return;

      if (!openaiService.isConfigured()) {
        setError("Please configure OpenAI API first");
        return;
      }

      if (!selectedModel) {
        setError("Please select a model first");
        return;
      }

      const userMessage: ChatMessage = {
        role: "user",
        content: chatMessage,
        timestamp: Date.now(),
      };

      setChatHistory((prev) => [...prev, userMessage]);
      setChatMessage("");
      setIsLoading(true);
      setIsStreaming(true);
      setStreamingResponse("");
      setError(null);

      try {
        // Determine system prompt based on promptType
        let systemPrompt = "";
        if (promptContent) {
          // Check if this is a system prompt or user prompt
          const isSystemPrompt =
            promptContent.includes("You are") ||
            promptContent.includes("Act as");
          if (isSystemPrompt) {
            systemPrompt = promptContent;
          } else {
            systemPrompt = `You are a ${promptTitle}. ${promptContent}`;
          }
        } else {
          systemPrompt = `You are a ${promptTitle}.`;
        }

        // Try streaming first, fallback to regular if not supported
        try {
          const response = await openaiService.sendMessageStream(
            [...chatHistory, userMessage],
            selectedModel,
            systemPrompt,
            (chunk) => {
              setStreamingResponse((prev) => prev + chunk);
            }
          );

          const assistantMessage: ChatMessage = {
            role: "assistant",
            content: response,
            timestamp: Date.now(),
          };

          setChatHistory((prev) => [...prev, assistantMessage]);
          setStreamingResponse("");
        } catch {
          console.log(
            "Streaming not supported, falling back to regular request"
          );
          // Fallback to regular request
          const response = await openaiService.sendMessage(
            [...chatHistory, userMessage],
            selectedModel,
            systemPrompt
          );

          const assistantMessage: ChatMessage = {
            role: "assistant",
            content: response,
            timestamp: Date.now(),
          };

          setChatHistory((prev) => [...prev, assistantMessage]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to send message");
      } finally {
        setIsLoading(false);
        setIsStreaming(false);
        setStreamingResponse("");
      }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    };

    const clearChat = () => {
      setChatHistory([]);
      localStorage.removeItem(`chat-${promptId}`);
    };

    return (
      <div
        className={`border border-primary/20 p-6 h-full flex flex-col overflow-hidden ${className}`}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">Try Prompt</h3>
            <p className="text-sm text-primary/60 mt-1">
              Using:{" "}
              <span className="font-medium text-primary">{promptTitle}</span>
            </p>
          </div>
          {chatHistory.length > 0 && (
            <button
              onClick={clearChat}
              className="text-sm text-primary/60 hover:text-primary transition-colors"
            >
              Clear Chat
            </button>
          )}
        </div>

        {/* Model Selection */}
        <div className="mb-4">
          <ModelSelector
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
            disabled={isLoading}
            refreshTrigger={refreshTrigger}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 p-3 mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-red-700 dark:text-red-300">
            <WarningCircle className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Chat History */}
        <div
          ref={chatHistoryRef}
          className="flex-1 overflow-y-auto mb-4 space-y-3 min-h-[70vh] max-h-80 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent"
        >
          {chatHistory.length === 0 ? (
            <div className="text-center text-primary/60 py-8">
              <p className="text-sm">
                Start a conversation with the AI assistant
              </p>
              {promptContent && (
                <p className="text-xs mt-1">
                  Click &quot;Try Prompt&quot; to use the suggested prompt
                </p>
              )}
            </div>
          ) : (
            chatHistory.map((chat, index) => (
              <div
                key={index}
                className={`p-3 border border-primary/20 max-w-2/3 rounded-lg ${
                  chat.role === "user"
                    ? "bg-primary/10 ml-auto"
                    : "bg-primary/5 mr-auto"
                }`}
              >
                {chat.role === "assistant" ? (
                  <div className="text-sm leading-relaxed">
                    <MarkdownRenderer content={chat.content} />
                  </div>
                ) : (
                  <p className="text-sm break-words whitespace-pre-wrap leading-relaxed">
                    {chat.content}
                  </p>
                )}
                <p className="text-xs text-primary/50 mt-2">
                  {new Date(chat.timestamp).toLocaleTimeString()}
                </p>
              </div>
            ))
          )}

          {/* Streaming Response */}
          {isStreaming && streamingResponse && (
            <div className="p-3 border border-primary/20 max-w-2/3 rounded-lg bg-primary/5 mr-auto">
              <div className="text-sm leading-relaxed">
                <MarkdownRenderer content={streamingResponse} />
                <span className="animate-pulse">|</span>
              </div>
              <p className="text-xs text-primary/50 mt-2">
                {new Date().toLocaleTimeString()} (streaming...)
              </p>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <div className="flex gap-2">
          <textarea
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              !openaiService.isConfigured()
                ? "Configure OpenAI API to start chatting..."
                : !selectedModel
                ? "Select a model to start chatting..."
                : "Type your message..."
            }
            disabled={
              !openaiService.isConfigured() || !selectedModel || isLoading
            }
            className="flex-1 bg-primary/5 border border-primary/20 px-3 py-2 text-primary placeholder-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
            rows={3}
          />
          <button
            onClick={handleSendMessage}
            disabled={
              !chatMessage.trim() ||
              isLoading ||
              isStreaming ||
              !openaiService.isConfigured() ||
              !selectedModel
            }
            className="flex items-center gap-1 px-4 py-2 bg-primary hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed text-background text-sm transition-colors"
          >
            {isLoading || isStreaming ? (
              <Spinner className="w-4 h-4 animate-spin" />
            ) : (
              <PaperPlaneTilt className="w-4 h-4" />
            )}
            {isLoading ? "Sending..." : isStreaming ? "Streaming..." : "Send"}
          </button>
        </div>
      </div>
    );
  }
);

Chat.displayName = "Chat";

export default Chat;
