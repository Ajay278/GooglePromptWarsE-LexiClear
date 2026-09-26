import { describe, it, expect } from 'vitest';
import {
  buildDocumentAnalysisPrompt,
  buildQuestionAnswerPrompt,
  buildDocumentComparisonPrompt,
  buildClauseSimplificationPrompt,
  buildConsultationPrepPrompt,
  DOCUMENT_ANALYSIS_SYSTEM_INSTRUCTION,
  QUESTION_ANSWER_SYSTEM_INSTRUCTION,
} from '../server/prompts/legalPrompts';

describe('Legal Prompt Builders', () => {
  it('builds document analysis prompt with client role and content', () => {
    const prompt = buildDocumentAnalysisPrompt('Section 1: Confidentiality...', 'Client/Buyer');
    expect(prompt).toContain('perspective of: Client/Buyer');
    expect(prompt).toContain('Section 1: Confidentiality...');
    expect(prompt).toContain('"riskScore": number');
    expect(prompt).toContain('"actionChecklist"');
  });

  it('builds question answering prompt enforcing strict citation schema', () => {
    const prompt = buildQuestionAnswerPrompt('Clause 4: Termination on 10 days notice', 'Can I terminate early?');
    expect(prompt).toContain('Can I terminate early?');
    expect(prompt).toContain('Clause 4: Termination on 10 days notice');
    expect(prompt).toContain('"silentOrNotCovered": boolean');
    expect(prompt).toContain('"citations"');
  });

  it('builds document comparison prompt with Version A and Version B', () => {
    const prompt = buildDocumentComparisonPrompt('Doc A text', 'Doc B text', 'Vendor Draft', 'Redline Proposal');
    expect(prompt).toContain('DOCUMENT A (Vendor Draft)');
    expect(prompt).toContain('DOCUMENT B (Redline Proposal)');
    expect(prompt).toContain('Doc A text');
    expect(prompt).toContain('Doc B text');
    expect(prompt).toContain('"differences"');
  });

  it('builds clause simplification prompt with optional contract context', () => {
    const prompt = buildClauseSimplificationPrompt('Indemnitee shall be held harmless...', 'SaaS Agreement');
    expect(prompt).toContain('Contract Context: SaaS Agreement');
    expect(prompt).toContain('Indemnitee shall be held harmless...');
    expect(prompt).toContain('"whoBenefits"');
    expect(prompt).toContain('"suggestedCounterProposal"');
  });

  it('builds attorney consultation prep prompt', () => {
    const prompt = buildConsultationPrepPrompt('MSA sample text', 'Freelancer');
    expect(prompt).toContain('perspective of: Freelancer');
    expect(prompt).toContain('MSA sample text');
    expect(prompt).toContain('"questionsForAttorney"');
    expect(prompt).toContain('"suggestedExhibitsAndEvidence"');
  });

  it('validates critical anti-hallucination instructions in system prompts', () => {
    expect(DOCUMENT_ANALYSIS_SYSTEM_INSTRUCTION).toContain('Base your entire analysis ONLY on the explicit language');
    expect(DOCUMENT_ANALYSIS_SYSTEM_INSTRUCTION).toContain('Every identified risk, trap, or standard clause MUST have an exact citation');
    expect(QUESTION_ANSWER_SYSTEM_INSTRUCTION).toContain('The provided agreement is silent on this matter');
  });
});
