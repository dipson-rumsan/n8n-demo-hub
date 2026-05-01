"use client";

import type { JSX } from "react";

interface Props {
  content: string;
}

export function MarkdownRenderer({ content }: Props) {
  const renderMarkdown = (text: string) => {
    const lines = text.split("\n");
    const elements: JSX.Element[] = [];
    let inList = false;
    let currentList: string[] = [];

    lines.forEach((line, index) => {
      const boldPattern = /\*\*(.*?)\*\*/g;
      let lineElement = line;
      const boldMatches = line.match(boldPattern);
      if (boldMatches) {
        boldMatches.forEach((match) => {
          const boldText = match.replace(/\*\*/g, "");
          lineElement = lineElement.replace(match, `<strong>${boldText}</strong>`);
        });
      }

      if (line.startsWith("# ")) {
        elements.push(
          <h1 key={index} className="text-3xl font-bold text-slate-900 mt-4 mb-2">
            {line.substring(2)}
          </h1>
        );
      } else if (line.startsWith("## ")) {
        elements.push(
          <h2 key={index} className="text-2xl font-bold text-slate-800 mt-3 mb-2">
            {line.substring(3)}
          </h2>
        );
      } else if (line.startsWith("### ")) {
        elements.push(
          <h3 key={index} className="text-xl font-semibold text-slate-700 mt-2 mb-1">
            {line.substring(4)}
          </h3>
        );
      } else if (line.startsWith("- ") || line.startsWith("* ")) {
        if (!inList) {
          inList = true;
          currentList = [];
        }
        currentList.push(line.substring(2));
      } else if (line.trim() === "") {
        if (inList) {
          elements.push(
            <ul key={`list-${index}`} className="list-disc list-inside ml-4 mb-4 text-slate-800 space-y-1">
              {currentList.map((item, i) => (
                <li key={i} className="text-slate-800">{item}</li>
              ))}
            </ul>
          );
          inList = false;
          currentList = [];
        }
      } else if (line.trim()) {
        if (inList) {
          elements.push(
            <ul key={`list-${index}`} className="list-disc list-inside ml-4 mb-4 text-slate-800 space-y-1">
              {currentList.map((item, i) => (
                <li key={i} className="text-slate-800">{item}</li>
              ))}
            </ul>
          );
          inList = false;
          currentList = [];
        }
        elements.push(
          <p
            key={index}
            className="text-slate-800 leading-relaxed mb-3"
            dangerouslySetInnerHTML={{ __html: lineElement }}
          />
        );
      }
    });

    if (inList && currentList.length > 0) {
      elements.push(
        <ul key="final-list" className="list-disc list-inside ml-4 mb-4 text-slate-800 space-y-1">
          {currentList.map((item, i) => (
            <li key={i} className="text-slate-800">{item}</li>
          ))}
        </ul>
      );
    }

    return elements;
  };

  return (
    <div className="prose prose-sm max-w-none bg-white rounded-lg p-3 border border-slate-200">
      {renderMarkdown(content)}
    </div>
  );
}
