import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const portArgIndex = process.argv.indexOf('--port');
const portArg = portArgIndex !== -1 ? parseInt(process.argv[portArgIndex + 1]) : null;
const PORT = portArg || 3000;

app.use(express.json({ limit: '15mb' }));

// Initialize GoogleGenAI client on server
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const CANDIDATE_MODELS = [
  'gemini-2.5-flash',
  'gemini-flash-latest',
  'gemini-3.1-flash-lite',
  'gemini-3.8-flash',
];

// Helper to sanitize and safely parse JSON response from Gemini
function safeParseJson<T = any>(text: string): T {
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\n?/, '').replace(/\n?```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\n?/, '').replace(/\n?```$/, '');
  }
  cleaned = cleaned.trim();

  try {
    return JSON.parse(cleaned);
  } catch (initialErr) {
    // Attempt to extract JSON between first '{' or '[' and last '}' or ']'
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      const extracted = cleaned.substring(firstBrace, lastBrace + 1);
      try {
        return JSON.parse(extracted);
      } catch (e) {
        // Continue to next recovery attempt
      }
    }
    throw initialErr;
  }
}

/**
 * Robust caller that tries supported models and retries on 503 / high demand spikes
 */
async function generateWithModelFallback(params: {
  contents: string;
  systemInstruction?: string;
  temperature?: number;
  responseMimeType?: string;
}): Promise<string> {
  let lastError: any = null;

  for (const model of CANDIDATE_MODELS) {
    // Try up to 2 attempts per candidate model
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: params.contents,
          config: {
            systemInstruction: params.systemInstruction,
            responseMimeType: params.responseMimeType || 'application/json',
            temperature: params.temperature ?? 0.1,
          },
        });

        if (response && response.text) {
          return response.text;
        }
      } catch (err: any) {
        lastError = err;
        const msg = String(err?.message || err);
        const isTemporary = msg.includes('503') || msg.includes('high demand') || msg.includes('UNAVAILABLE') || msg.includes('429');
        
        console.warn(`[Gemini API] Model ${model} (attempt ${attempt}) notice: ${msg.slice(0, 120)}`);
        
        if (isTemporary && attempt === 1) {
          // brief pause before retry
          await new Promise((r) => setTimeout(r, 600));
          continue;
        }
        // Move to next model
        break;
      }
    }
  }

  throw lastError || new Error('All candidate Gemini models failed to respond.');
}

/**
 * Endpoint 1: Comprehensive Document Analysis
 * Simplifies complex documents, categorizes clauses, detects risks and deadlines with strict citations.
 */
