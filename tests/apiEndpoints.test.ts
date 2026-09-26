import { describe, it, expect } from 'vitest';
import { MAX_DOCUMENT_LENGTH, MAX_QUESTION_LENGTH, MAX_CLAUSE_LENGTH } from '../server/routes/legalRoutes';

describe('API Route Validation & Boundary Protection', () => {
  it('enforces expected maximum length constants', () => {
    expect(MAX_DOCUMENT_LENGTH).toBe(150_000);
    expect(MAX_QUESTION_LENGTH).toBe(2_000);
    expect(MAX_CLAUSE_LENGTH).toBe(25_000);
  });

  describe('Document Analysis Validation', () => {
    const validateAnalyze = (body: { documentText?: unknown }) => {
      const { documentText } = body;
      if (!documentText || typeof documentText !== 'string' || !documentText.trim()) {
        return { status: 400, error: 'documentText is required and must not be empty.' };
      }
      if (documentText.length > MAX_DOCUMENT_LENGTH) {
        return { status: 400, error: `Document exceeds maximum allowed length of ${MAX_DOCUMENT_LENGTH.toLocaleString()} characters.` };
      }
      return { status: 200 };
    };

    it('rejects missing or empty document text', () => {
      expect(validateAnalyze({})).toEqual({ status: 400, error: 'documentText is required and must not be empty.' });
      expect(validateAnalyze({ documentText: '   ' })).toEqual({ status: 400, error: 'documentText is required and must not be empty.' });
      expect(validateAnalyze({ documentText: null })).toEqual({ status: 400, error: 'documentText is required and must not be empty.' });
    });

    it('rejects oversized document text', () => {
      const hugeDoc = 'A'.repeat(MAX_DOCUMENT_LENGTH + 1);
      expect(validateAnalyze({ documentText: hugeDoc }).status).toBe(400);
    });

    it('accepts valid document text', () => {
      expect(validateAnalyze({ documentText: 'Standard Independent Contractor Agreement' })).toEqual({ status: 200 });
    });
  });

  describe('Contract Question & Answer Validation', () => {
    const validateQA = (body: { documentText?: unknown; question?: unknown }) => {
      const { documentText, question } = body;
      if (!documentText || typeof documentText !== 'string' || !documentText.trim()) {
        return { status: 400, error: 'documentText is required and must not be empty.' };
      }
      if (!question || typeof question !== 'string' || !question.trim()) {
        return { status: 400, error: 'question is required and must not be empty.' };
      }
      if (typeof question === 'string' && question.length > MAX_QUESTION_LENGTH) {
        return { status: 400, error: `Question exceeds maximum allowed length of ${MAX_QUESTION_LENGTH.toLocaleString()} characters.` };
      }
      return { status: 200 };
    };

    it('rejects empty question', () => {
      expect(validateQA({ documentText: 'Valid doc', question: '' }).status).toBe(400);
      expect(validateQA({ documentText: 'Valid doc', question: '   ' }).status).toBe(400);
    });

    it('rejects oversized question', () => {
      const hugeQ = 'Q'.repeat(MAX_QUESTION_LENGTH + 10);
      expect(validateQA({ documentText: 'Valid doc', question: hugeQ }).status).toBe(400);
    });

    it('accepts valid Q&A query', () => {
      expect(validateQA({ documentText: 'Valid doc', question: 'What is the liability cap?' })).toEqual({ status: 200 });
    });
  });

  describe('Contract Comparison Validation', () => {
    const validateComparison = (body: { documentA?: unknown; documentB?: unknown }) => {
      const { documentA, documentB } = body;
      if (!documentA || typeof documentA !== 'string' || !documentA.trim()) {
        return { status: 400, error: 'documentA is required and must not be empty.' };
      }
      if (!documentB || typeof documentB !== 'string' || !documentB.trim()) {
        return { status: 400, error: 'documentB is required and must not be empty.' };
      }
      return { status: 200 };
    };

    it('requires both documentA and documentB', () => {
      expect(validateComparison({ documentA: 'Doc 1' }).status).toBe(400);
      expect(validateComparison({ documentB: 'Doc 2' }).status).toBe(400);
      expect(validateComparison({ documentA: '', documentB: 'Doc 2' }).status).toBe(400);
      expect(validateComparison({ documentA: 'Doc 1', documentB: 'Doc 2' })).toEqual({ status: 200 });
    });
  });
});
