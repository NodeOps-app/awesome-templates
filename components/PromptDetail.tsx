import React, { useRef } from "react";
import { Copy, Play } from "@phosphor-icons/react";
import Chat, { ChatRef } from "./Chat";
import { Prompt } from "../types";
import { toast } from "sonner";

interface PromptDetailProps {
  prompt: Prompt;
  className?: string;
}

const PromptDetail: React.FC<PromptDetailProps> = ({
  prompt,
  className = "",
}) => {
  const chatRef = useRef<ChatRef>(null);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(prompt.content || prompt.description);
    toast.success("Prompt copied!!");
  };

  const handleTryPrompt = () => {
    if (chatRef.current) {
      chatRef.current.handleTryPrompt();
    }
  };

  return (
    <div
      className={`grid grid-cols-1 lg:grid-cols-2 gap-6 h-full overflow-hidden ${className}`}
    >
      {/* Left Column - Prompt Content */}
      <div className="lg:col-span-1">
        <div className="border border-primary/20 p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Prompt Content</h2>
            <div className="flex gap-2">
              <button
                onClick={handleCopyPrompt}
                className="flex items-center gap-1 px-3 py-1 bg-primary/10 hover:bg-primary/20 border border-primary/20 text-sm transition-colors"
              >
                <Copy className="w-4 h-4" />
                Copy
              </button>
              <button
                onClick={handleTryPrompt}
                className="flex items-center gap-1 px-3 py-1 bg-primary hover:bg-primary/80 text-background text-sm transition-colors"
              >
                <Play className="w-4 h-4" />
                Try
              </button>
            </div>
          </div>
          <div className="bg-primary/5 border border-primary/10 p-4 flex-1">
            <p className="text-primary/80 leading-relaxed">
              {prompt.content || prompt.description}
            </p>
          </div>
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {prompt.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-primary/10 text-primary/70 text-xs border border-primary/20"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Chat Window */}
      <div className="lg:col-span-1">
        <Chat
          ref={chatRef}
          promptTitle={prompt.title}
          promptContent={prompt.content || prompt.description}
        />
      </div>
    </div>
  );
};

export default PromptDetail;
