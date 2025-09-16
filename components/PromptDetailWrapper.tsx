"use client";

import React, { useRef } from "react";
import dynamic from "next/dynamic";
import { Prompt } from "../types";

// Dynamically import Chat component to reduce initial bundle size
const Chat = dynamic(() => import("./Chat"), {
  loading: () => (
    <div className="border border-primary/20 p-6 h-full flex flex-col overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Try Prompt</h3>
          <p className="text-sm text-primary/60 mt-1">
            Loading chat interface...
          </p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-primary/60 mt-2">Loading...</p>
        </div>
      </div>
    </div>
  ),
  ssr: false, // Disable SSR for Chat component since it uses browser APIs
});

interface PromptDetailWrapperProps {
  prompt: Prompt;
}

export default function PromptDetailWrapper({
  prompt,
}: PromptDetailWrapperProps) {
  const chatRef = useRef<{ handleTryPrompt: () => void } | null>(null);

  return (
    <div className="h-full flex flex-col lg:grid lg:grid-cols-2 gap-6">
      {/* Left Column - Prompt Details */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold mb-2">{prompt.title}</h1>
          <p className="text-primary/60 text-sm mb-4">{prompt.category}</p>
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => {
                if (chatRef.current) {
                  chatRef.current.handleTryPrompt();
                }
              }}
              className="flex items-center gap-1 px-3 py-2 bg-primary text-background text-sm transition-colors hover:bg-primary/80"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Try
            </button>
          </div>
        </div>
        <div className="bg-primary/5 border border-primary/10 p-4 flex-1">
          <pre className="text-primary/80 leading-relaxed whitespace-pre-wrap font-sans">
            {prompt.prompt || prompt.content || prompt.description}
          </pre>
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

      {/* Right Column - Chat Window */}
      <div className="lg:col-span-1" style={{ height: "calc(100vh - 100px)" }}>
        <Chat
          ref={chatRef}
          promptTitle={prompt.title}
          promptContent={prompt.prompt || prompt.content || prompt.description}
          promptId={prompt.id}
        />
      </div>
    </div>
  );
}
