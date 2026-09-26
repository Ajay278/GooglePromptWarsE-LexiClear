import React, { useState } from 'react';
import { GroundedAnswer } from '../types/legal';
import {
  Send,
  HelpCircle,
  Quote,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  BookOpen,
} from 'lucide-react';

interface GroundedQAProps {
  documentText: string;
  documentTitle: string;
  suggestedQuestions?: string[];
  onOpenClauseSimplifier: (quote: string) => void;
}

export const GroundedQA: React.FC<GroundedQAProps> = ({
  documentText,
  documentTitle,
  suggestedQuestions = [],
  onOpenClauseSimplifier,
}) => {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<
    Array<{
      question: string;
      response: GroundedAnswer;
    }>
  >([]);
  const [error, setError] = useState<string | null>(null);

  // Pre-prepared test questions: some that the document CAN answer, and test questions that the document CANNOT answer to prove anti-hallucination.
  const samplePrompts = [
    {
      text: 'What happens if I try to terminate this agreement early?',
      expected: 'In-Document Clause',
    },
    {
      text: 'Can the company use or ingest my data to train artificial intelligence models?',
      expected: 'In-Document Clause',
    },
    {
      text: 'What is the maximum financial liability cap if a major breach occurs?',
      expected: 'In-Document Clause',
    },
    {
      text: 'What is the policy for force majeure due to pandemics or weather events?',
      expected: 'Not in Document (Test Upfront Honesty)',
    },
    {
      text: 'Does this agreement provide health insurance coverage or pension benefits?',
      expected: 'Not in Document (Test Upfront Honesty)',
    },
  ];

  const handleAsk = async (queryToAsk?: string) => {
    const q = queryToAsk || question;
    if (!q.trim() || !documentText.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ask-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentText,
          documentTitle,
          question: q,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to query document');
      }

      const data: GroundedAnswer = await response.json();
      setHistory((prev) => [{ question: q, response: data }, ...prev]);
      if (!queryToAsk) setQuestion('');
    } catch (err: any) {
      setError(err?.message || 'Error processing inquiry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Strict Grounding Assurance Box */}
      <div className="bg-stone-900 text-white p-5 rounded-xl shadow-sm">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <h3 className="font-semibold text-white text-sm">
              Strict Document-Grounded Q&A (Anti-Hallucination Policy)
            </h3>
            <p className="text-stone-300 mt-1 leading-relaxed">
              LexiClear answers solely based on the text of <strong className="text-white">"{documentTitle}"</strong>.
              If the document is silent on an issue or does not contain sufficient facts, the engine states so <strong className="text-amber-300">upfront</strong> instead of inventing assumptions or false legal rules.
            </p>
          </div>
        </div>
      </div>

      {/* Query Input Card */}
      <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
            Ask Any Question Regarding This Agreement:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !loading && handleAsk()}
              placeholder="e.g., 'What is the required notice period for non-renewal?' or 'Is there an arbitration clause?'"
              className="flex-1 text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 text-stone-900"
            />
            <button
              onClick={() => handleAsk()}
              disabled={loading || !question.trim()}
              className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors shrink-0"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Grounding...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Search & Answer</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Suggested Quick Questions */}
        <div>
          <span className="text-[11px] font-medium text-stone-500 block mb-1.5">
            Test inquiries (includes test questions absent from the document to verify upfront honesty):
          </span>
          <div className="flex flex-wrap gap-1.5">
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQuestion(p.text);
                  handleAsk(p.text);
                }}
                className={`text-[11px] px-2.5 py-1 rounded-md border text-left cursor-pointer transition-colors flex items-center gap-1.5 ${
                  p.expected.includes('Not in Document')
                    ? 'bg-stone-50 hover:bg-rose-50 text-stone-700 hover:text-rose-900 border-stone-200 hover:border-rose-300'
                    : 'bg-stone-50 hover:bg-amber-50 text-stone-700 hover:text-amber-900 border-stone-200 hover:border-amber-300'
                }`}
              >
                <span>{p.text}</span>
                <span
                  className={`text-[9px] px-1 rounded uppercase tracking-wider ${
                    p.expected.includes('Not in Document')
                      ? 'bg-rose-100 text-rose-800 font-bold'
                      : 'bg-stone-200 text-stone-600'
                  }`}
                >
                  {p.expected.includes('Not in Document') ? 'Missing Test' : 'Grounded'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Answers Stream / History */}
      <div className="space-y-4">
        {history.length === 0 ? (
          <div className="bg-white p-8 rounded-xl border border-stone-200 text-center text-xs text-stone-500">
            <BookOpen className="w-8 h-8 text-stone-300 mx-auto mb-2" />
            <p className="font-medium text-stone-700">No questions asked yet.</p>
            <p className="mt-1">
              Select one of the sample inquiries above or type a custom question to verify rights, remedies, or test the anti-hallucination engine.
            </p>
          </div>
        ) : (
          history.map((item, idx) => {
            const { canAnswer, answer, directQuotes, relevantClauses, potentialRisksNoted, recommendedQuestionsForLawyer } = item.response;

            return (
              <div
                key={idx}
                className={`bg-white rounded-xl border p-5 shadow-xs text-xs space-y-4 transition-all ${
                  canAnswer ? 'border-stone-200' : 'border-rose-200 bg-rose-50/20'
                }`}
              >
                {/* Question and Grounding Status */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-stone-900 text-white flex items-center justify-center font-bold text-[10px]">
                      Q
                    </span>
                    <h4 className="font-semibold text-stone-900 text-sm">{item.question}</h4>
                  </div>

                  {canAnswer ? (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Document Grounded
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-rose-800 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                      <AlertCircle className="w-3 h-3 text-rose-600" />
                      Document Silent (Not in Text)
                    </span>
                  )}
                </div>

                {/* Answer Body */}
                <div className={`p-4 rounded-lg leading-relaxed text-sm ${canAnswer ? 'bg-amber-50/30 border border-amber-200/50 text-stone-800' : 'bg-rose-50 border border-rose-200 text-rose-950 font-medium'}`}>
                  {answer}
                </div>

                {/* Direct Verbatim Quotes */}
                {directQuotes && directQuotes.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 block">
                      Verbatim Document Citations ({directQuotes.length}):
                    </span>
                    <div className="space-y-1.5">
                      {directQuotes.map((quote, qIdx) => (
                        <div key={qIdx} className="bg-stone-50 p-3 rounded-lg border border-stone-200 flex items-start justify-between gap-3">
                          <div className="flex items-start gap-2">
                            <Quote className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                            <p className="font-legal-serif text-stone-800 italic leading-relaxed text-[13px]">
                              "{quote}"
                            </p>
                          </div>
                          <button
                            onClick={() => onOpenClauseSimplifier(quote)}
                            className="text-amber-800 hover:text-amber-950 shrink-0 font-medium flex items-center gap-1 p-1 hover:bg-stone-200/50 rounded cursor-pointer transition-colors text-[11px]"
                            title="Dissect clause in simplifier"
                          >
                            <Sparkles className="w-3 h-3 text-amber-600" />
                            <span>Dissect</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Relevant Clauses and Legal Follow-ups */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-100 text-[11px]">
                  {relevantClauses && relevantClauses.length > 0 && (
                    <div className="flex items-center gap-1.5 text-stone-600">
                      <span className="font-semibold">Referenced Sections:</span>
                      {relevantClauses.map((c, i) => (
                        <span key={i} className="px-1.5 py-0.5 bg-stone-100 text-stone-800 rounded font-mono">
                          {c}
                        </span>
                      ))}
                    </div>
                  )}

                  {recommendedQuestionsForLawyer && recommendedQuestionsForLawyer.length > 0 && (
                    <div className="text-amber-900 font-medium">
                      <span>Follow-up question for attorney: </span>
                      <span className="italic font-normal text-stone-700">"{recommendedQuestionsForLawyer[0]}"</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
