import React, { useState } from 'react';
import { ClauseBreakdown } from '../types/legal';
import { Copy, Check, Sparkles, BookOpen } from 'lucide-react';

interface ClauseBreakdownPanelProps {
  clauses: ClauseBreakdown[];
  onOpenClauseSimplifier: (quote: string) => void;
}

export const ClauseBreakdownPanel: React.FC<ClauseBreakdownPanelProps> = ({
  clauses = [],
  onOpenClauseSimplifier,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const safeClauses = clauses || [];
  const categories = Array.from(new Set(safeClauses.map((c) => c?.category).filter(Boolean)));

  const filteredClauses = safeClauses.filter((c) => {
    if (selectedCategory === 'all') return true;
    return c?.category === selectedCategory;
  });

  const handleCopyCounter = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getWhoBenefitsBadge = (who?: string | null) => {
    const text = who || 'Neutral / Unspecified';
    if (text.includes('One-Sided') || text.includes('Company') || text.includes('Host') || text.includes('Vendor')) {
      return <span className="text-[11px] px-2 py-0.5 rounded font-semibold bg-rose-100 text-rose-800">{text}</span>;
    }
    if (text.includes('Mutual') || text.includes('Both') || text.includes('Balanced')) {
      return <span className="text-[11px] px-2 py-0.5 rounded font-semibold bg-emerald-100 text-emerald-800">{text}</span>;
    }
    return <span className="text-[11px] px-2 py-0.5 rounded font-medium bg-amber-100 text-amber-800">{text}</span>;
  };

  return (
    <div className="space-y-6">
      {/* Category selector */}
      <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-stone-700" />
            <h2 className="text-base font-semibold text-stone-900">Clause-by-Clause Translation & Redlines</h2>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Every section broken down into accessible plain English, detailing leverage, traps, and counter-proposals.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-1 p-1 bg-stone-100 rounded-lg text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-2.5 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            All Clauses ({clauses.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Clauses List */}
      <div className="space-y-4">
        {filteredClauses.map((clause) => (
          <div key={clause.id} className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
            {/* Header */}
            <div className="p-4 bg-stone-50 border-b border-stone-100 flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block mb-0.5">
                  {clause.category}
                </span>
                <h3 className="font-semibold text-stone-900 text-sm">{clause.title}</h3>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-stone-500">Advantage:</span>
                {getWhoBenefitsBadge(clause.whoBenefits)}
              </div>
            </div>

            {/* Content Body */}
            <div className="p-5 space-y-4 text-xs">
              {/* Plain English Translation */}
              <div className="bg-amber-50/40 p-3.5 rounded-lg border border-amber-200/60">
                <span className="text-[11px] font-semibold text-amber-900 uppercase tracking-wider block mb-1">
                  In Plain English (The Core Meaning):
                </span>
                <p className="text-sm text-stone-800 leading-relaxed font-normal">
                  {clause.plainEnglish}
                </p>
              </div>

              {/* Original Contract Excerpt */}
              <div className="bg-stone-50 p-3.5 rounded-lg border border-stone-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                    Verbatim Document Excerpt:
                  </span>
                  <button
                    onClick={() => onOpenClauseSimplifier(clause.originalExcerpt)}
                    className="text-amber-800 hover:text-amber-950 font-medium flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    <span>Deep Dissect</span>
                  </button>
                </div>
                <p className="font-legal-serif text-stone-800 italic leading-relaxed text-[13px]">
                  "{clause.originalExcerpt}"
                </p>
              </div>

              {/* Hidden Traps */}
              {clause.potentialTraps && (
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-stone-800">
                  <span className="font-semibold text-stone-900 block mb-0.5">
                    Potential Pitfalls & Loopholes:
                  </span>
                  <p className="leading-relaxed text-stone-600">
                    {clause.potentialTraps}
                  </p>
                </div>
              )}

              {/* Counter Proposal */}
              {clause.counterProposal && (
                <div className="p-3 bg-emerald-50/40 rounded-lg border border-emerald-200 text-emerald-950">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-emerald-900">
                      Recommended Balanced Redline:
                    </span>
                    <button
                      onClick={() => handleCopyCounter(clause.id, clause.counterProposal!)}
                      className="text-emerald-800 hover:text-emerald-950 font-medium flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      {copiedId === clause.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Counter-Clause</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="font-legal-serif text-stone-800 italic leading-relaxed bg-white/80 p-2.5 rounded border border-emerald-100">
                    "{clause.counterProposal}"
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