app.post('/api/analyze-document', async (req: Request, res: Response) => {
  try {
    const { documentText, documentTitle = 'Legal Document' } = req.body;

    if (!documentText || typeof documentText !== 'string' || documentText.trim().length === 0) {
      return res.status(400).json({ error: 'Document text is required for analysis.' });
    }

    const systemInstruction = `You are a senior legal document analyst with deep expertise in contract law, risk assessment, and plain-language simplification.
Your duty is to produce an accurate, objective, and deeply grounded legal analysis of the provided document text.
STRICT ACCURACY RULES:
1. Ground every claim directly in the document text. When identifying a risk or clause, provide the EXACT VERBATIM excerpt from the document.
2. Do not invent terms, obligations, or provisions not present in the document.
3. Plain-English translations must be clear, accessible to non-lawyers, without losing substantive meaning.
4. Calculate a realistic overallRiskScore from 0 (completely standard/safe) to 100 (extreme danger / predatory terms). Look for: uncapped liability, unilateral rights, restrictive non-competes, aggressive auto-renewals, unilateral arbitration/jury waivers, or IP seizure.
5. Provide actionable next steps and specific questions for an attorney consultation.`;

    const prompt = `Analyze the following legal document titled "${documentTitle}":

--- DOCUMENT TEXT START ---
${documentText.slice(0, 45000)}
--- DOCUMENT TEXT END ---

Return your analysis in valid JSON matching this exact structure:
{
  "documentTitle": "${documentTitle}",
  "documentType": "e.g., Commercial SaaS Agreement / Lease Agreement / Independent Contractor Agreement / NDA",
  "governingLaw": "e.g., State of Delaware, or 'Not specified'",
  "parties": [
    {
      "name": "Party Name or Designation",
      "role": "e.g., Service Provider / Customer / Tenant / Landlord",
      "leverageSummary": "Brief plain-English summary of this party's relative leverage or contractual advantage"
    }
  ],
  "executiveSummary": [
    "3 to 5 clear, jargon-free bullet points summarizing the core purpose, commercial terms, and essence of the document"
  ],
  "overallRiskScore": 75,
  "overallRiskLabel": "Low Risk" | "Moderate Risk" | "High Risk" | "Critical Risk - Review Urgently",
  "keyDeadlines": [
    {
      "id": "deadline-1",
      "title": "e.g., Notice of Non-Renewal Window",
      "dueOrPeriod": "e.g., 120 days prior to term expiration",
      "responsibleParty": "e.g., Client",
      "consequenceOfBreach": "e.g., Automatic 24-month renewal with up to 25% price increase",
      "citation": "Direct excerpt quote from section"
    }
  ],
  "criticalRisks": [
    {
      "id": "risk-1",
      "title": "Short title of the risk (e.g., Uncapped Customer Liability vs $100 Vendor Cap)",
      "severity": "critical" | "high" | "medium" | "low",
      "plainEnglishExplanation": "Clear, accessible explanation of why this is dangerous for the disadvantaged party",
      "exactDocumentQuote": "Verbatim quote from the contract text",
      "clauseLocation": "Section 6(a) or relevant header",
      "whyItMatters": "Practical impact in the real world (e.g., potential bankruptcy risk or loss of IP)",
      "suggestedActionOrRedline": "Specific recommended counter-language or negotiation stance"
    }
  ],
  "clauses": [
    {
      "id": "clause-1",
      "title": "Clause Title",
      "category": "Financial & Payment" | "Intellectual Property" | "Termination & Cancellation" | "Liability & Indemnity" | "Confidentiality & Restrictive Covenants" | "Dispute Resolution & Jurisdiction" | "Operational & General",
      "plainEnglish": "Plain English summary of this clause",
      "originalExcerpt": "Verbatim excerpt from document",
      "whoBenefits": "First Party" | "Second Party" | "Both / Mutual" | "Heavily One-Sided",
      "riskLevel": "critical" | "high" | "medium" | "low" | "favorable",
      "potentialTraps": "Hidden consequences or pitfalls",
      "counterProposal": "Balanced counter-clause suggestion"
    }
  ],
  "inconsistenciesOrAmbiguities": [
    {
      "issue": "Specific contradiction or ambiguous phrase",
      "explanation": "Why this ambiguity creates legal vulnerability",
      "recommendation": "How to resolve the language"
    }
  ],
  "actionableChecklist": [
    {
      "id": "check-1",
      "step": "Action item",
      "category": "Must Do" | "Should Negotiate" | "Verify Details",
      "details": "Explanation of what to inspect or demand"
    }
  ],
  "consultationQuestions": [
    "Specific questions with references to exact clauses to ask a qualified legal professional"
  ]
}`;

    const rawText = await generateWithModelFallback({
      contents: prompt,
      systemInstruction,
      temperature: 0.1,
      responseMimeType: 'application/json',
    });

    const parsed = safeParseJson(rawText);
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error analyzing document:', error);
    return res.status(500).json({
      error: 'Failed to analyze legal document.',
      details: error?.message || 'Internal error',
    });
  }
});

/**
 * Endpoint 2: Document Comparison (Diff & Risk Shift)
 * Compares two agreements (e.g. Original vs Redline, Vendor A vs Vendor B).
 */
