import React, { useState } from 'react';
import { ConsultationBrief, RiskItem } from '../types/legal';
import { HelpCircle, FileText, Download, Printer, Check, Copy, Sparkles, AlertTriangle, ShieldCheck } from 'lucide-react';
import { exportConsultationBriefToPDF } from '../utils/pdfExport';

interface ConsultationPrepProps {
  documentText: string;
  documentTitle: string;
  identifiedRisks?: RiskItem[];
}

export const ConsultationPrep: React.FC<ConsultationPrepProps> = ({
  documentText,
  documentTitle,
  identifiedRisks = [],
}) => {
  const [userRole, setUserRole] = useState('Client / Subscriber');
  const [primaryConcerns, setPrimaryConcerns] = useState(
    'Minimize financial exposure, eliminate unilateral price changes, and ensure balanced termination rights.'
  );
  const [loading, setLoading] = useState(false);
  const [brief, setBrief] = useState<ConsultationBrief | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedBrief, setCopiedBrief] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  const handleDownloadBriefPdf = async () => {
    if (!brief) return;
    setDownloadingPdf(true);
    try {
      await exportConsultationBriefToPDF(brief, documentTitle);
    } catch (e) {
      console.error('Failed to export brief to PDF:', e);
    } finally {
      setTimeout(() => setDownloadingPdf(false), 800);
    }
  };

  const handleGenerateBrief = async () => {
    if (!documentText.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-consultation-prep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentText,
          documentTitle,
          userRole,
          primaryConcerns,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate consultation brief');
      }

      const data: ConsultationBrief = await response.json();
      setBrief(data);
    } catch (err: any) {
      setError(err?.message || 'Error generating brief');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyMarkdown = () => {
    if (!brief) return;

    const md = `# ATTORNEY CONSULTATION BRIEF
**Document:** ${documentTitle}
**Client Role:** ${brief.clientRole}
**Prepared via:** LexiClear Legal Navigator
**Date:** ${new Date().toLocaleDateString()}

---

## 1. Executive Summary
${brief.documentSummary}

## 2. High-Priority Legal Risks & Citations
${brief.topLegalRisks.map((r, i) => `### ${i + 1}. [${r.priority}] ${r.risk}\n**Contract Citation:** "${r.citation}"\n`).join('\n')}

## 3. Targeted Questions to Ask Attorney (To Save Billable Hours)
${brief.questionsForAttorney.map((q, i) => `### Question ${i + 1}: ${q.question}\n- **Context:** ${q.context}\n- **Desired Strategy/Outcome:** ${q.expectedGoal}\n`).join('\n')}

## 4. Suggested Exhibits & Evidence to Bring
${brief.suggestedExhibitsAndEvidence.map((e) => `- [ ] ${e}`).join('\n')}

## 5. Key Defined Legal Terms
${brief.keyTermsDefined.map((t) => `- **${t.term}:** ${t.definition}`).join('\n')}

---
*Notice: This brief provides informational assistance to prepare for an attorney consultation and does not constitute formal legal representation.*
`;

    navigator.clipboard.writeText(md);
    setCopiedBrief(true);
    setTimeout(() => setCopiedBrief(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header card */}
      <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-stone-700" />
          <div>
            <h2 className="text-base font-semibold text-stone-900">Attorney Consultation Prep Sheet</h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Generate a structured 1-page briefing that highlights exact citations, focused legal questions, and necessary evidence to save hundreds in hourly lawyer billing.
            </p>
          </div>
        </div>

        {/* Form Inputs */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
              Your Role in This Transaction:
            </label>
            <input
              type="text"
              value={userRole}
              onChange={(e) => setUserRole(e.target.value)}
              placeholder="e.g. Customer, Contractor, Tenant, Founder"
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-700"
            />
          </div>

          <div>
            <label className="block font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
              Primary Concerns & Redlines Desired:
            </label>
            <input
              type="text"
              value={primaryConcerns}
              onChange={(e) => setPrimaryConcerns(e.target.value)}
              placeholder="e.g. Cap indemnification, remove non-compete, reduce notice period"
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-700"
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end pt-3 border-t border-stone-100">
          <button
            onClick={handleGenerateBrief}
            disabled={loading || !documentText.trim()}
            className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 text-white rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
          >
            {loading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Compiling Lawyer Briefing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Generate Attorney Consultation Brief</span>
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

      {/* Generated Brief */}
      {brief && (
        <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6 md:p-8 space-y-6 print:border-none print:shadow-none animate-in fade-in duration-300">
          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-200 print:hidden">
            <div>
              <span className="text-xs uppercase font-mono tracking-wider text-amber-800 font-semibold block">
                Ready for Consultation
              </span>
              <h3 className="text-lg font-semibold text-stone-900">
                Legal Brief: {documentTitle}
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <button
                onClick={handleDownloadBriefPdf}
                disabled={downloadingPdf}
                className="px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 text-white rounded-md font-medium flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                title="Download formatted attorney brief as a PDF"
              >
                <Download className="w-3.5 h-3.5 text-amber-300" />
                <span>{downloadingPdf ? 'Saving PDF...' : 'Download PDF Brief'}</span>
              </button>
              <button
                onClick={handleCopyMarkdown}
                className="px-3 py-1.5 border border-stone-300 hover:bg-stone-50 text-stone-700 rounded-md font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                {copiedBrief ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedBrief ? 'Copied' : 'Copy Markdown'}</span>
              </button>
              <button
                onClick={handlePrint}
                className="px-3 py-1.5 border border-stone-300 hover:bg-stone-50 text-stone-700 rounded-md font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
                title="Print brief"
              >
                <Printer className="w-3.5 h-3.5 text-stone-600" />
                <span>Print</span>
              </button>
            </div>
          </div>

          {/* Section 1: Executive Brief */}
          <div className="space-y-1 text-xs">
            <span className="font-semibold uppercase tracking-wider text-stone-500">
              1. Document Scope & Client Position
            </span>
            <div className="bg-stone-50 p-4 rounded-lg border border-stone-200 text-stone-800 leading-relaxed text-sm">
              <p><strong>Client Role:</strong> {brief.clientRole}</p>
              <p className="mt-1"><strong>Document Purpose:</strong> {brief.documentSummary}</p>
            </div>
          </div>

          {/* Section 2: High-Priority Legal Risks & Citations */}
          <div className="space-y-3 text-xs">
            <span className="font-semibold uppercase tracking-wider text-stone-500 block">
              2. Key Contractual Risks to Flag to Counsel ({brief.topLegalRisks.length})
            </span>
            <div className="space-y-2.5">
              {brief.topLegalRisks.map((risk, idx) => (
                <div key={idx} className="p-3.5 rounded-lg border border-stone-200 bg-stone-50/50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-stone-900 text-sm">{risk.risk}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                      risk.priority === 'Urgent' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {risk.priority}
                    </span>
                  </div>
                  <p className="font-legal-serif text-stone-700 italic leading-relaxed text-[13px] bg-white p-2 rounded border border-stone-200/80 mt-2">
                    "{risk.citation}"
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Targeted Questions for the Attorney */}
          <div className="space-y-3 text-xs">
            <span className="font-semibold uppercase tracking-wider text-stone-500 block">
              3. Specific Questions to Ask the Attorney (Optimized for Efficiency)
            </span>
            <div className="space-y-3">
              {brief.questionsForAttorney.map((item, idx) => (
                <div key={idx} className="p-4 rounded-lg border border-amber-200/80 bg-amber-50/30">
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs">
                      {idx + 1}
                    </span>
                    <div className="space-y-1">
                      <h4 className="font-semibold text-stone-900 text-sm">
                        "{item.question}"
                      </h4>
                      <p className="text-stone-600">
                        <strong className="text-stone-800">Why to ask: </strong>{item.context}
                      </p>
                      <p className="text-amber-900">
                        <strong>Target Outcome: </strong>{item.expectedGoal}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Evidence to Bring */}
          <div className="space-y-2 text-xs">
            <span className="font-semibold uppercase tracking-wider text-stone-500 block">
              4. Evidence & Documentation to Bring to the Meeting
            </span>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {brief.suggestedExhibitsAndEvidence.map((doc, idx) => (
                <li key={idx} className="p-2.5 bg-stone-50 rounded border border-stone-200 text-stone-700 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-stone-400" />
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 5: Key Terms Glossary */}
          {brief.keyTermsDefined && brief.keyTermsDefined.length > 0 && (
            <div className="space-y-2 text-xs pt-2 border-t border-stone-100">
              <span className="font-semibold uppercase tracking-wider text-stone-500 block">
                5. Plain-English Glossary of Legal Terms in This Agreement
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {brief.keyTermsDefined.map((term, idx) => (
                  <div key={idx} className="p-3 bg-stone-50/70 rounded border border-stone-200">
                    <span className="font-semibold text-stone-900 block mb-0.5">{term.term}</span>
                    <span className="text-stone-600 leading-relaxed">{term.definition}</span>
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
