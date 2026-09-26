import React, { useState, useMemo } from 'react';
import { Search, Copy, Check, FileText, Sparkles, HelpCircle } from 'lucide-react';

interface DocumentViewerProps {
  title: string;
  category?: string;
  content: string;
  onSelectClauseForSimplifier: (text: string) => void;
  onAskQuestionAboutText: (text: string) => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  title,
  category,
  content,
  onSelectClauseForSimplifier,
  onAskQuestionAboutText,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [selectionPosition, setSelectionPosition] = useState<{ x: number; y: number } | null>(null);

  const wordCount = useMemo(() => {
    return content.trim().split(/\s+/).filter(Boolean).length;
  }, [content]);

  const readingTimeMinutes = useMemo(() => {
    return Math.max(1, Math.ceil(wordCount / 200));
  }, [wordCount]);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 15) {
      const text = selection.toString().trim();
      setSelectedText(text);
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setSelectionPosition({
        x: Math.min(window.innerWidth - 240, Math.max(20, rect.left + rect.width / 2 - 100)),
        y: Math.max(10, rect.top - 45 + window.scrollY),
      });
    } else {
      setSelectedText('');
      setSelectionPosition(null);
    }
  };

  // Render paragraphs with search highlighting
  const paragraphs = useMemo(() => {
    return content.split(/\n\s*\n/).filter((p) => p.trim().length > 0);
  }, [content]);

  const highlightMatches = (text: string, query: string) => {
    if (!query.trim()) return text;
    const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={i} className="bg-amber-200 text-stone-900 rounded px-0.5">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden flex flex-col h-full relative" onMouseUp={handleMouseUp}>
      {/* Floating Selection Tooltip */}
      {selectedText && selectionPosition && (
        <div
          className="fixed z-40 bg-stone-900 text-white rounded-lg shadow-xl px-2 py-1.5 flex items-center gap-1.5 text-xs animate-in fade-in zoom-in-95 duration-150"
          style={{ top: `${selectionPosition.y}px`, left: `${selectionPosition.x}px` }}
        >
          <button
            onClick={() => {
              onSelectClauseForSimplifier(selectedText);
              setSelectedText('');
              setSelectionPosition(null);
            }}
            className="px-2 py-1 hover:bg-stone-800 rounded flex items-center gap-1 text-amber-300 font-medium cursor-pointer transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simplify Clause</span>
          </button>
          <span className="text-stone-600">|</span>
          <button
            onClick={() => {
              onAskQuestionAboutText(`Explain the implications of this clause: "${selectedText.slice(0, 150)}..."`);
              setSelectedText('');
              setSelectionPosition(null);
            }}
            className="px-2 py-1 hover:bg-stone-800 rounded flex items-center gap-1 text-stone-200 hover:text-white cursor-pointer transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Ask Q&A</span>
          </button>
        </div>
      )}

      {/* Header bar */}
      <div className="p-4 border-b border-stone-200 bg-stone-50/70 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-stone-700" />
            <h2 className="text-sm font-semibold text-stone-900 tracking-tight">{title}</h2>
          </div>
          <div className="flex items-center gap-2 mt-1 text-xs text-stone-500">
            {category && <span>{category}</span>}
            {category && <span aria-hidden="true">·</span>}
            <span>{wordCount} words</span>
            <span aria-hidden="true">·</span>
            <span>~{readingTimeMinutes} min read</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search document text..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-xs pl-8 pr-3 py-1.5 bg-white border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-700 w-44 md:w-56"
            />
          </div>

          <button
            onClick={handleCopy}
            className="p-1.5 border border-stone-300 hover:bg-stone-100 rounded-md text-stone-600 hover:text-stone-900 text-xs flex items-center gap-1 cursor-pointer transition-colors"
            title="Copy full document text"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Tip Banner */}
      <div className="bg-stone-50 px-4 py-1.5 border-b border-stone-100 text-[11px] text-stone-500 flex items-center justify-between">
        <span>Tip: Highlight any sentence or paragraph with your cursor to instantly simplify or query it.</span>
        {searchQuery && (
          <span className="font-mono text-amber-800">
            Filtering by: "{searchQuery}"
          </span>
        )}
      </div>

      {/* Document Text Body */}
      <div className="p-6 md:p-8 overflow-y-auto space-y-5 font-legal-serif text-stone-800 leading-relaxed text-[15px] select-text bg-[#fcfbf9]">
        {paragraphs.map((para, idx) => {
          const isHeader =
            para.length < 90 &&
            (para.toUpperCase() === para ||
              /^(SECTION|\d+\.|\bARTICLE\b|[A-Z\s]{4,})/i.test(para.trim()));

          return (
            <div key={idx} className="group relative flex gap-3">
              <span className="w-6 text-[11px] text-stone-300 group-hover:text-stone-500 font-mono select-none shrink-0 pt-1 text-right">
                {idx + 1}
              </span>
              <div className="flex-1">
                {isHeader ? (
                  <h3 className="font-legal-display font-semibold text-stone-950 text-base tracking-wide border-b border-stone-200/80 pb-1 pt-2">
                    {highlightMatches(para, searchQuery)}
                  </h3>
                ) : (
                  <p className="leading-relaxed">
                    {highlightMatches(para, searchQuery)}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