app.post('/api/compare-documents', async (req: Request, res: Response) => {
  try {
    const { docA, docB, comparisonFocus } = req.body;

    if (!docA?.text || !docB?.text) {
      return res.status(400).json({ error: 'Both Document A and Document B text are required for comparison.' });
    }

    const systemInstruction = `You are a contract negotiation specialist and legal diff expert.
Compare the two provided legal documents with surgical accuracy.
ACCURACY MANDATE:
1. Point out exact textual divergences and substantiate each with verbatim excerpts from Document A and Document B.
2. Identify sneaky additions, omitted safeguards, or shifted liability thresholds.
3. State plainly which party benefits from each difference and give practical negotiation advice.`;

    const prompt = `Compare these two legal documents:

DOCUMENT A ("${docA.title || 'Original Document'}"):
${docA.text.slice(0, 25000)}

DOCUMENT B ("${docB.title || 'Comparison Document'}"):
${docB.text.slice(0, 25000)}

${comparisonFocus ? `User Focus: ${comparisonFocus}` : ''}

Respond in valid JSON with this exact structure:
{
  "summary": "High-level plain-English narrative comparing the philosophy and legal posture of both documents (3-4 sentences)",
  "docAName": "${docA.title || 'Document A'}",
  "docBName": "${docB.title || 'Document B'}",
  "overallComparisonVerdict": "Definitive comparison verdict regarding balance of power, liability exposure, and operational flexibility",
  "winnerOrFavorableTo": "Which document is safer or more favorable to which party",
  "criticalDifferences": [
    {
      "id": "diff-1",
      "category": "Liability & Indemnity" | "Payment & Pricing" | "Term & Termination" | "Intellectual Property & AI" | "Dispute Resolution" | "Warranties & SLA",
      "issue": "Specific provision compared",
      "docAQuote": "Exact quote from Document A",
      "docBQuote": "Exact quote from Document B (or 'Clause omitted in Doc B')",
      "impactVerdict": "More Favorable to Doc A" | "More Favorable to Doc B" | "Substantial Risk Added" | "Neutral Clarification",
      "plainExplanation": "Clear explanation of how the legal rights change between Doc A and Doc B",
      "recommendedStance": "How to handle this point in negotiations"
    }
  ],
  "sneakyChangesOrOmissions": [
    {
      "type": "Sneaky Clause Added" | "Crucial Protection Removed" | "Modified Threshold / Period",
      "description": "Specific sneaky change that could easily be missed on a casual read",
      "riskLevel": "critical" | "high" | "medium"
    }
  ],
  "suggestedCounterRedlines": [
    "Recommended compromise terms or redline proposals to bridge the gap"
  ]
}`;

    const rawText = await generateWithModelFallback({
      contents: prompt,
      systemInstruction,
      temperature: 0.1,
      responseMimeType: 'application/json',
    });

    const parsed = safeParseJson(rawText);
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error comparing documents:', error);
    return res.status(500).json({
      error: 'Failed to compare documents.',
      details: error?.message || 'Internal error',
    });
  }
});

/**
 * Endpoint 3: Strict Document Grounded Q&A
 * Answers user inquiries with strict anti-hallucination rules.
 * "IF app can not answer should say upfront dont blabber or give false info"
 */
app.post('/api/ask-question', async (req: Request, res: Response) => {
  try {
    const { documentText, documentTitle = 'Document', question } = req.body;

    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return res.status(400).json({ error: 'Question is required.' });
    }

    if (!documentText || typeof documentText !== 'string' || documentText.trim().length === 0) {
      return res.status(400).json({ error: 'Document text is required to answer questions.' });
    }

    const systemInstruction = `You are LexiClear's Grounded Legal Information Engine.
Your highest guiding priority is STRICT ACCURACY OVER COMPLETENESS. Never fabricate facts or make assumptions.

CRITICAL ANTI-HALLUCINATION INSTRUCTIONS:
1. CANNOT ANSWER RULE: If the question cannot be answered solely based on the text provided, OR if the document is silent on the issue, you MUST set canAnswer = false and state UPFRONT in the first sentence:
"This document does not contain information regarding [topic]. Based solely on the provided text, this question cannot be answered."
DO NOT speculate. DO NOT say "typically contracts do X" without first explicitly confirming the document does not say it.
2. VERBATIM CITATIONS: If the document DOES answer the question, you MUST cite the exact verbatim sentences/clauses from the text in "directQuotes".
3. NO LEGAL ADVICE DISCLAIMER: Frame responses as factual document navigation and legal information, not formal attorney legal advice.
4. ATTORNEY QUESTIONS: Suggest 1-2 targeted follow-up questions the user can ask an attorney if ambiguity exists.`;

    const prompt = `DOCUMENT TITLE: "${documentTitle}"

DOCUMENT TEXT:
---
${documentText.slice(0, 45000)}
---

USER QUESTION: "${question}"

Analyze whether the document contains the facts to answer this question.
Return JSON with this schema:
{
  "canAnswer": true | false,
  "answer": "If canAnswer is false: 'This document does not contain information regarding [topic]. Based solely on the provided text, this question cannot be answered.' followed by brief note on what would normally be expected. If canAnswer is true: Direct, crystal-clear explanation grounded entirely in the text.",
  "reasonIfCannotAnswer": "Explain what specific information is missing from the document text",
  "directQuotes": ["Exact verbatim sentence 1 from document", "Exact verbatim sentence 2"],
  "relevantClauses": ["Section 3", "Section 6(b)"],
  "potentialRisksNoted": ["Any hidden risk or one-sided condition directly relevant to this question"],
  "recommendedQuestionsForLawyer": ["Specific question to ask an attorney about this issue"],
  "confidenceScore": "high" | "medium" | "insufficient_data"
}`;

    const rawText = await generateWithModelFallback({
      contents: prompt,
      systemInstruction,
      temperature: 0.1,
      responseMimeType: 'application/json',
    });

    const parsed = safeParseJson(rawText);
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error answering question:', error);
    return res.status(500).json({
      error: 'Failed to process question.',
      details: error?.message || 'Internal error',
    });
  }
});

