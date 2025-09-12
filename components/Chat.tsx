import React, { useState, useImperativeHandle, forwardRef } from "react";
import { PaperPlaneTilt } from "@phosphor-icons/react";

interface ChatProps {
  promptTitle: string;
  promptContent?: string;
  onTryPrompt?: () => void;
  className?: string;
}

export interface ChatRef {
  handleTryPrompt: () => void;
}

interface ChatMessage {
  role: "user" | "assistant";
  message: string;
}

const Chat = forwardRef<ChatRef, ChatProps>(
  ({ promptTitle, promptContent, onTryPrompt, className = "" }, ref) => {
    const [chatMessage, setChatMessage] = useState("");
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

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

    const handleSendMessage = () => {
      if (chatMessage.trim()) {
        setChatHistory((prev) => [
          ...prev,
          { role: "user", message: chatMessage },
        ]);

        // Simulate AI response
        setChatHistory((prev) => [
          ...prev,
          {
            role: "assistant",
            message: `I understand you're asking about: "${chatMessage}". As a ${promptTitle}, I'd be happy to help you with that.`,
          },
        ]);
        setChatMessage("");
      }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    };

    return (
      <div
        className={`border border-primary/20 p-6 h-full flex flex-col overflow-hidden ${className}`}
      >
        <h3 className="text-lg font-semibold mb-4">Try Prompt</h3>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-3 min-h-0">
          {chatHistory.map((chat, index) => (
            <div
              key={index}
              className={`p-3 border border-primary/20 max-w-2/3 ${
                chat.role === "user"
                  ? "bg-primary/10 ml-auto"
                  : "bg-primary/5  mr-auto"
              }`}
            >
              <p className="text-sm break-all">{chat.message}</p>
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <div className="flex gap-2">
          <textarea
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 bg-primary/5 border border-primary/20 px-3 py-2 text-primary placeholder-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 resize-none"
            rows={3}
          />
          <button
            onClick={handleSendMessage}
            className="flex items-center gap-1 px-4 py-2 bg-primary hover:bg-primary/80 text-background text-sm transition-colors"
          >
            <PaperPlaneTilt className="w-4 h-4" />
            Send
          </button>
        </div>
      </div>
    );
  }
);

Chat.displayName = "Chat";

export default Chat;
