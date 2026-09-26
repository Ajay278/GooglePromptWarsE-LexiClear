import React, { useState } from 'react';
import { X, Sparkles, Scale, Copy, Check, AlertTriangle, ShieldCheck } from 'lucide-react';

interface ClauseSimplifierModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialClause?: string;
}

export const ClauseSimplifierModal: React.FC<ClauseSimplifierModalProps> = ({
  isOpen,
  onClose,
  initialClause = '',
}) => {
  const [clauseText, setClauseText] = useState(initialClause);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    title: string;
    plainEnglish: string;
    whoBenefits: string;
    riskLevel: string;
    hiddenTraps: string;
    recommendedCounterClause: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedCounter, setCopiedCounter] = useState(false);

  // Sync initial clause if passed
  React.useEffect(() => {
    if (initialClause) {
      setClauseText(initialClause);
    }
  }, [initialClause]);

  if (!isOpen) return null;

  const handleSimplify = async () => {
    if (!clauseText.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/simplify-clause', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clauseText }),
      });
      if (!response.ok) {
        throw new Error('Failed to simplify clause');
      }
      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err?.message || 'Error communicating with analysis engine');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCounter = () => {
    if (result?.recommendedCounterClause) {
      navigator.clipboard.writeText(result.recommendedCounterClause);
      setCopiedCounter(true);
      setTimeout(() => setCopiedCounter(false), 2000);
    }
  };

  const sampleClauses = [
    {
      label: 'Unilateral Price Increase',
      text: 'Vendor reserves the unilateral right to increase subscription fees by up to 25% annually upon fifteen (15) calendar days written notice. Continued use constitutes irrevocable acceptance.',
    },
    {
      label: '2-Year Auto-Renewal',
      text: 'Agreement shall automatically renew for successive terms of twenty-four (24) months each unless Client provides written notice of non-renewal via certified mail at least 120 days prior to expiration. Email notice is invalid.',
    },
    {
      label: 'Uncapped Customer Indemnity',
      text: 'Client shall defend, indemnify, and hold harmless Vendor from all claims, damages, liabilities, and legal costs (including full attorney fees). Clients liability to Vendor is uncapped and not subject to any limitation.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl border border-stone-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-800">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-stone-900 text-base">Instant Clause Simplifier & Trap Detector</h3>
              <p className="text-xs text-stone-500">Translate dense legalese into plain English, detect one-sided terms, and generate counter-proposals</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1.5 rounded-lg hover:bg-stone-200/60 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Sample quick picks */}
          <div>
            <span className="text-xs font-medium text-stone-500 block mb-1.5">Try a common high-risk clause:</span>
            <div className="flex flex-wrap gap-2">
              {sampleClauses.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => setClauseText(sample.text)}
                  className="text-xs px-2.5 py-1 bg-stone-100 hover:bg-amber-50 hover:text-amber-900 hover:border-amber-300 border border-stone-200 rounded-md text-stone-700 transition-colors cursor-pointer"
                >
                  {sample.label}
                </button>
              ))}
            </div>
          </div>

          {/* Text Area */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
              Paste or Edit Legal Clause:
            </label>
            <textarea
              value={clauseText}
              onChange={(e) => setClauseText(e.target.value)}
              placeholder="Paste any contract section, clause, warranty disclaimer, or covenant here..."
              rows={4}
              className="w-full text-sm font-legal-serif p-3 bg-stone-50/50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 outline-none leading-relaxed"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSimplify}
              disabled={loading || !clauseText.trim()}
              className="px-4 py-2 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 text-white rounded-lg text-sm font-medium flex items-center gap-2 cursor-pointer shadow-sm transition-all"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Dissecting Clause with Precision...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Simplify & Detect Traps</span>
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
              {error}
            </div>
          )}

          {/* Results Display */}
          {result && (
            <div className="mt-4 pt-4 border-t border-stone-200 space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <h4 className="font-semibold text-stone-900 text-sm">{result.title}</h4>
                <div className="flex items-center gap-2 text-xs text-stone-500">
                  <span>Advantage: <strong className="text-stone-800">{result.whoBenefits}</strong></span>
                  <span>·</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wider ${
                    result.riskLevel === 'critical' ? 'bg-rose-100 text-rose-800' :
                    result.riskLevel === 'high' ? 'bg-amber-100 text-amber-800' :
                    result.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-emerald-100 text-emerald-800'
                  }`}>
                    {result.riskLevel} risk
                  </span>
                </div>
              </div>

              {/* Plain English Translation */}
              <div className="bg-amber-50/50 p-4 rounded-lg border border-amber-200/60">
                <span className="text-xs font-semibold text-amber-900 uppercase tracking-wider block mb-1">
                  In Plain English (What this actually means):
                </span>
                <p className="text-sm text-stone-800 leading-relaxed">
                  {result.plainEnglish}
                </p>
              </div>

              {/* Hidden Traps & Pitfalls */}
              <div className="bg-stone-50 p-4 rounded-lg border border-stone-200">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-800 uppercase tracking-wider mb-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Hidden Traps & Worst-Case Scenario:</span>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed">
                  {result.hiddenTraps}
                </p>
              </div>

              {/* Recommended Balanced Counter-Proposal */}
              <div className="bg-emerald-50/40 p-4 rounded-lg border border-emerald-200/60">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-900 uppercase tracking-wider">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Balanced Counter-Proposal (Ready to Propose):</span>
                  </div>
                  <button
                    onClick={handleCopyCounter}
                    className="text-xs text-emerald-800 hover:text-emerald-950 font-medium flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    {copiedCounter ? (
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
                <p className="text-xs font-legal-serif text-stone-800 bg-white/80 p-2.5 rounded border border-emerald-100 italic leading-relaxed">
                  "{result.recommendedCounterClause}"
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-stone-200 bg-stone-50 flex items-center justify-between text-xs text-stone-500">
          <span>Accuracy-grounded translation. Counter-clauses provide informational guidance.</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-md font-medium cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
