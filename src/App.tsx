import React, { useState, useEffect, useCallback } from 'react';
import { SAMPLE_DOCUMENTS } from './data/sampleDocuments';
import { DocumentAnalysisResult, SampleDocument } from './types/legal';
import { DisclaimerBanner } from './components/DisclaimerBanner';
import { Navbar, ActiveTab } from './components/Navbar';
import { DocumentViewer } from './components/DocumentViewer';
import { AnalysisOverview } from './components/AnalysisOverview';
import { RiskAuditPanel } from './components/RiskAuditPanel';
import { ClauseBreakdownPanel } from './components/ClauseBreakdownPanel';
import { DocumentComparator } from './components/DocumentComparator';
import { GroundedQA } from './components/GroundedQA';
import { ConsultationPrep } from './components/ConsultationPrep';
import { ClauseSimplifierModal } from './components/ClauseSimplifierModal';
import { CustomDocumentModal } from './components/CustomDocumentModal';
import { Sparkles, AlertCircle, FileText, CheckCircle2, SplitSquareVertical, Download } from 'lucide-react';
import { exportLegalAnalysisToPDF } from './utils/pdfExport';

export default function App() {
  const [selectedDocId, setSelectedDocId] = useState<string>(SAMPLE_DOCUMENTS[0].id);
  const [currentDoc, setCurrentDoc] = useState<SampleDocument>(SAMPLE_DOCUMENTS[0]);
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');

  // Analysis State
  const [analysisResult, setAnalysisResult] = useState<DocumentAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Modals & Popovers
  const [isSimplifierOpen, setIsSimplifierOpen] = useState(false);
  const [simplifierInitialClause, setSimplifierInitialClause] = useState('');
  const [isCustomDocModalOpen, setIsCustomDocModalOpen] = useState(false);

  // Layout View Mode (Split View vs Expanded Workspace)
  const [showDocPane, setShowDocPane] = useState(true);

  // In-memory analysis cache to prevent redundant API calls
  const [analysisCache, setAnalysisCache] = useState<Record<string, DocumentAnalysisResult>>({});

  // Trigger analysis
  const runAnalysis = useCallback(async (docText: string, docTitle: string, docId?: string) => {
    const key = docId || docTitle;
    if (analysisCache[key]) {
      setAnalysisResult(analysisCache[key]);
      setAnalysisError(null);
      setIsAnalyzing(false);
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const response = await fetch('/api/analyze-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentText: docText,
          documentTitle: docTitle,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.details || 'Failed to complete document analysis. The model may have encountered high demand.');
      }

      const data: DocumentAnalysisResult = await response.json();
      setAnalysisResult(data);
      setAnalysisCache((prev) => ({ ...prev, [key]: data }));
    } catch (err: any) {
      console.error('Analysis failed:', err);
      setAnalysisError(err?.message || 'Error communicating with legal analysis engine. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  }, [analysisCache]);

  // Run on mount or doc change
  useEffect(() => {
    runAnalysis(currentDoc.content, currentDoc.title, currentDoc.id);
  }, [currentDoc.id, currentDoc.title, currentDoc.content, runAnalysis]);

  const handleSelectSampleDoc = (id: string) => {
    const doc = SAMPLE_DOCUMENTS.find((d) => d.id === id);
    if (doc) {
      setSelectedDocId(id);
      setCurrentDoc(doc);
    }
  };

  const handleCustomDocSubmit = (title: string, content: string) => {
    const custom: SampleDocument = {
      id: 'custom-' + Date.now(),
      title,
      category: 'User Uploaded',
      badge: 'Custom Document',
      summary: 'Custom contract provided by user for review and risk audit.',
      content,
    };
    setSelectedDocId(custom.id);
    setCurrentDoc(custom);
  };

  const handleOpenClauseSimplifierWithText = (text: string) => {
    setSimplifierInitialClause(text);
    setIsSimplifierOpen(true);
  };

  const handleAskQuestionFromText = (query: string) => {
    setActiveTab('qa');
  };

  const handleDownloadAnalysisPdf = async () => {
    if (!analysisResult) return;
    try {
      await exportLegalAnalysisToPDF(analysisResult, currentDoc.title, currentDoc.content);
    } catch (e) {
      console.error('Failed to export legal analysis to PDF:', e);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col font-sans text-stone-900">
      {/* 1. Legal Disclaimer Banner */}
      <DisclaimerBanner />

      {/* 2. Top Header & Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedDocId={selectedDocId}
        onSelectSampleDoc={handleSelectSampleDoc}
        onOpenCustomDocModal={() => setIsCustomDocModalOpen(true)}
        onOpenClauseSimplifier={() => {
          setSimplifierInitialClause('');
          setIsSimplifierOpen(true);
        }}
        isAnalyzing={isAnalyzing}
        onReanalyze={() => runAnalysis(currentDoc.content, currentDoc.title)}
        onDownloadPdf={handleDownloadAnalysisPdf}
        hasAnalysis={!!analysisResult}
      />

      {/* Subheader / Document Context Bar */}
      <div className="bg-stone-50 border-b border-stone-200/80 px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-900">{currentDoc.title}</span>
            <span className="text-stone-300">·</span>
            <span className="text-stone-500">{currentDoc.badge}</span>
          </div>

          <div className="flex items-center gap-3">
            {analysisResult && (
              <button
                onClick={handleDownloadAnalysisPdf}
                className="text-stone-700 hover:text-stone-950 flex items-center gap-1.5 cursor-pointer font-medium bg-white hover:bg-stone-100 border border-stone-300 px-2.5 py-1 rounded shadow-2xs"
                title="Download complete legal analysis and risk audit as PDF"
              >
                <Download className="w-3.5 h-3.5 text-amber-700" />
                <span>Export PDF</span>
              </button>
            )}
            <button
              onClick={() => setShowDocPane(!showDocPane)}
              className="text-stone-600 hover:text-stone-900 flex items-center gap-1.5 cursor-pointer font-medium"
              title="Toggle Document Text pane visibility"
            >
              <SplitSquareVertical className="w-3.5 h-3.5 text-stone-500" />
              <span>{showDocPane ? 'Hide Contract Source' : 'Show Contract Source'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Loading State Overlay */}
        {isAnalyzing && (
          <div className="mb-6 p-5 bg-white rounded-xl border border-amber-200 shadow-sm flex items-center gap-4 animate-pulse">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center text-amber-800 shrink-0">
              <Sparkles className="w-5 h-5 animate-spin" />
            </div>
            <div>
              <h3 className="font-semibold text-stone-900 text-sm">
                Analyzing Legal Document with Accuracy-First Priority...
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Extracting verbatim citations, calculating multi-factor liability risk score, identifying notice deadlines, and detecting one-sided traps.
              </p>
            </div>
          </div>
        )}

        {analysisError && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start justify-between gap-3 shadow-xs">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-rose-900">Analysis Notice:</p>
                <p className="mt-0.5 text-rose-700">{analysisError}</p>
              </div>
            </div>
            <button
              onClick={() => runAnalysis(currentDoc.content, currentDoc.title)}
              className="px-3 py-1.5 bg-rose-700 hover:bg-rose-800 text-white rounded-md font-medium text-xs flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Retry Analysis</span>
            </button>
          </div>
        )}

        {/* Dynamic Split Layout */}
        <div className={`grid gap-6 ${showDocPane ? 'grid-cols-1 lg:grid-cols-12' : 'grid-cols-1'}`}>
          {/* Left Pane: Interactive Document Viewer (5 cols if split) */}
          {showDocPane && (
            <div className="lg:col-span-5 h-[calc(100vh-210px)] sticky top-28 hidden lg:block">
              <DocumentViewer
                title={currentDoc.title}
                category={currentDoc.category}
                content={currentDoc.content}
                onSelectClauseForSimplifier={handleOpenClauseSimplifierWithText}
                onAskQuestionAboutText={handleAskQuestionFromText}
              />
            </div>
          )}

          {/* Right Pane: Intelligence & Navigation Modules (7 cols or 12 cols) */}
          <div className={showDocPane ? 'lg:col-span-7 space-y-6' : 'w-full space-y-6'}>
            {/* Tab 1: Executive Overview & Deadlines */}
            {activeTab === 'overview' && (
              analysisResult ? (
                <AnalysisOverview
                  analysis={analysisResult}
                  onNavigateToRiskAudit={() => setActiveTab('risks')}
                  onNavigateToPrep={() => setActiveTab('prep')}
                  onDownloadPdf={handleDownloadAnalysisPdf}
                />
              ) : (
                <div className="bg-white p-8 rounded-xl border border-stone-200 text-center text-xs text-stone-500">
                  Document analysis in progress or awaiting text input...
                </div>
              )
            )}

            {/* Tab 2: Risk Audit & Traps */}
            {activeTab === 'risks' && (
              analysisResult ? (
                <RiskAuditPanel
                  risks={analysisResult.criticalRisks}
                  onOpenClauseSimplifier={handleOpenClauseSimplifierWithText}
                />
              ) : (
                <div className="bg-white p-8 rounded-xl border border-stone-200 text-center text-xs text-stone-500">
                  Risk audit awaiting document analysis completion...
                </div>
              )
            )}

            {/* Tab 3: Clause Breakdown */}
            {activeTab === 'clauses' && (
              analysisResult ? (
                <ClauseBreakdownPanel
                  clauses={analysisResult.clauses}
                  onOpenClauseSimplifier={handleOpenClauseSimplifierWithText}
                />
              ) : (
                <div className="bg-white p-8 rounded-xl border border-stone-200 text-center text-xs text-stone-500">
                  Clause translations loading...
                </div>
              )
            )}

            {/* Tab 4: Compare Contracts (Diff) */}
            {activeTab === 'compare' && (
              <DocumentComparator
                initialDocA={{
                  title: currentDoc.title,
                  text: currentDoc.content,
                }}
                initialDocB={
                  currentDoc.comparisonDoc
                    ? {
                        title: currentDoc.comparisonDoc.title,
                        text: currentDoc.comparisonDoc.content,
                      }
                    : undefined
                }
                onOpenClauseSimplifier={handleOpenClauseSimplifierWithText}
              />
            )}

            {/* Tab 5: Grounded Q&A */}
            {activeTab === 'qa' && (
              <GroundedQA
                documentText={currentDoc.content}
                documentTitle={currentDoc.title}
                suggestedQuestions={analysisResult?.consultationQuestions}
                onOpenClauseSimplifier={handleOpenClauseSimplifierWithText}
              />
            )}

            {/* Tab 6: Attorney Consultation Prep Sheet */}
            {activeTab === 'prep' && (
              <ConsultationPrep
                documentText={currentDoc.content}
                documentTitle={currentDoc.title}
                identifiedRisks={analysisResult?.criticalRisks}
              />
            )}
          </div>
        </div>
      </main>

      {/* Global Modals */}
      <ClauseSimplifierModal
        isOpen={isSimplifierOpen}
        onClose={() => setIsSimplifierOpen(false)}
        initialClause={simplifierInitialClause}
      />

      <CustomDocumentModal
        isOpen={isCustomDocModalOpen}
        onClose={() => setIsCustomDocModalOpen(false)}
        onSubmit={handleCustomDocSubmit}
      />

      {/* Quiet Footer */}
      <footer className="mt-auto border-t border-stone-200 bg-white py-4 px-4 sm:px-6 lg:px-8 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-800">LexiClear</span>
            <span>·</span>
            <span>Grounding-first legal document assistant</span>
          </div>
          <div className="text-[11px] text-stone-400">
            For informational purposes only · Always consult an attorney for formal legal advice
          </div>
        </div>
      </footer>
    </div>
  );
}
