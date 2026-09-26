import { Router } from 'express';
import type { Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { generateWithModelFallback, safeParseJson } from '../services/gemini';
import {
  DOCUMENT_ANALYSIS_SYSTEM_INSTRUCTION,
  buildDocumentAnalysisPrompt,
  QUESTION_ANSWER_SYSTEM_INSTRUCTION,
  buildQuestionAnswerPrompt,
  DOCUMENT_COMPARISON_SYSTEM_INSTRUCTION,
  buildDocumentComparisonPrompt,
  CLAUSE_SIMPLIFICATION_SYSTEM_INSTRUCTION,
  buildClauseSimplificationPrompt,
  CONSULTATION_PREP_SYSTEM_INSTRUCTION,
  buildConsultationPrepPrompt,
} from '../prompts/legalPrompts';

export const legalRouter = Router();

// Validation thresholds to prevent token exhaustion and DoS
export const MAX_DOCUMENT_LENGTH = 150_000; // ~30,000 words
export const MAX_QUESTION_LENGTH = 2_000;
export const MAX_CLAUSE_LENGTH = 25_000;

// IP-based API rate limiting to protect LLM quota from automated abuse
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 60, // Limit each IP to 60 legal AI requests per window
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  message: {
    error: 'Too many requests from this IP address. Please wait a few minutes before trying again.',
  },
});

// Apply rate limiting to all legal AI endpoints
legalRouter.use(apiRateLimiter);

/**
 * POST /api/analyze-document
 * Full document risk audit, score, and clause breakdown
 */
legalRouter.post('/analyze-document', async (req: Request, res: Response) => {
  try {
    const { documentText, userRole } = req.body;

    if (!documentText || typeof documentText !== 'string' || !documentText.trim()) {
      return res.status(400).json({ error: 'documentText is required and must not be empty.' });
    }

    if (documentText.length > MAX_DOCUMENT_LENGTH) {
      return res.status(400).json({
        error: `Document exceeds maximum allowed length of ${MAX_DOCUMENT_LENGTH.toLocaleString()} characters.`,
      });
    }

    const prompt = buildDocumentAnalysisPrompt(documentText, typeof userRole === 'string' ? userRole : 'Neutral');
    const rawText = await generateWithModelFallback({
      contents: prompt,
      systemInstruction: DOCUMENT_ANALYSIS_SYSTEM_INSTRUCTION,
      temperature: 0.1,
      responseMimeType: 'application/json',
    });

    const parsed = safeParseJson(rawText);
    return res.json(parsed);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown internal error';
    console.error('Error in /api/analyze-document:', errorMessage);
    return res.status(500).json({
      error: 'Failed to analyze legal document. Please verify the document text and try again.',
    });
  }
});

/**
 * POST /api/ask-question
 * Strictly grounded Q&A with required citations
 */
legalRouter.post('/ask-question', async (req: Request, res: Response) => {
  try {
    const { documentText, question } = req.body;

    if (!documentText || typeof documentText !== 'string' || !documentText.trim()) {
      return res.status(400).json({ error: 'documentText is required and must not be empty.' });
    }
    if (documentText.length > MAX_DOCUMENT_LENGTH) {
      return res.status(400).json({
        error: `Document exceeds maximum allowed length of ${MAX_DOCUMENT_LENGTH.toLocaleString()} characters.`,
      });
    }

    if (!question || typeof question !== 'string' || !question.trim()) {
      return res.status(400).json({ error: 'question is required and must not be empty.' });
    }
    if (question.length > MAX_QUESTION_LENGTH) {
      return res.status(400).json({
        error: `Question exceeds maximum allowed length of ${MAX_QUESTION_LENGTH.toLocaleString()} characters.`,
      });
    }

    const prompt = buildQuestionAnswerPrompt(documentText, question);
    const rawText = await generateWithModelFallback({
      contents: prompt,
      systemInstruction: QUESTION_ANSWER_SYSTEM_INSTRUCTION,
      temperature: 0.1,
      responseMimeType: 'application/json',
    });

    const parsed = safeParseJson(rawText);
    return res.json(parsed);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown internal error';
    console.error('Error in /api/ask-question:', errorMessage);
    return res.status(500).json({
      error: 'Failed to answer contract question. Please try again.',
    });
  }
});

