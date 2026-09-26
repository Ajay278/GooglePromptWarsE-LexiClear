/**
 * Types for LexiClear Legal Navigator
 */

export type RiskSeverity = 'critical' | 'high' | 'medium' | 'low' | 'favorable';

export interface ClauseBreakdown {
  id: string;
  title: string;
  category: 'Financial & Payment' | 'Intellectual Property' | 'Termination & Cancellation' | 'Liability & Indemnity' | 'Confidentiality & Restrictive Covenants' | 'Dispute Resolution & Jurisdiction' | 'Operational & General';
  plainEnglish: string;
  originalExcerpt: string;
  whoBenefits: 'First Party' | 'Second Party' | 'Both / Mutual' | 'Heavily One-Sided';
  riskLevel: RiskSeverity;
  potentialTraps?: string;
  counterProposal?: string;
}

export interface RiskItem {
  id: string;
  title: string;
  severity: RiskSeverity;
  plainEnglishExplanation: string;
  exactDocumentQuote: string;
  clauseLocation?: string;
  whyItMatters: string;
  suggestedActionOrRedline: string;
}

export interface KeyDeadlineOrObligation {
  id: string;
  title: string;
  dueOrPeriod: string;
  responsibleParty: string;
  consequenceOfBreach: string;
  citation: string;
}

export interface DocumentAnalysisResult {
  documentTitle: string;
  documentType: string;
  governingLaw?: string;
  parties: Array<{
    name: string;
    role: string;
    leverageSummary: string;
  }>;
  executiveSummary: string[];
  overallRiskScore: number; // 0-100 where higher is riskier
  overallRiskLabel: 'Low Risk' | 'Moderate Risk' | 'High Risk' | 'Critical Risk - Review Urgently';
  keyDeadlines: KeyDeadlineOrObligation[];
  criticalRisks: RiskItem[];
  clauses: ClauseBreakdown[];
  inconsistenciesOrAmbiguities: Array<{
    issue: string;
    explanation: string;
    recommendation: string;
  }>;
  actionableChecklist: Array<{
    id: string;
    step: string;
    category: 'Must Do' | 'Should Negotiate' | 'Verify Details';
    details: string;
  }>;
  consultationQuestions: string[];
}

export interface DiffDifference {
  id: string;
  category: string;
  issue: string;
  docAQuote: string;
  docBQuote: string;
  impactVerdict: 'More Favorable to Doc A' | 'More Favorable to Doc B' | 'Substantial Risk Added' | 'Neutral Clarification';
  plainExplanation: string;
  recommendedStance: string;
}

export interface ComparisonResult {
  summary: string;
  docAName: string;
  docBName: string;
  overallComparisonVerdict: string;
  winnerOrFavorableTo: string;
  criticalDifferences: DiffDifference[];
  sneakyChangesOrOmissions: Array<{
    type: 'Sneaky Clause Added' | 'Crucial Protection Removed' | 'Modified Threshold / Period';
    description: string;
    riskLevel: RiskSeverity;
  }>;
  suggestedCounterRedlines: string[];
}

export interface GroundedAnswer {
  answer: string;
  canAnswer: boolean; // false if document does not contain the information
  reasonIfCannotAnswer?: string;
  directQuotes: string[];
  relevantClauses: string[];
  potentialRisksNoted?: string[];
  recommendedQuestionsForLawyer?: string[];
  confidenceScore: 'high' | 'medium' | 'insufficient_data';
}

export interface ConsultationBrief {
  clientRole: string;
  documentSummary: string;
  topLegalRisks: Array<{
    risk: string;
    citation: string;
    priority: 'Urgent' | 'Important' | 'Clarification';
  }>;
  questionsForAttorney: Array<{
    question: string;
    context: string;
    expectedGoal: string;
  }>;
  suggestedExhibitsAndEvidence: string[];
  keyTermsDefined: Array<{
    term: string;
    definition: string;
  }>;
}

export interface SampleDocument {
  id: string;
  title: string;
  category: string;
  badge: string;
  summary: string;
  content: string;
  comparisonDoc?: {
    title: string;
    content: string;
    summary: string;
  };
}