/**
 * Endpoint 4: Instant Clause Simplifier & Trap Detector
 * Takes an individual clause or snippet and breaks down:
 * Plain English, Who Benefits, Hidden Traps, and Balanced Counter-Proposal.
 */
app.post('/api/simplify-clause', async (req: Request, res: Response) => {
  try {
    const { clauseText, context } = req.body;

    if (!clauseText || typeof clauseText !== 'string' || clauseText.trim().length === 0) {
      return res.status(400).json({ error: 'Clause text is required.' });
    }

    const systemInstruction = `You are an expert legal redline editor and contract plain-English translator.
Dissect the provided clause with precision.`;

    const prompt = `Analyze and simplify this contract clause:

CLAUSE:
"${clauseText}"

${context ? `Context: ${context}` : ''}

Respond in valid JSON:
{
  "title": "Descriptive title for the clause (e.g. Unilateral Annual Price Escalator)",
  "plainEnglish": "What this clause actually means in simple, everyday language that any non-lawyer can instantly grasp",
  "whoBenefits": "First Party" | "Second Party" | "Both / Mutual" | "Heavily One-Sided",
  "riskLevel": "critical" | "high" | "medium" | "low" | "favorable",
  "hiddenTraps": "Real-world worst-case scenario or sneaky loophole created by this language",
  "recommendedCounterClause": "A balanced, professional legal counter-proposal that protects the disadvantaged party while remaining commercially reasonable"
}`;

    const rawText = await generateWithModelFallback({
      contents: prompt,
      systemInstruction,
      temperature: 0.1,
      responseMimeType: 'application/json',
    });

    const parsed = safeParseJson(rawText);
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error simplifying clause:', error);
    return res.status(500).json({
      error: 'Failed to simplify clause.',
      details: error?.message || 'Internal error',
    });
  }
});

/**
 * Endpoint 5: Attorney Consultation Prep Generator
 * Generates an executive 1-page structured brief to take into a legal consultation
 * to save hundreds in hourly attorney fees.
 */
app.post('/api/generate-consultation-prep', async (req: Request, res: Response) => {
  try {
    const { documentText, documentTitle = 'Document', userRole = 'Client / Signer', primaryConcerns } = req.body;

    if (!documentText) {
      return res.status(400).json({ error: 'Document text is required.' });
    }

    const systemInstruction = `You are a legal consultation strategist.
Prepare a high-value, organized "Attorney Consultation Brief" that a client can print or email to their attorney.
Structure it to save billable hours by highlighting the exact citations, core legal questions, and necessary evidence.`;

    const prompt = `DOCUMENT: "${documentTitle}"
CLIENT ROLE: ${userRole}
PRIMARY CONCERNS: ${primaryConcerns || 'General review and risk minimization'}

TEXT:
${documentText.slice(0, 35000)}

Respond in valid JSON:
{
  "clientRole": "${userRole}",
  "documentSummary": "Crisp 2-sentence summary of the agreement and its scope",
  "topLegalRisks": [
    {
      "risk": "Description of high-priority legal risk",
      "citation": "Exact section or quote from document",
      "priority": "Urgent" | "Important" | "Clarification"
    }
  ],
  "questionsForAttorney": [
    {
      "question": "Laser-focused legal question referencing specific clause",
      "context": "Why this question matters to the client's bottom line or liability",
      "expectedGoal": "What decision or redline outcome the lawyer should guide"
    }
  ],
  "suggestedExhibitsAndEvidence": [
    "List of documents, emails, SOWs, or financial records the client should gather before meeting the lawyer"
  ],
  "keyTermsDefined": [
    {
      "term": "Complex legal term used in contract (e.g. Indemnification, Liquidated Damages, Consequential Damages)",
      "definition": "Plain-English explanation of what this means in this contract's context"
    }
  ]
}`;

    const rawText = await generateWithModelFallback({
      contents: prompt,
      systemInstruction,
      temperature: 0.1,
      responseMimeType: 'application/json',
    });

    const parsed = safeParseJson(rawText);
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error generating consultation brief:', error);
    return res.status(500).json({
      error: 'Failed to generate consultation brief.',
      details: error?.message || 'Internal error',
    });
  }
});

// Full-stack Vite middleware integration
const isProduction = process.env.NODE_ENV === 'production' || !process.argv.some(a => a.includes('tsx') || a.includes('--dev'));
const hasDist = fs.existsSync(path.resolve(__dirname, 'dist', 'index.html'));

if (hasDist && (isProduction || process.env.NODE_ENV === 'production')) {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
} else {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`LexiClear Legal Navigator server running on port ${PORT}`);
});
