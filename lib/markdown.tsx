import React from "react";

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
          <pre
            key={i}
            className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto my-2"
          >
            <code className={`language-${codeBlockLanguage}`}>
              {codeBlockContent.join("\n")}
            </code>
          </pre>
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
      <pre
        key="final-code"
        className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto my-2"
      >
        <code className={`language-${codeBlockLanguage}`}>
          {codeBlockContent.join("\n")}
        </code>
      </pre>
    );
  }

  return <div className="prose prose-sm max-w-none">{elements}</div>;
}
