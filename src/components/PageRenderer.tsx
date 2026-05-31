/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { CheckCircle2, ChevronRight, Info, AlertTriangle, Lightbulb } from "lucide-react";

interface PageRendererProps {
  content: string;
  isRtl: boolean;
}

export default function PageRenderer({ content, isRtl }: PageRendererProps) {
  if (!content) return null;

  // Split on paragraph splits (blank lines or newlines)
  const lines = content.split("\n");

  const parsedBlocks = lines.map((line, idx) => {
    const trimmed = line.trim();

    // 1. Check for big headers "# header"
    if (trimmed.startsWith("# ")) {
      const headerText = trimmed.substring(2);
      return (
        <h2 
          key={idx} 
          className="text-2xl sm:text-3.5xl font-black text-white tracking-tight mt-10 mb-4 pb-2 border-b border-white/5 font-sans"
        >
          {headerText}
        </h2>
      );
    }

    // 2. Check for sub-headers "## subheader"
    if (trimmed.startsWith("## ")) {
      const subheaderText = trimmed.substring(3);
      return (
        <h3 
          key={idx} 
          className="text-xl sm:text-2xl font-bold text-amber-400 tracking-tight mt-8 mb-3 font-sans"
        >
          {subheaderText}
        </h3>
      );
    }

    // 3. Highlight/Success banner lines: Starts with "> "
    if (trimmed.startsWith("> ")) {
      const quoteText = trimmed.substring(2);
      return (
        <blockquote 
          key={idx} 
          className="my-6 p-5 rounded-2xl bg-amber-500/5 border-l-4 rtl:border-l-0 rtl:border-r-4 border-amber-550 text-gray-205 italic font-medium"
        >
          <div className="flex items-start gap-3">
            <Lightbulb size={20} className="text-amber-500 mt-0.5 flex-shrink-0" />
            <p className="leading-relaxed">{quoteText}</p>
          </div>
        </blockquote>
      );
    }

    // 4. Checking alert/special notice banners: Starts with "[INFO]"
    if (trimmed.startsWith("[INFO]") || trimmed.startsWith("[info]")) {
      const infoText = trimmed.replace(/^\[INFO\]\s*/i, "");
      return (
        <div key={idx} className="my-5 p-5 bg-sky-500/5 border border-sky-500/20 rounded-2xl flex items-start gap-4">
          <Info size={18} className="text-sky-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm font-semibold text-slate-300 leading-relaxed">{infoText}</p>
        </div>
      );
    }

    // 5. Checklist items starting with "- " or "* "
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      const bulletText = trimmed.substring(2);
      return (
        <div 
          key={idx} 
          className="flex items-start gap-3 text-gray-300 my-2.5 rtl:pr-3 ltr:pl-3"
        >
          <CheckCircle2 size={16} className="text-emerald-555 mt-1.5 flex-shrink-0" />
          <span className="text-sm sm:text-base leading-relaxed font-semibold">
            {renderLineWithInlineFormatting(bulletText)}
          </span>
        </div>
      );
    }

    // Empty Lines are treated as spacing buffers
    if (trimmed === "") {
      return <div key={idx} className="h-3" />;
    }

    // Regular paragraphs
    return (
      <p 
        key={idx} 
        className="text-sm sm:text-base text-gray-300 leading-relaxed font-semibold whitespace-pre-wrap"
      >
        {renderLineWithInlineFormatting(trimmed)}
      </p>
    );
  });

  // Small helper to render inline bold text markers "**text**" smoothly
  function renderLineWithInlineFormatting(text: string) {
    const boldRegex = /\*\*(.*?)\*\*/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = boldRegex.exec(text)) !== null) {
      // push prefix
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      // push bold element
      parts.push(
        <strong key={match.index} className="text-white font-extrabold font-sans">
          {match[1]}
        </strong>
      );
      lastIndex = boldRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  }

  return (
    <div className="space-y-4 font-normal text-slate-300 antialiased">
      {parsedBlocks}
    </div>
  );
}
