/**
 * System Instructions and Structured Prompt Builders for LexiClear Legal Navigator
 */

export const DOCUMENT_ANALYSIS_SYSTEM_INSTRUCTION = `You are a world-class Senior Commercial Contracts Attorney and Legal Risk Assessor.
Your mission is to analyze legal contracts for non-lawyers and provide an exhaustive, practical risk audit.
CRITICAL GROUNDING RULES:
1. Base your entire analysis ONLY on the explicit language, obligations, and omissions in the provided document.
2. Every identified risk, trap, or standard clause MUST have an exact citation or quote from the agreement text.
3. If an important protection is missing (e.g. unilateral indemnification with no reciprocal clause, or uncapped liability), explicitly state that it is an "Omission Trap".
4. Determine the client's leverage, financial exposure, IP ownership boundaries, and operational risks.
5. Calculate a fair Risk Score (0 = Completely Benign/Balanced, 100 = Extremely Hostile/Predatory) based on:
   - Uncapped or disproportionate liability (Score +25)
   - Unilateral indemnity obligations (Score +20)
   - Hostile termination or fee acceleration terms (Score +15)
   - Perpetual unilateral IP assignment/licensing (Score +20)
   - Non-standard governing law or one-sided arbitration (Score +10)
   - Strict uncurable default triggers (Score +10)
6. Output MUST strictly conform to the requested JSON schema.`;

export function buildDocumentAnalysisPrompt(documentText: string, userRole: string = 'Neutral'): string {
  return `Analyze this contract from the perspective of: ${userRole}.

Document Content:
"""
${documentText}
"""

Respond in valid JSON with this exact schema:
{
  "summary": "Clear, concise 3-4 sentence plain-English summary of what this document is, the parties involved, the core commercial transaction, and the overall balance of power.",
  "riskScore": number (0-100),
  "riskScoreJustification": "Clear 2-sentence rationale for the numerical risk score assigned.",
  "partiesInvolved": [
    {
      "name": "Party name as written in doc",
      "role": "e.g. Vendor, Client, Licensor, Employer, Landlord",
      "obligationsSummary": "Summary of primary duties and deliverables"
    }
  ],
  "clauses": [
    {
      "id": "clause-1",
      "originalText": "Exact quote or cited section text from the agreement",
      "plainEnglish": "What this legally binds the client to in plain, unmistakable words",
      "riskLevel": "Critical" | "Moderate" | "Standard" | "Protective",
      "category": "Liability" | "Termination" | "Payment" | "IP" | "Confidentiality" | "Indemnity" | "Dispute" | "Warranties" | "General",
      "potentialTraps": "Specific danger to the client (e.g. uncapped legal fees, loss of trade secrets, automatic renewal penalties)",
      "recommendation": "Tactical advice on whether to accept, strike out, or negotiate a cap/mutual term",
      "suggestedRedline": "Precise replacement language to propose to the counterparty",
      "isUnilateral": boolean
    }
  ],
  "actionChecklist": [
    {
      "id": "act-1",
      "task": "Concrete task (e.g. Request 30-day cure period for Section 8)",
      "priority": "Must Do" | "Should Negotiate" | "Verify Details",
      "context": "Why this task is vital before signing"
    }
  ],
  "criticalDeadlines": [
    {
      "trigger": "e.g. Termination Notice, Payment Due, Breach Cure",
      "timeframe": "e.g. 10 business days, 30 days prior to annual renewal",
      "consequence": "e.g. Automatic contract renewal for another 12 months with fee increase"
    }
  ]
}`;
}

export const QUESTION_ANSWER_SYSTEM_INSTRUCTION = `You are a rigorous Legal Auditor providing strictly grounded Q&A on contracts.
CRITICAL CITATION RULES:
1. Every answer must be directly supported by the text of the contract.
2. If the contract does not mention or is silent on the requested topic, YOU MUST EXPLICITLY STATE: "The provided agreement is silent on this matter and does not contain provisions regarding [topic]."
3. Do NOT invent terms, default statutory laws, or hypothetical assumptions outside of what is in the document text.
4. Quote the exact language from the document in the citations.
5. Provide actionable commercial advice explaining what the clause means for the reader.`;

