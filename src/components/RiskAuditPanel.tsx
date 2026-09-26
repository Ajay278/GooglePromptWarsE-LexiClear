import React, { useState } from 'react';
import { RiskItem, RiskSeverity } from '../types/legal';
import { AlertOctagon, AlertTriangle, ShieldAlert, Check, Copy, Sparkles, Filter } from 'lucide-react';

interface RiskAuditPanelProps {
  risks: RiskItem[];
  onOpenClauseSimplifier: (quote: string) => void;
}

export const RiskAuditPanel: React.FC<RiskAuditPanelProps> = ({
  risks,
  onOpenClauseSimplifier,
}) => {
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredRisks = risks.filter((r) => {
    if (filterSeverity === 'all') return true;
    return r.severity === filterSeverity;
  });

  const handleCopyRedline = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getSeverityBadge = (sev: RiskSeverity) => {
    switch (sev) {
      case 'critical':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1">
            <AlertOctagon className="w-3 h-3 text-rose-600" />
            Critical Risk
          </span>
        );
      case 'high':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            High Risk
          </span>
        );
      case 'medium':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-medium uppercase tracking-wider bg-yellow-100 text-yellow-800 border border-yellow-200">
            Moderate Risk
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-medium uppercase tracking-wider bg-stone-100 text-stone-700 border border-stone-200">
            Low / Advisory
          </span>
        );
    }
  };

  const counts = {
    all: risks.length,
    critical: risks.filter((r) => r.severity === 'critical').length,
    high: risks.filter((r) => r.severity === 'high').length,
    medium: risks.filter((r) => r.severity === 'medium').length,
  };

  return (
    <div className="space-y-6">
      {/* Risk Audit Header */}
      <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-700" />
            <h2 className="text-base font-semibold text-stone-900">Contract Risk Audit & Trap Detection</h2>
          </div>
          <p className="text-xs text-stone-500 mt-1 max-w-xl">
            Detailed breakdown of one-sided liabilities, indemnities, unreasonable covenants, and hidden renewal traps substantiated with verbatim quotes.
          </p>
        </div>

        {/* Severity Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg text-xs self-start md:self-auto">
          <button
            onClick={() => setFilterSeverity('all')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
              filterSeverity === 'all'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            All ({counts.all})
          </button>
          <button
            onClick={() => setFilterSeverity('critical')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
              filterSeverity === 'critical'
                ? 'bg-rose-50 text-rose-800 font-semibold shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Critical ({counts.critical})
          </button>
          <button
            onClick={() => setFilterSeverity('high')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
              filterSeverity === 'high'
                ? 'bg-amber-50 text-amber-800 font-semibold shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            High ({counts.high})
          </button>
          <button
            onClick={() => setFilterSeverity('medium')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
              filterSeverity === 'medium'
                ? 'bg-yellow-50 text-yellow-800 font-semibold shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Moderate ({counts.medium})
          </button>
        </div>
      </div>

      {/* Risks List */}
      <div className="space-y-4">
        {filteredRisks.length === 0 ? (
          <div className="bg-white p-8 rounded-xl border border-stone-200 text-center text-xs text-stone-500">
            No risks found matching the selected filter.
          </div>
        ) : (
          filteredRisks.map((risk) => (
            <div
              key={risk.id}
              className={`bg-white rounded-xl border transition-all shadow-xs overflow-hidden ${
                risk.severity === 'critical'
                  ? 'border-rose-300 ring-1 ring-rose-200/50'
                  : risk.severity === 'high'
                  ? 'border-amber-300'
                  : 'border-stone-200'
              }`}
            >
              {/* Risk Card Header */}
              <div className="p-5 border-b border-stone-100 flex flex-wrap items-center justify-between gap-2 bg-stone-50/50">
                <div className="flex items-center gap-2.5">
                  {getSeverityBadge(risk.severity)}
                  <h3 className="font-semibold text-stone-900 text-sm">{risk.title}</h3>
                </div>
                {risk.clauseLocation && (
                  <span className="text-xs font-mono text-stone-500 bg-stone-200/70 px-2 py-0.5 rounded">
                    {risk.clauseLocation}
                  </span>
                )}
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-4 text-xs">
                {/* Verbatim Document Quote */}
                <div className="bg-stone-50 p-3.5 rounded-lg border border-stone-200">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-1 flex items-center justify-between">
                    <span>Exact Contract Quote:</span>
                    <button
                      onClick={() => onOpenClauseSimplifier(risk.exactDocumentQuote)}
                      className="text-amber-800 hover:text-amber-950 font-medium flex items-center gap-1 cursor-pointer transition-colors"
                      title="Inspect in clause simplifier"
                    >
                      <Sparkles className="w-3 h-3 text-amber-600" />
                      <span>Deep Dissect</span>
                    </button>
                  </div>
                  <p className="font-legal-serif text-stone-800 italic leading-relaxed text-[13px]">
                    "{risk.exactDocumentQuote}"
                  </p>
                </div>

                {/* Plain English Explanation */}
                <div>
                  <span className="font-semibold text-stone-900 block mb-1">
                    Plain English Meaning:
                  </span>
                  <p className="text-stone-700 leading-relaxed text-sm">
                    {risk.plainEnglishExplanation}
                  </p>
                </div>

                {/* Why It Matters / Real World Harm */}
                <div className="p-3 bg-amber-50/60 rounded-lg border border-amber-200/70 text-amber-950">
                  <span className="font-semibold block mb-0.5 text-amber-900">
                    Why This Matters (Practical Exposure):
                  </span>
                  <p className="leading-relaxed">
                    {risk.whyItMatters}
                  </p>
                </div>

                {/* Suggested Action & Counter-Language */}
                <div className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-200 text-emerald-950">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-emerald-900">
                      Recommended Redline / Counter-Proposal:
                    </span>
                    <button
                      onClick={() => handleCopyRedline(risk.id, risk.suggestedActionOrRedline)}
                      className="text-emerald-800 hover:text-emerald-950 font-medium flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      {copiedId === risk.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Copied Redline!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Redline</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="font-legal-serif text-stone-800 italic leading-relaxed bg-white/70 p-2.5 rounded border border-emerald-100">
                    "{risk.suggestedActionOrRedline}"
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
