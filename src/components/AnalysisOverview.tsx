import React, { useState } from 'react';
import { DocumentAnalysisResult } from '../types/legal';
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  Users,
  FileQuestion,
  HelpCircle,
  Copy,
  Check,
  Download,
} from 'lucide-react';

interface AnalysisOverviewProps {
  analysis: DocumentAnalysisResult;
  onNavigateToRiskAudit: () => void;
  onNavigateToPrep: () => void;
  onDownloadPdf?: () => void;
}

export const AnalysisOverview: React.FC<AnalysisOverviewProps> = ({
  analysis,
  onNavigateToRiskAudit,
  onNavigateToPrep,
  onDownloadPdf,
}) => {
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  const [copiedSummary, setCopiedSummary] = useState(false);

  const toggleChecklist = (id: string) => {
    setCompletedSteps((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopySummary = () => {
    const text = `EXECUTIVE SUMMARY - ${analysis.documentTitle}\n\n` +
      analysis.executiveSummary.map((s, i) => `${i + 1}. ${s}`).join('\n') +
      `\n\nOverall Risk: ${analysis.overallRiskScore}/100 (${analysis.overallRiskLabel})`;
    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const getRiskScoreColor = (score: number) => {
    if (score >= 70) return { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-300', fill: 'bg-rose-600' };
    if (score >= 40) return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-300', fill: 'bg-amber-500' };
    return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-300', fill: 'bg-emerald-600' };
  };

  const scoreTheme = getRiskScoreColor(analysis.overallRiskScore);

  return (
    <div className="space-y-6">
      {/* Top Banner: Risk Assessment & Core Stats */}
      <div className={`p-5 rounded-xl border ${scoreTheme.border} ${scoreTheme.bg} flex flex-col md:flex-row items-start md:items-center justify-between gap-5`}>
        <div className="flex items-start gap-4">
          <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-stone-200"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={scoreTheme.text}
                strokeDasharray={`${analysis.overallRiskScore}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className={`text-base font-bold tabular-nums ${scoreTheme.text}`}>
                {analysis.overallRiskScore}
              </span>
              <span className="text-[9px] text-stone-500 uppercase tracking-tighter">/ 100</span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-stone-900 text-base">
                Risk Rating: <span className={scoreTheme.text}>{analysis.overallRiskLabel}</span>
              </h3>
            </div>
            <p className="text-xs text-stone-600 mt-1 max-w-xl leading-relaxed">
              Based on deep contract clause analysis, liability exposure, unilateral termination clauses, and non-negotiated covenants.
            </p>
            <div className="flex items-center gap-3 mt-2.5 text-xs">
              <button
                onClick={onNavigateToRiskAudit}
                className="font-medium underline hover:text-stone-900 text-stone-700 cursor-pointer flex items-center gap-1"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                <span>View {analysis.criticalRisks.length} Identified Risks</span>
              </button>
              <span className="text-stone-300">·</span>
              <button
                onClick={onNavigateToPrep}
                className="font-medium underline hover:text-stone-900 text-stone-700 cursor-pointer flex items-center gap-1"
              >
                <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
                <span>Prepare Legal Consultation Brief</span>
              </button>
            </div>
          </div>
        </div>

        {/* Governing Law Pill & Quick Meta */}
        <div className="bg-white/80 backdrop-blur-sm p-3 rounded-lg border border-stone-200/80 text-xs shrink-0 self-stretch md:self-auto flex flex-col justify-center">
          <div className="text-stone-500 font-medium">Jurisdiction & Document Type</div>
          <div className="font-semibold text-stone-900 mt-0.5">{analysis.documentType}</div>
          <div className="text-stone-600 mt-0.5">Governing Law: <strong className="text-stone-800">{analysis.governingLaw || 'Unspecified'}</strong></div>
        </div>
      </div>

      {/* Executive Brief: Plain English Translation */}
      <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-100">
          <div>
            <h3 className="text-sm font-semibold text-stone-900">Executive Summary (Plain English)</h3>
            <p className="text-xs text-stone-500">Core operational and commercial terms translated for non-lawyers</p>
          </div>
          <div className="flex items-center gap-2">
            {onDownloadPdf && (
              <button
                onClick={onDownloadPdf}
                className="text-xs text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 flex items-center gap-1.5 px-3 py-1 rounded-md border border-stone-300 cursor-pointer transition-colors shadow-2xs font-medium"
                title="Download complete analysis, risk audit, and consultation questions as PDF"
              >
                <Download className="w-3.5 h-3.5 text-amber-700" />
                <span>Download PDF Report</span>
              </button>
            )}
            <button
              onClick={handleCopySummary}
              className="text-xs text-stone-500 hover:text-stone-900 flex items-center gap-1 px-2.5 py-1 rounded-md border border-stone-200 hover:bg-stone-50 cursor-pointer transition-colors"
            >
              {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSummary ? 'Copied' : 'Copy Summary'}</span>
            </button>
          </div>
        </div>

        <ul className="mt-4 space-y-2.5 text-stone-800 text-sm">
          {analysis.executiveSummary.map((bullet, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-amber-50 text-amber-800 flex items-center justify-center text-xs font-semibold shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <p className="leading-relaxed">{bullet}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Parties & Relative Leverage */}
      <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
        <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
          <Users className="w-4 h-4 text-stone-600" />
          <div>
            <h3 className="text-sm font-semibold text-stone-900">Contracting Parties & Power Dynamics</h3>
            <p className="text-xs text-stone-500">Identified entities and contractual leverage assessment</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {analysis.parties.map((party, idx) => (
            <div key={idx} className="p-4 rounded-lg bg-stone-50/70 border border-stone-200">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-stone-900 text-sm">{party.name}</span>
                <span className="text-xs px-2 py-0.5 bg-stone-200 text-stone-700 rounded font-medium">
                  {party.role}
                </span>
              </div>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                {party.leverageSummary}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Critical Deadlines & Notice Windows Timeline */}
      <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
        <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
          <Clock className="w-4 h-4 text-amber-700" />
          <div>
            <h3 className="text-sm font-semibold text-stone-900">Key Deadlines, Renewal Windows & Notice Obligations</h3>
            <p className="text-xs text-stone-500">Strict dates extracted directly from contract text to prevent forfeiture or automatic renewal</p>
          </div>
        </div>

        {analysis.keyDeadlines.length === 0 ? (
          <p className="text-xs text-stone-500 mt-4 italic">No explicit statutory or contractual deadlines detected in the text.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50 text-stone-600">
                  <th className="py-2.5 px-3 font-semibold">Obligation / Deadline</th>
                  <th className="py-2.5 px-3 font-semibold">Timeline / Window</th>
                  <th className="py-2.5 px-3 font-semibold">Responsible Party</th>
                  <th className="py-2.5 px-3 font-semibold">Consequence of Missing</th>
                  <th className="py-2.5 px-3 font-semibold">Contract Citation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {analysis.keyDeadlines.map((deadline) => (
                  <tr key={deadline.id} className="hover:bg-stone-50/50">
                    <td className="py-2.5 px-3 font-medium text-stone-900">{deadline.title}</td>
                    <td className="py-2.5 px-3 font-semibold text-amber-800">{deadline.dueOrPeriod}</td>
                    <td className="py-2.5 px-3 text-stone-700">{deadline.responsibleParty}</td>
                    <td className="py-2.5 px-3 text-rose-700 font-medium">{deadline.consequenceOfBreach}</td>
                    <td className="py-2.5 px-3 font-legal-serif text-stone-500 italic max-w-xs truncate" title={deadline.citation}>
                      "{deadline.citation}"
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Inconsistencies & Ambiguities Alert */}
      {analysis.inconsistenciesOrAmbiguities && analysis.inconsistenciesOrAmbiguities.length > 0 && (
        <div className="bg-amber-50/60 p-5 rounded-xl border border-amber-200">
          <div className="flex items-center gap-2 pb-2">
            <FileQuestion className="w-4 h-4 text-amber-800" />
            <h3 className="text-sm font-semibold text-amber-950">Contract Inconsistencies & Vague Language Detected</h3>
          </div>
          <p className="text-xs text-amber-900 mb-3">
            Ambiguous clauses expose parties to dispute because courts or arbitrators may interpret silence against the drafting party or enforce unexpected standards.
          </p>

          <div className="space-y-3">
            {analysis.inconsistenciesOrAmbiguities.map((item, idx) => (
              <div key={idx} className="bg-white/90 p-3.5 rounded-lg border border-amber-200/80 text-xs">
                <div className="font-semibold text-stone-900 mb-1">{item.issue}</div>
                <div className="text-stone-700 mb-2 leading-relaxed">{item.explanation}</div>
                <div className="text-amber-900 font-medium bg-amber-50 p-2 rounded border border-amber-200/50">
                  <strong>Recommendation:</strong> {item.recommendation}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actionable Next Steps Checklist */}
      <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <div>
              <h3 className="text-sm font-semibold text-stone-900">Actionable Checklist Before Signing</h3>
              <p className="text-xs text-stone-500">Pragmatic steps to protect your interests and negotiate safer terms</p>
            </div>
          </div>
          <span className="text-xs font-mono text-stone-500">
            {Object.values(completedSteps).filter(Boolean).length} / {analysis.actionableChecklist.length} completed
          </span>
        </div>

        <div className="mt-4 space-y-2.5">
          {analysis.actionableChecklist.map((item) => {
            const isDone = completedSteps[item.id] || false;
            return (
              <div
                key={item.id}
                onClick={() => toggleChecklist(item.id)}
                className={`p-3.5 rounded-lg border text-xs cursor-pointer transition-all flex items-start gap-3 ${
                  isDone
                    ? 'bg-emerald-50/40 border-emerald-200 text-stone-500'
                    : 'bg-stone-50/70 hover:bg-stone-50 border-stone-200 text-stone-800'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isDone}
                  onChange={() => {}}
                  className="mt-0.5 rounded text-amber-700 focus:ring-amber-600 h-4 w-4 cursor-pointer"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold ${isDone ? 'line-through text-stone-400' : 'text-stone-900'}`}>
                      {item.step}
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                        item.category === 'Must Do'
                          ? 'bg-rose-100 text-rose-800'
                          : item.category === 'Should Negotiate'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-stone-200 text-stone-700'
                      }`}
                    >
                      {item.category}
                    </span>
                  </div>
                  <p className={`mt-1 leading-relaxed ${isDone ? 'text-stone-400' : 'text-stone-600'}`}>
                    {item.details}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
