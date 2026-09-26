# LexiClear Legal Navigator

> **Intelligent, Grounded Legal Document Analysis, Contract Comparison, Risk Detection, and Attorney Consultation Prep.**

LexiClear Legal Navigator is a production-grade full-stack web application designed to bridge the gap between non-lawyers and dense legal agreements. It translates legalese into plain English, flags hidden contractual traps with exact verbatim citations, compares contract versions with redline differentials, answers targeted questions under strict anti-hallucination constraints, and equips users with structured briefs for attorney consultations.

---

## Architecture Overview

```
                      +---------------------------------------+
                      |       Client Browser (React 19)       |
                      |   Vite + Tailwind CSS + Lucide Icons  |
                      +-------------------+-------------------+
                                          |  HTTP / JSON
                                          v
                      +---------------------------------------+
                      |      Node.js / Express Server         |
                      |            (server.ts)                |
                      +-------------------+-------------------+
                                          |  Server-Side Only
                                          |  (GEMINI_API_KEY)
                                          v
                      +---------------------------------------+
                      |   Google Gemini Generative AI SDK     |
                      |  gemini-2.5-flash / gemini-3.8-flash  |
                      |     (Deterministic temperature 0.1)   |
                      +---------------------------------------+
```

* **Client**: React 19 SPA powered by Vite, Tailwind CSS v4, Lucide React icons, and `jspdf` for client-side offline PDF brief exports.
* **Server**: Node.js Express backend acting as a secure API gateway that protects secrets, validates input payloads, implements multi-model fallback routines, and enforces strict JSON output schemas.
* **AI Model Engine**: Google Gemini API via the official `@google/genai` TypeScript SDK using deterministic temperature (`0.1`) for maximum factual and contractual precision.

---

## Core Capabilities

1. **Comprehensive Legal Risk Audit (`/api/analyze-document`)**:
   - Calculates a normalized Risk Score (0–100) based on unilateral obligations, uncapped liability, and indemnities.
   - Extracts contracting parties and relative legal leverage.
   - Categorizes clauses into Critical Traps, Moderate Risks, Standard Terms, and Protective Clauses with exact citations.
   - Generates an actionable pre-signing checklist (*Must Do*, *Should Negotiate*, *Verify Details*).

2. **Strict Grounded Q&A (`/api/ask-question`)**:
   - Answers specific questions about contract terms without speculative hallucinations.
   - If the contract does not contain the answer, explicitly states that the document is silent.
   - Provides exact verbatim quotes and section citations for every assertion.

3. **Contract Diff & Comparative Risk Engine (`/api/compare-documents`)**:
   - Compares standard vendor templates against counter-proposals or amendments.
   - Detects subtle clause modifications, dropped protections, and shifting liability caps.
   - Highlights tactical negotiation stances for each party.

4. **Instant Clause Dissector & Trap Detector (`/api/simplify-clause`)**:
   - Translates legalese into plain English.
   - Highlights who benefits (*Customer*, *Vendor*, *Mutual*, or *Heavily One-Sided*).
   - Generates balanced, commercially reasonable counter-proposals.

5. **Attorney Consultation Brief Generator (`/api/generate-consultation-prep`)**:
   - Prepares non-lawyers for consultations to minimize billable hours.
   - Generates 5–7 high-leverage questions to ask counsel.
   - Recommends supporting exhibits and evidence to collect beforehand.
   - Produces a plain-English glossary of terms (*Liquidated Damages*, *Indemnification*, *Consequential Damages*).

6. **Offline PDF Export**:
   - Generates professional legal summary reports and consultation briefs locally using jsPDF.

---

## Prerequisites

- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **Package Manager**: `npm` (v9+) or `yarn` / `bun`
- **Google Gemini API Key**: Obtainable from [Google AI Studio](https://aistudio.google.com/)

---

## Installation & Developer Setup

### 1. Clone the repository
```bash
git clone <repository-url>
cd lexiclear-legal-navigator
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy the `.env.example` file to `.env`:
```bash
cp .env.example .env
```
Edit `.env` and provide your Google Gemini API key:
```env
GEMINI_API_KEY="your-google-gemini-api-key"
PORT=3000
```

> **Security Note**: Never commit `.env` containing your active `GEMINI_API_KEY`. The `.gitignore` is preconfigured to prevent secret leaks.

---

## Running the Application

### Development Mode
Starts the Express server with Vite middleware on port 3000:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Type Checking & Linting
Validates TypeScript syntax and type safety across client and server:
```bash
npm run lint
```

### Automated Unit Testing
Executes the Vitest test suite covering prompt builders, JSON sanitization, and PDF filename cleaners:
```bash
npm test
```

### Production Build
Builds the client application, applies vendor code-splitting (React, Lucide, PDF), and prepares the static bundle:
```bash
npm run build
```

### Running Production Server
Serves the production build via the Node.js Express server:
```bash
npm start
```

---

## Backend API Specification

| Endpoint | Method | Description |
| :--- | :---: | :--- |
| `/api/analyze-document` | `POST` | Performs full contract audit, risk scoring, deadline extraction, and checklist generation. |
| `/api/ask-question` | `POST` | Answers questions under strict document grounding with verbatim citations. |
| `/api/compare-documents` | `POST` | Analyzes differences between Original and Proposed agreement texts. |
| `/api/simplify-clause` | `POST` | Translates a single clause, reveals traps, and provides balanced counter-language. |
| `/api/generate-consultation-prep` | `POST` | Generates a structured agenda and checklist for meeting legal counsel. |

All endpoints accept JSON payloads (`Content-Type: application/json`) and return structured JSON schemas enforced by Gemini structured output mode (`responseMimeType: 'application/json'`).

---

## Legal & Compliance Disclaimer

*LexiClear Legal Navigator is an AI-powered informational tool designed for contract comprehension, educational review, and attorney consultation preparation. It does not constitute legal advice and does not establish an attorney-client relationship. Users should always consult qualified legal counsel for critical binding agreements.*

---

## License

MIT License. See `LICENSE` for details.
