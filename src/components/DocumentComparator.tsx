import React, { useState } from 'react';
import { ComparisonResult, DiffDifference, RiskSeverity } from '../types/legal';
import { GitCompare, AlertTriangle, ArrowRight, ShieldCheck, Check, Copy, Sparkles, Plus, AlertOctagon } from 'lucide-react';

interface DocumentComparatorProps {
  initialDocA: { title: string; text: string };
  initialDocB?: { title: string; text: string };
  onOpenClauseSimplifier: (quote: string) => void;
}

export const DocumentComparator: React.FC<DocumentComparatorProps> = ({
  initialDocA,
  initialDocB,
  onOpenClauseSimplifier,
}) => {
  const [docA, setDocA] = useState(initialDocA);
  const [docB, setDocB] = useState(
    initialDocB || {
      title: 'Counter-Proposal / Comparison Agreement',
      text: '',
    }
  );
  const [comparisonFocus, setComparisonFocus] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedRedline, setCopiedRedline] = useState<string | null>(null);

  // Sync if initial props change
  React.useEffect(() => {
    setDocA(initialDocA);
    if (initialDocB) {
      setDocB(initialDocB);
    }
  }, [initialDocA, initialDocB]);

  const handleCompare = async () => {
    if (!docA.text.trim() || !docB.text.trim()) {
      setError('Please provide text for both Document A and Document B to run comparison.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/compare-documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          docA,
          docB,
          comparisonFocus: comparisonFocus.trim() || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to compare documents');
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err?.message || 'Error executing document comparison');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyRedline = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRedline(id);
    setTimeout(() => setCopiedRedline(null), 2000);
  };

  const getImpactBadge = (verdict: DiffDifference['impactVerdict']) => {
    if (verdict.includes('Risk Added') || verdict.includes('Doc A')) {
      return (
        <span className="text-[11px] px-2 py-0.5 rounded font-semibold bg-rose-100 text-rose-800 flex items-center gap-1">
          <AlertOctagon className="w-3 h-3" />
          {verdict}
        </span>
      );
    }
    if (verdict.includes('Doc B')) {
      return (
        <span className="text-[11px] px-2 py-0.5 rounded font-semibold bg-emerald-100 text-emerald-800 flex items-center gap-1">
          <ShieldCheck className="w-3 h-3" />
          {verdict}
        </span>
      );
    }
    return (
      <span className="text-[11px] px-2 py-0.5 rounded font-medium bg-stone-100 text-stone-700">
        {verdict}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Comparator Header */}
      <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
        <div className="flex items-center gap-2">
          <GitCompare className="w-5 h-5 text-stone-700" />
          <div>
            <h2 className="text-base font-semibold text-stone-900">Contract Diff & Legal Risk Shift Analyzer</h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Compare original contracts with counter-proposals or competing vendor terms to uncover sneaky additions, liability shifts, and omitted rights.
            </p>
          </div>
        </div>

        {/* Input Boxes for Doc A and Doc B */}
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Doc A */}
          <div className="p-4 bg-stone-50/70 rounded-lg border border-stone-200 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                Document A (Baseline / Original)
              </span>
              <span className="text-xs text-stone-500 font-medium">{docA.title}</span>
            </div>
            <textarea
              aria-label="Document A text to compare"
              value={docA.text}
              onChange={(e) => setDocA({ ...docA, text: e.target.value })}
              placeholder="Paste first contract text here..."
              rows={6}
              className="w-full text-xs font-legal-serif p-2.5 bg-white border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-700 leading-relaxed resize-y"
            />
          </div>

          {/* Doc B */}
          <div className="p-4 bg-stone-50/70 rounded-lg border border-stone-200 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                Document B (Counter-Proposal / Redline)
              </span>
              <input
                type="text"
                aria-label="Document B title"
                value={docB.title}
                onChange={(e) => setDocB({ ...docB, title: e.target.value })}
                className="text-xs text-stone-700 font-medium px-2 py-0.5 bg-white border border-stone-300 rounded focus:outline-none"
              />
            </div>
            <textarea
              aria-label="Document B text to compare"
              value={docB.text}
              onChange={(e) => setDocB({ ...docB, text: e.target.value })}
              placeholder="Paste second contract or redline version here to compare..."
              rows={6}
              className="w-full text-xs font-legal-serif p-2.5 bg-white border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-700 leading-relaxed resize-y"
            />
          </div>
        </div>

        {/* Focus prompt & action */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-stone-100">
          <input
            type="text"
            aria-label="Optional comparison focus area"
            placeholder="Optional specific focus (e.g., 'liability caps and termination rights')..."
            value={comparisonFocus}
            onChange={(e) => setComparisonFocus(e.target.value)}
            className="text-xs px-3 py-2 bg-stone-50 border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-700 flex-1 w-full"
          />

          <button
            onClick={handleCompare}
            disabled={loading || !docA.text.trim() || !docB.text.trim()}
            className="w-full sm:w-auto px-5 py-2 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors shrink-0"
          >
            {loading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Running Rigorous Legal Diff...</span>
              </>
            ) : (
              <>
                <GitCompare className="w-4 h-4 text-amber-300" />
                <span>Run Side-by-Side Diff Analysis</span>
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
            {error}
          </div>
        )}
      </div>

      {/* Comparison Results */}
      {result && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Verdict Banner */}
          <div className="bg-stone-900 text-white p-6 rounded-xl shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-stone-800">
              <div>
                <span className="text-xs uppercase font-mono tracking-wider text-amber-400 block mb-1">
                  Overall Comparative Verdict
                </span>
                <h3 className="text-lg font-semibold text-white">
                  {result.overallComparisonVerdict}
                </h3>
              </div>
              <div className="text-xs px-3 py-1.5 bg-stone-800 text-amber-200 border border-stone-700 rounded-md font-medium shrink-0">
                Favorable Outcome: <strong>{result.winnerOrFavorableTo}</strong>
              </div>
            </div>

            <p className="text-xs text-stone-300 mt-3 leading-relaxed">
              {result.summary}
            </p>
          </div>

          {/* Sneaky Changes & Omissions Warning */}
          {result.sneakyChangesOrOmissions && result.sneakyChangesOrOmissions.length > 0 && (
            <div className="bg-rose-50/70 p-5 rounded-xl border border-rose-200">
              <div className="flex items-center gap-2 pb-2">
                <AlertTriangle className="w-4 h-4 text-rose-700" />
                <h3 className="text-sm font-semibold text-rose-950">
                  Sneaky Clauses & Omissions Detected
                </h3>
              </div>
              <p className="text-xs text-rose-900 mb-3">
                Clauses or modifications easily overlooked in casual reviews that alter liability or remedies:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {result.sneakyChangesOrOmissions.map((sneak, idx) => (
                  <div key={idx} className="bg-white p-3.5 rounded-lg border border-rose-200 text-xs shadow-2xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 px-2 py-0.5 rounded bg-rose-50 border border-rose-100 inline-block mb-1">
                      {sneak.type}
                    </span>
                    <p className="text-stone-800 leading-relaxed mt-1">
                      {sneak.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Critical Differences Matrix */}
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
            <h3 className="text-sm font-semibold text-stone-900 pb-3 border-b border-stone-100 mb-4">
              Detailed Clause-by-Clause Divergences ({result.criticalDifferences.length})
            </h3>

            <div className="space-y-5">
              {result.criticalDifferences.map((diff) => (
                <div key={diff.id} className="p-4 rounded-xl border border-stone-200 bg-stone-50/40 text-xs space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-stone-900 text-sm">{diff.issue}</span>
                      <span className="text-stone-400">·</span>
                      <span className="text-stone-500 font-medium">{diff.category}</span>
                    </div>
                    {getImpactBadge(diff.impactVerdict)}
                  </div>

                  {/* Side-by-side excerpts */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3 bg-white rounded-lg border border-stone-200">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-500 block mb-1">
                        {result.docAName} Excerpt:
                      </span>
                      <p className="font-legal-serif text-stone-800 italic leading-relaxed text-[13px]">
                        "{diff.docAQuote}"
                      </p>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-stone-200">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-500 block mb-1">
                        {result.docBName} Excerpt:
                      </span>
                      <p className="font-legal-serif text-stone-800 italic leading-relaxed text-[13px]">
                        "{diff.docBQuote}"
                      </p>
                    </div>
                  </div>

                  {/* Plain explanation & stance */}
                  <div className="space-y-1.5 pt-1">
                    <div>
                      <strong className="text-stone-900">Practical Shift: </strong>
                      <span className="text-stone-700">{diff.plainExplanation}</span>
                    </div>
                    <div className="p-2.5 bg-amber-50/60 rounded border border-amber-200/60 text-amber-950">
                      <strong className="text-amber-900">Recommended Negotiation Stance: </strong>
                      <span>{diff.recommendedStance}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Counter Redlines */}
          {result.suggestedCounterRedlines && result.suggestedCounterRedlines.length > 0 && (
            <div className="bg-emerald-50/50 p-6 rounded-xl border border-emerald-200">
              <h3 className="text-sm font-semibold text-emerald-950 mb-3 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Recommended Counter-Redline Proposals</span>
              </h3>
              <div className="space-y-2.5 text-xs">
                {result.suggestedCounterRedlines.map((redline, idx) => (
                  <div key={idx} className="bg-white p-3.5 rounded-lg border border-emerald-200 flex items-start justify-between gap-3">
                    <p className="font-legal-serif text-stone-800 italic leading-relaxed">
                      "{redline}"
                    </p>
                    <button
                      onClick={() => handleCopyRedline(redline, `redline-${idx}`)}
                      className="text-emerald-800 hover:text-emerald-950 shrink-0 font-medium flex items-center gap-1 p-1 hover:bg-emerald-50 rounded cursor-pointer transition-colors"
                      title="Copy redline proposal"
                    >
                      {copiedRedline === `redline-${idx}` ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