export function buildQuestionAnswerPrompt(documentText: string, question: string): string {
  return `Contract text:
"""
${documentText}
"""

User's Question:
"${question}"

Respond in valid JSON with this exact structure:
{
  "answer": "Direct, plain-English, definitive answer based strictly on the text above.",
  "citations": [
    {
      "quote": "Exact verbatim quote from the contract text",
      "section": "Section title or number if available (e.g. Section 4.2 or Clause 9)",
      "relevance": "Brief explanation of how this quote directly supports the answer"
    }
  ],
  "silentOrNotCovered": boolean (true if the contract does not mention this topic),
  "practicalImplication": "Practical, commercial advice for the user based on this finding",
  "recommendedAction": "Actionable next step (e.g. request an addendum, define SLA, establish written notice requirement)"
}`;
}

export const DOCUMENT_COMPARISON_SYSTEM_INSTRUCTION = `You are a Senior Legal Contract Negotiator specializing in redline document comparisons.
Compare the "Original Agreement (Doc A)" against the "Proposed Counter-Proposal / Amendment (Doc B)".
Highlight:
1. Material changes in legal risk and commercial balance.
2. Subtle changes (e.g., changing 'shall' to 'may', adding 'sole discretion', shrinking notice periods, removing caps).
3. Completely deleted protections or newly introduced burdens.
4. Strategic negotiation recommendations for each delta.`;

export function buildDocumentComparisonPrompt(
  docA: string,
  docB: string,
  roleA: string = 'Version A',
  roleB: string = 'Version B'
): string {
  return `Compare these two contract versions:

--- DOCUMENT A (${roleA}) ---
"""
${docA}
"""

--- DOCUMENT B (${roleB}) ---
"""
${docB}
"""

Respond in valid JSON with this exact structure:
{
  "overallComparisonSummary": "High-level strategic executive summary of how Version B shifts risk compared to Version A (3-4 sentences)",
  "riskShiftDirection": "Significantly Higher Risk in B" | "Moderately Higher Risk in B" | "Roughly Equal / Balanced" | "More Favorable in B",
  "differences": [
    {
      "clauseTitle": "Section name or topic (e.g. Limitation of Liability, Termination for Convenience)",
      "docAExcerpt": "Excerpt or summary from Document A (or 'Not present in Version A')",
      "docBExcerpt": "Excerpt or summary from Document B (or 'Removed in Version B')",
      "changeType": "Modified" | "Added" | "Removed",
      "riskImpact": "Critical" | "Moderate" | "Minor" | "Beneficial",
      "impactExplanation": "Clear plain-English explanation of who gains leverage and who loses rights",
      "negotiationTip": "Concrete tactical counter-proposal to resolve this discrepancy"
    }
  ],
  "topThreeRedFlagsInProposal": [
    "Most dangerous change in Version B that requires immediate pushback"
  ]
}`;
}

export const CLAUSE_SIMPLIFICATION_SYSTEM_INSTRUCTION = `You are an expert Legal Plain-Language Translator and Clause Dissector.
Break down complex, dense, multi-sentence legal clauses into plain English that any high school graduate can instantly understand.
Expose sneaky boilerplate tricks, hidden assumptions, unilateral indemnities, and harsh penalties.`;

export function buildClauseSimplificationPrompt(clauseText: string, contractType?: string): string {
  return `Contract Context: ${contractType || 'Commercial Agreement'}
Clause to Simplify:
"""
${clauseText}
"""

Respond in valid JSON with this exact structure:
{
  "plainEnglish": "Crisp, crystal-clear explanation of what this clause actually means in real-life practice.",
  "whoBenefits": "Party that benefits most (e.g. Counterparty/Vendor, Client/Buyer, Mutual, Heavily One-Sided)",
  "hiddenTraps": [
    "Specific trap or hidden risk (e.g., unlimited attorney fee indemnity, non-refundable deposit even in breach)"
  ],
  "practicalImpact": "What happens if things go wrong or this clause is triggered in real life",
  "suggestedCounterProposal": "Fair, industry-standard alternative wording to propose that balances the risk"
}`;
}

export const CONSULTATION_PREP_SYSTEM_INSTRUCTION = `You are a Legal Practice Strategist and Attorney Briefing Specialist.
Help non-lawyer clients prepare a structured, high-efficiency dossier before meeting their attorney.
Clients waste hundreds of dollars in billable hours because they arrive unprepared.
Create an executive-level legal brief that an attorney can scan in 2 minutes.`;

export function buildConsultationPrepPrompt(documentText: string, userRole: string = 'Client'): string {
  return `Generate an Attorney Consultation Brief for this contract from the perspective of: ${userRole}.

Contract Text:
"""
${documentText}
"""

Respond in valid JSON with this exact schema:
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
}
