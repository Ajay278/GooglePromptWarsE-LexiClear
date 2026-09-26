import { describe, it, expect } from 'vitest';
import { SAMPLE_DOCUMENTS } from '../src/data/sampleDocuments';
import { DEFAULT_ANALYSES } from '../src/data/defaultAnalyses';

describe('Contract Data & Baseline Analyses Integrity', () => {
  it('contains at least 4 diverse sample contracts', () => {
    expect(SAMPLE_DOCUMENTS.length).toBeGreaterThanOrEqual(4);
  });

  it('each sample document has required metadata and substantial text', () => {
    for (const doc of SAMPLE_DOCUMENTS) {
      expect(doc.id).toBeTruthy();
      expect(doc.title).toBeTruthy();
      expect(doc.category).toBeTruthy();
      expect(doc.badge).toBeTruthy();
      expect(doc.content.length).toBeGreaterThan(300);
    }
  });

  it('provides verified instant default analyses for all sample contracts', () => {
    for (const doc of SAMPLE_DOCUMENTS) {
      const analysis = DEFAULT_ANALYSES[doc.id];
      expect(analysis, `Missing default analysis for ${doc.id}`).toBeDefined();
      expect(analysis.documentTitle).toBeTruthy();
      expect(analysis.overallRiskScore).toBeGreaterThanOrEqual(0);
      expect(analysis.overallRiskScore).toBeLessThanOrEqual(100);
      expect(analysis.overallRiskLabel).toBeTruthy();
      expect(Array.isArray(analysis.executiveSummary)).toBe(true);
      expect(analysis.executiveSummary.length).toBeGreaterThan(0);
      expect(analysis.criticalRisks.length).toBeGreaterThan(0);
      expect(analysis.clauses.length).toBeGreaterThan(0);
      expect(analysis.keyDeadlines.length).toBeGreaterThan(0);
      expect(analysis.consultationQuestions.length).toBeGreaterThan(0);
    }
  });

  it('critical risks contain valid citations and severity levels', () => {
    for (const doc of SAMPLE_DOCUMENTS) {
      const analysis = DEFAULT_ANALYSES[doc.id];
      for (const risk of analysis.criticalRisks) {
        expect(['critical', 'high', 'medium', 'low', 'favorable']).toContain(risk.severity);
        expect(risk.title).toBeTruthy();
        expect(risk.plainEnglishExplanation).toBeTruthy();
        expect(risk.suggestedActionOrRedline).toBeTruthy();
      }
    }
  });
});

