import React from 'react';
import { Scale, Sparkles, BookOpen, ShieldAlert, GitCompare, HelpCircle, FileText, Upload, Download } from 'lucide-react';
import { SAMPLE_DOCUMENTS } from '../data/sampleDocuments';

export type ActiveTab = 'overview' | 'risks' | 'clauses' | 'compare' | 'qa' | 'prep';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectedDocId: string;
  onSelectSampleDoc: (id: string) => void;
  onOpenCustomDocModal: () => void;
  onOpenClauseSimplifier: () => void;
  isAnalyzing: boolean;
  onReanalyze: () => void;
  onDownloadPdf?: () => void;
  hasAnalysis?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedDocId,
  onSelectSampleDoc,
  onOpenCustomDocModal,
  onOpenClauseSimplifier,
  isAnalyzing,
  onReanalyze,
  onDownloadPdf,
  hasAnalysis = false,
}) => {
  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-30">
      {/* Top Brand Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo and Tagline */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-stone-900 text-amber-400 flex items-center justify-center shadow-xs">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-legal-display font-bold text-stone-950 text-lg tracking-wide">
                LexiClear
              </span>
              <span className="text-xs text-stone-400 font-mono">/</span>
              <span className="text-xs font-semibold text-stone-600 uppercase tracking-wider">
                Legal Navigator
              </span>
            </div>
            <p className="text-[11px] text-stone-500 hidden sm:block">
              Grounded legal document simplification, risk detection, contract comparison & consultation prep
            </p>
          </div>
        </div>

        {/* Document Selection & Instant Tools */}
        <div className="flex items-center gap-2.5">
          {/* Document Switcher Dropdown */}
          <div className="relative">
            <select
              value={selectedDocId}
              onChange={(e) => {
                if (e.target.value === 'custom') {
                  onOpenCustomDocModal();
                } else {
                  onSelectSampleDoc(e.target.value);
                }
              }}
              className="text-xs font-medium pl-3 pr-8 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-700 cursor-pointer text-stone-800 appearance-none"
            >
              <optgroup label="Sample Legal Contracts">
                {SAMPLE_DOCUMENTS.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.title}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Custom Document">
                <option value="custom">✏️ Paste or Upload Custom Document...</option>
              </optgroup>
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs">
              ▼
            </div>
          </div>

          {/* Quick Instant Clause Simplifier Button */}
          <button
            onClick={onOpenClauseSimplifier}
            className="hidden md:flex items-center gap-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-100/80 text-amber-900 border border-amber-300/80 rounded-lg text-xs font-medium cursor-pointer transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>Simplify Any Clause</span>
          </button>

          {/* Download PDF Button */}
          {hasAnalysis && onDownloadPdf && (
            <button
              onClick={onDownloadPdf}
              className="flex items-center gap-1.5 px-3 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-medium cursor-pointer shadow-xs transition-colors"
              title="Download analysis and risk summary as PDF"
            >
              <Download className="w-3.5 h-3.5 text-amber-300" />
              <span>Export PDF Report</span>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-stone-100 flex items-center justify-between overflow-x-auto">
        <nav className="flex items-center space-x-1 sm:space-x-2 py-1.5 min-w-max">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'overview'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Overview & Deadlines</span>
          </button>

          <button
            onClick={() => setActiveTab('risks')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'risks'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
            <span>Risk Audit & Traps</span>
          </button>

          <button
            onClick={() => setActiveTab('clauses')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'clauses'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-500" />
            <span>Clause Breakdown</span>
          </button>

          <button
            onClick={() => setActiveTab('compare')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'compare'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
            }`}
          >
            <GitCompare className="w-3.5 h-3.5 text-blue-500" />
            <span>Compare Contracts</span>
          </button>

          <button
            onClick={() => setActiveTab('qa')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'qa'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-emerald-500" />
            <span>Grounded Q&A</span>
          </button>

          <button
            onClick={() => setActiveTab('prep')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'prep'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-purple-500" />
            <span>Attorney Consultation Prep</span>
          </button>
        </nav>

        {/* Reanalyze trigger */}
        <div className="shrink-0 pl-2">
          <button
            onClick={onReanalyze}
            disabled={isAnalyzing}
            className="text-[11px] text-stone-500 hover:text-stone-900 font-medium px-2 py-1 rounded hover:bg-stone-100 cursor-pointer transition-colors flex items-center gap-1"
          >
            {isAnalyzing ? (
              <>
                <div className="w-2.5 h-2.5 border-2 border-stone-400 border-t-stone-900 rounded-full animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <span>Re-analyze</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