/**
 * POST /api/compare-documents
 * Redline comparison between two contract versions
 */
legalRouter.post('/compare-documents', async (req: Request, res: Response) => {
  try {
    const { documentA, documentB, roleA, roleB } = req.body;

    if (!documentA || typeof documentA !== 'string' || !documentA.trim()) {
      return res.status(400).json({ error: 'documentA is required and must not be empty.' });
    }
    if (documentA.length > MAX_DOCUMENT_LENGTH) {
      return res.status(400).json({
        error: `Document A exceeds maximum allowed length of ${MAX_DOCUMENT_LENGTH.toLocaleString()} characters.`,
      });
    }

    if (!documentB || typeof documentB !== 'string' || !documentB.trim()) {
      return res.status(400).json({ error: 'documentB is required and must not be empty.' });
    }
    if (documentB.length > MAX_DOCUMENT_LENGTH) {
      return res.status(400).json({
        error: `Document B exceeds maximum allowed length of ${MAX_DOCUMENT_LENGTH.toLocaleString()} characters.`,
      });
    }

    const prompt = buildDocumentComparisonPrompt(
      documentA,
      documentB,
      typeof roleA === 'string' ? roleA : 'Version A',
      typeof roleB === 'string' ? roleB : 'Version B'
    );
    const rawText = await generateWithModelFallback({
      contents: prompt,
      systemInstruction: DOCUMENT_COMPARISON_SYSTEM_INSTRUCTION,
      temperature: 0.1,
      responseMimeType: 'application/json',
    });

    const parsed = safeParseJson(rawText);
    return res.json(parsed);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown internal error';
    console.error('Error in /api/compare-documents:', errorMessage);
    return res.status(500).json({
      error: 'Failed to compare contract versions. Please try again.',
    });
  }
});

/**
 * POST /api/simplify-clause
 * Plain-English translation and trap exposer for individual clauses
 */
legalRouter.post('/simplify-clause', async (req: Request, res: Response) => {
  try {
    const { clauseText, contractType } = req.body;

    if (!clauseText || typeof clauseText !== 'string' || !clauseText.trim()) {
      return res.status(400).json({ error: 'clauseText is required and must not be empty.' });
    }
    if (clauseText.length > MAX_CLAUSE_LENGTH) {
      return res.status(400).json({
        error: `Clause text exceeds maximum allowed length of ${MAX_CLAUSE_LENGTH.toLocaleString()} characters.`,
      });
    }

    const prompt = buildClauseSimplificationPrompt(
      clauseText,
      typeof contractType === 'string' ? contractType : undefined
    );
    const rawText = await generateWithModelFallback({
      contents: prompt,
      systemInstruction: CLAUSE_SIMPLIFICATION_SYSTEM_INSTRUCTION,
      temperature: 0.1,
      responseMimeType: 'application/json',
    });

    const parsed = safeParseJson(rawText);
    return res.json(parsed);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown internal error';
    console.error('Error in /api/simplify-clause:', errorMessage);
    return res.status(500).json({
      error: 'Failed to simplify clause. Please try again.',
    });
  }
});

/**
 * POST /api/generate-consultation-prep
 * Attorney briefing docket generator
 */
legalRouter.post('/generate-consultation-prep', async (req: Request, res: Response) => {
  try {
    const { documentText, userRole } = req.body;

    if (!documentText || typeof documentText !== 'string' || !documentText.trim()) {
      return res.status(400).json({ error: 'documentText is required and must not be empty.' });
    }
    if (documentText.length > MAX_DOCUMENT_LENGTH) {
      return res.status(400).json({
        error: `Document exceeds maximum allowed length of ${MAX_DOCUMENT_LENGTH.toLocaleString()} characters.`,
      });
    }

    const prompt = buildConsultationPrepPrompt(documentText, typeof userRole === 'string' ? userRole : 'Client');
    const rawText = await generateWithModelFallback({
      contents: prompt,
      systemInstruction: CONSULTATION_PREP_SYSTEM_INSTRUCTION,
      temperature: 0.1,
      responseMimeType: 'application/json',
    });

    const parsed = safeParseJson(rawText);
    return res.json(parsed);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown internal error';
    console.error('Error in /api/generate-consultation-prep:', errorMessage);
    return res.status(500).json({
      error: 'Failed to generate consultation brief. Please try again.',
    });
  }
});
