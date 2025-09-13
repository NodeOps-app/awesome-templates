import React, { useState } from "react";
import { Copy, Check } from "@phosphor-icons/react";

// Code block component with copy functionality
function CodeBlock({
  content,
  language,
  key,
}: {
  content: string;
  language: string;
  key: string | number;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  return (
    <div key={key} className="relative group my-2">
      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
        <code className={`language-${language}`}>{content}</code>
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded transition-colors opacity-0 group-hover:opacity-100"
        title="Copy code"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-600" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}

// Simple markdown renderer without external dependencies
export function MarkdownRenderer({ content }: { content: string }) {
  // Split content into lines for processing
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBlockContent: string[] = [];
  let codeBlockLanguage = "";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Handle code blocks
    if (line.startsWith("```")) {
      if (inCodeBlock) {
        // End of code block
        elements.push(
          <CodeBlock
            key={i}
            content={codeBlockContent.join("\n")}
            language={codeBlockLanguage}
          />
        );
        inCodeBlock = false;
        codeBlockContent = [];
        codeBlockLanguage = "";
      } else {
        // Start of code block
        codeBlockLanguage = line.slice(3).trim();
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockContent.push(line);
      continue;
    }

    // Handle headers
    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={i} className="text-lg font-semibold mt-4 mb-2">
          {line.slice(4)}
        </h3>
      );
    } else if (line.startsWith("## ")) {
      elements.push(
        <h2 key={i} className="text-xl font-semibold mt-4 mb-2">
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith("# ")) {
      elements.push(
        <h1 key={i} className="text-2xl font-bold mt-4 mb-2">
          {line.slice(2)}
        </h1>
      );
    }
    // Handle list items
    else if (line.startsWith("- ") || line.startsWith("* ")) {
      elements.push(
        <li key={i} className="ml-4 mb-1">
          {line.slice(2)}
        </li>
      );
    }
    // Handle numbered lists
    else if (/^\d+\.\s/.test(line)) {
      elements.push(
        <li key={i} className="ml-4 mb-1">
          {line.replace(/^\d+\.\s/, "")}
        </li>
      );
    }
    // Handle bold text
    else if (line.includes("**")) {
      const parts = line.split("**");
      const processedLine = parts.map((part, index) => {
        if (index % 2 === 1) {
          return <strong key={index}>{part}</strong>;
        }
        return part;
      });
      elements.push(
        <p key={i} className="mb-2">
          {processedLine}
        </p>
      );
    }
    // Handle italic text
    else if (line.includes("*") && !line.includes("**")) {
      const parts = line.split("*");
      const processedLine = parts.map((part, index) => {
        if (index % 2 === 1) {
          return <em key={index}>{part}</em>;
        }
        return part;
      });
      elements.push(
        <p key={i} className="mb-2">
          {processedLine}
        </p>
      );
    }
    // Handle inline code
    else if (line.includes("`")) {
      const parts = line.split("`");
      const processedLine = parts.map((part, index) => {
        if (index % 2 === 1) {
          return (
            <code
              key={index}
              className="bg-gray-100 dark:bg-gray-800 px-1 rounded text-sm"
            >
              {part}
            </code>
          );
        }
        return part;
      });
      elements.push(
        <p key={i} className="mb-2">
          {processedLine}
        </p>
      );
    }
    // Handle regular paragraphs
    else if (line.trim()) {
      elements.push(
        <p key={i} className="mb-2">
          {line}
        </p>
      );
    }
    // Handle empty lines
    else {
      elements.push(<br key={i} />);
    }
  }

  // Handle any remaining code block
  if (inCodeBlock && codeBlockContent.length > 0) {
    elements.push(
      <CodeBlock
        key="final-code"
        content={codeBlockContent.join("\n")}
        language={codeBlockLanguage}
      />
    );
  }

  return <div className="prose prose-sm max-w-none">{elements}</div>;
}
