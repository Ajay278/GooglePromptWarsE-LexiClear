import jsPDF from 'jspdf';
import { DocumentAnalysisResult } from '../types/legal';

export function exportLegalAnalysisToPDF(
  analysis: DocumentAnalysisResult,
  documentTitle: string,
  rawDocumentText?: string
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'letter',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin - 20) {
      doc.addPage();
      y = margin;
      drawPageHeader();
    }
  };

  const drawPageHeader = () => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(140, 140, 140);
    doc.text('LEXICLEAR LEGAL NAVIGATOR | CONFIDENTIAL LEGAL RECORD', margin, margin - 15);
    doc.text(`Page ${doc.getNumberOfPages()}`, pageWidth - margin - 35, margin - 15);
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.5);
    doc.line(margin, margin - 8, pageWidth - margin, margin - 8);
  };

  // --- Title Header Banner ---
  doc.setFillColor(28, 25, 23); // Dark stone
  doc.rect(margin, y, contentWidth, 68, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text('LEGAL DOCUMENT ANALYSIS & RISK AUDIT', margin + 16, y + 26);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(245, 158, 11); // Amber
  doc.text(documentTitle.toUpperCase().slice(0, 70), margin + 16, y + 42);

  doc.setFontSize(8);
  doc.setTextColor(200, 200, 200);
  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  doc.text(`Generated on ${dateStr} • Governing Law: ${analysis.governingLaw || 'Unspecified'} • Type: ${analysis.documentType || 'Contract'}`, margin + 16, y + 56);

  y += 82;

  // --- Disclaimer Box ---
  doc.setFillColor(254, 243, 199); // Amber-100
  doc.setDrawColor(245, 158, 11);
  doc.setLineWidth(0.75);
  doc.rect(margin, y, contentWidth, 34, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(146, 64, 14); // Amber-800
  doc.text('LEGAL INFORMATION & ASSISTANCE NOTICE:', margin + 10, y + 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(120, 53, 15);
  doc.text(
    'This report is generated for informational and navigation purposes only. It does not constitute formal legal representation, an attorney-client relationship, or binding advice. Always consult a licensed attorney prior to signing.',
    margin + 10,
    y + 25
  );

  y += 46;

  // --- Overall Risk & Key Score Section ---
  checkPageBreak(55);
  doc.setFillColor(250, 250, 249);
  doc.setDrawColor(220, 220, 220);
  doc.rect(margin, y, contentWidth, 50, 'FD');

  // Risk Score Badge
  const isHighRisk = analysis.overallRiskScore >= 60;
  doc.setFillColor(isHighRisk ? 225 : 34, isHighRisk ? 29 : 197, isHighRisk ? 72 : 94);
  doc.rect(margin + 12, y + 10, 80, 30, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text(`${analysis.overallRiskScore}/100`, margin + 24, y + 28);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(28, 25, 23);
  doc.text(`Overall Risk Rating: ${analysis.overallRiskLabel}`, margin + 104, y + 22);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(
    `Evaluated across ${analysis.criticalRisks.length} key risk factors, one-sided liabilities, and notice window traps.`,
    margin + 104,
    y + 35
  );

  y += 62;

  // --- Executive Plain-English Summary ---
  checkPageBreak(80);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(28, 25, 23);
  doc.text('1. EXECUTIVE SUMMARY (PLAIN ENGLISH)', margin, y);
  y += 6;
  doc.setDrawColor(28, 25, 23);
  doc.setLineWidth(1);
  doc.line(margin, y, margin + 260, y);
  y += 14;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(40, 40, 40);

  analysis.executiveSummary.forEach((bullet, idx) => {
    const textLines = doc.splitTextToSize(`${idx + 1}.  ${bullet}`, contentWidth - 10);
    const blockHeight = textLines.length * 12 + 4;
    checkPageBreak(blockHeight);
    doc.text(textLines, margin + 5, y);
    y += blockHeight;
  });

  y += 12;

  // --- Parties & Power Balance ---
  if (analysis.parties && analysis.parties.length > 0) {
    checkPageBreak(60);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(28, 25, 23);
    doc.text('2. CONTRACTING PARTIES & LEVERAGE ASSESSMENT', margin, y);
    y += 6;
    doc.line(margin, y, margin + 300, y);
    y += 14;

    analysis.parties.forEach((party) => {
      const pText = `${party.name} (${party.role}): ${party.leverageSummary}`;
      const lines = doc.splitTextToSize(pText, contentWidth - 16);
      const h = lines.length * 11 + 10;
      checkPageBreak(h);

      doc.setFillColor(245, 245, 244);
      doc.setDrawColor(230, 230, 230);
      doc.rect(margin, y, contentWidth, h - 2, 'FD');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(50, 50, 50);
      doc.text(lines, margin + 8, y + 12);
      y += h + 4;
    });

    y += 10;
  }

  // --- Key Deadlines & Notice Windows ---
  if (analysis.keyDeadlines && analysis.keyDeadlines.length > 0) {
    checkPageBreak(80);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(28, 25, 23);
    doc.text('3. KEY DEADLINES, NOTICE WINDOWS & FORFEITURE RISKS', margin, y);
    y += 6;
    doc.line(margin, y, margin + 330, y);
    y += 14;

    analysis.keyDeadlines.forEach((dl) => {
      const needed = 54;
      checkPageBreak(needed);

      doc.setFillColor(254, 242, 242); // Soft rose/amber
      doc.setDrawColor(254, 202, 202);
      doc.rect(margin, y, contentWidth, 48, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(153, 27, 27);
      doc.text(dl.title, margin + 8, y + 13);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(180, 83, 9);
      doc.text(`Timeline: ${dl.dueOrPeriod}  |  Responsible: ${dl.responsibleParty}`, margin + 8, y + 25);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(80, 80, 80);
      doc.text(`Consequence: ${dl.consequenceOfBreach.slice(0, 110)}`, margin + 8, y + 36);

      doc.setFont('helvetica', 'italic');
      doc.setTextColor(120, 120, 120);
      doc.text(`Citation: "${dl.citation.slice(0, 115)}"`, margin + 8, y + 45);

      y += 54;
    });

    y += 10;
  }

  // --- Critical Legal Risks & Redline Proposals ---
  checkPageBreak(80);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(28, 25, 23);
  doc.text('4. IDENTIFIED HIGH-RISK CLAUSES & COUNTER-PROPOSALS', margin, y);
  y += 6;
  doc.line(margin, y, margin + 330, y);
  y += 14;

  analysis.criticalRisks.forEach((risk, rIdx) => {
    const quoteLines = doc.splitTextToSize(`Exact Contract Quote: "${risk.exactDocumentQuote}"`, contentWidth - 24);
    const expLines = doc.splitTextToSize(`Plain Meaning & Risk: ${risk.plainEnglishExplanation} ${risk.whyItMatters}`, contentWidth - 24);
    const redlineLines = doc.splitTextToSize(`Recommended Counter-Redline: "${risk.suggestedActionOrRedline}"`, contentWidth - 24);

    const totalHeight = 32 + (quoteLines.length + expLines.length + redlineLines.length) * 10 + 16;
    checkPageBreak(totalHeight);

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(220, 220, 220);
    doc.rect(margin, y, contentWidth, totalHeight - 4, 'FD');

    // Severity badge bar
    doc.setFillColor(risk.severity === 'critical' ? 225 : 217, risk.severity === 'critical' ? 29 : 119, risk.severity === 'critical' ? 72 : 6);
    doc.rect(margin, y, 4, totalHeight - 4, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(28, 25, 23);
    doc.text(`${rIdx + 1}. [${risk.severity.toUpperCase()}] ${risk.title}`, margin + 12, y + 14);

    let innerY = y + 26;

    // Quote
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(70, 70, 70);
    doc.text(quoteLines, margin + 12, innerY);
    innerY += quoteLines.length * 10 + 4;

    // Explanation
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(30, 30, 30);
    doc.text(expLines, margin + 12, innerY);
    innerY += expLines.length * 10 + 4;

    // Redline box
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(5, 122, 85); // Emerald-700
    doc.text(redlineLines, margin + 12, innerY);

    y += totalHeight + 6;
  });

  y += 10;

  // --- Questions Prepared for Attorney Consultation ---
  if (analysis.consultationQuestions && analysis.consultationQuestions.length > 0) {
    checkPageBreak(80);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(28, 25, 23);
    doc.text('5. PREPARED QUESTIONS FOR ATTORNEY CONSULTATION', margin, y);
    y += 6;
    doc.line(margin, y, margin + 330, y);
    y += 14;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(
      'Take these specific, clause-grounded questions into your legal consultation to eliminate ambiguity and minimize hourly attorney billing fees:',
      margin,
      y
    );
    y += 14;

    analysis.consultationQuestions.forEach((q, qIdx) => {
      const qLines = doc.splitTextToSize(`[Q${qIdx + 1}]  "${q}"`, contentWidth - 16);
      const h = qLines.length * 11 + 10;
      checkPageBreak(h);

      doc.setFillColor(254, 243, 199); // Soft amber
      doc.setDrawColor(245, 158, 11);
      doc.rect(margin, y, contentWidth, h - 2, 'FD');

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(120, 53, 15);
      doc.text(qLines, margin + 8, y + 12);

      y += h + 4;
    });

    y += 10;
  }

  // --- Actionable Checklist Prior to Signing ---
  if (analysis.actionableChecklist && analysis.actionableChecklist.length > 0) {
    checkPageBreak(80);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(28, 25, 23);
    doc.text('6. ACTIONABLE NEGOTIATION & EXECUTION CHECKLIST', margin, y);
    y += 6;
    doc.line(margin, y, margin + 330, y);
    y += 14;

    analysis.actionableChecklist.forEach((chk) => {
      const cLines = doc.splitTextToSize(`[ ] [${chk.category}] ${chk.step} — ${chk.details}`, contentWidth - 10);
      const h = cLines.length * 11 + 4;
      checkPageBreak(h);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(40, 40, 40);
      doc.text(cLines, margin + 5, y);
      y += h;
    });
  }

  // Add page numbers and headers across all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(150, 150, 150);
    doc.text(`LexiClear Legal Navigator • Record Export: ${documentTitle.slice(0, 40)}`, margin, pageHeight - 20);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin - 50, pageHeight - 20);
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.5);
    doc.line(margin, pageHeight - 28, pageWidth - margin, pageHeight - 28);
  }

  // Download filename
  const cleanTitle = documentTitle
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .slice(0, 40)
    .toLowerCase();
  doc.save(`LexiClear_Legal_Report_${cleanTitle}.pdf`);
}

export function exportConsultationBriefToPDF(
  brief: import('../types/legal').ConsultationBrief,
  documentTitle: string
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'letter',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin - 20) {
      doc.addPage();
      y = margin;
      drawPageHeader();
    }
  };

  const drawPageHeader = () => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(140, 140, 140);
    doc.text('ATTORNEY CONSULTATION BRIEFING | LEXICLEAR', margin, margin - 15);
    doc.text(`Page ${doc.getNumberOfPages()}`, pageWidth - margin - 35, margin - 15);
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.5);
    doc.line(margin, margin - 8, pageWidth - margin, margin - 8);
  };

  // Header Banner
  doc.setFillColor(28, 25, 23);
  doc.rect(margin, y, contentWidth, 64, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(255, 255, 255);
  doc.text('ATTORNEY CONSULTATION BRIEFING PACKET', margin + 16, y + 24);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(245, 158, 11);
  doc.text(documentTitle.toUpperCase().slice(0, 75), margin + 16, y + 40);

  doc.setFontSize(8);
  doc.setTextColor(200, 200, 200);
  doc.text(`Client Role: ${brief.clientRole} • Prepared for Legal Consultation • ${new Date().toLocaleDateString()}`, margin + 16, y + 54);

  y += 76;

  // Notice Banner
  doc.setFillColor(254, 243, 199);
  doc.setDrawColor(245, 158, 11);
  doc.setLineWidth(0.75);
  doc.rect(margin, y, contentWidth, 28, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(146, 64, 14);
  doc.text('CLIENT RECORD NOTICE:', margin + 8, y + 11);
  doc.setFont('helvetica', 'normal');
  doc.text('Prepared using LexiClear to streamline attorney review, highlight exact contract clauses, and eliminate billable hour inefficiencies.', margin + 8, y + 21);

  y += 38;

  // 1. Document Scope & Client Position
  checkPageBreak(50);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(28, 25, 23);
  doc.text('1. DOCUMENT SCOPE & CLIENT POSITION', margin, y);
  y += 4;
  doc.line(margin, y, margin + 240, y);
  y += 12;

  const summaryLines = doc.splitTextToSize(`Agreement Purpose: ${brief.documentSummary}`, contentWidth - 16);
  const sH = summaryLines.length * 11 + 12;
  doc.setFillColor(250, 250, 249);
  doc.setDrawColor(220, 220, 220);
  doc.rect(margin, y, contentWidth, sH, 'FD');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(40, 40, 40);
  doc.text(summaryLines, margin + 8, y + 13);
  y += sH + 12;

  // 2. High-Priority Legal Risks
  checkPageBreak(60);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(28, 25, 23);
  doc.text(`2. TOP CONTRACTUAL RISKS FLAGGED FOR COUNSEL (${brief.topLegalRisks.length})`, margin, y);
  y += 4;
  doc.line(margin, y, margin + 300, y);
  y += 12;

  brief.topLegalRisks.forEach((risk, i) => {
    const citLines = doc.splitTextToSize(`Contract Citation: "${risk.citation}"`, contentWidth - 24);
    const boxH = 26 + citLines.length * 10;
    checkPageBreak(boxH);

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(230, 230, 230);
    doc.rect(margin, y, contentWidth, boxH, 'FD');

    // Priority marker
    doc.setFillColor(risk.priority === 'Urgent' ? 225 : 217, risk.priority === 'Urgent' ? 29 : 119, risk.priority === 'Urgent' ? 72 : 6);
    doc.rect(margin, y, 4, boxH, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(28, 25, 23);
    doc.text(`${i + 1}. [${risk.priority.toUpperCase()}] ${risk.risk}`, margin + 12, y + 13);

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(80, 80, 80);
    doc.text(citLines, margin + 12, y + 24);

    y += boxH + 6;
  });

  y += 8;

  // 3. Targeted Questions to Ask Attorney
  checkPageBreak(60);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(28, 25, 23);
  doc.text('3. SPECIFIC QUESTIONS FOR THE ATTORNEY (ORGANIZED BY GOAL)', margin, y);
  y += 4;
  doc.line(margin, y, margin + 330, y);
  y += 12;

  brief.questionsForAttorney.forEach((q, idx) => {
    const qLines = doc.splitTextToSize(`Question ${idx + 1}: "${q.question}"`, contentWidth - 20);
    const ctxLines = doc.splitTextToSize(`Why to Ask: ${q.context}`, contentWidth - 20);
    const goalLines = doc.splitTextToSize(`Target Decision / Strategy: ${q.expectedGoal}`, contentWidth - 20);

    const totalH = 20 + (qLines.length + ctxLines.length + goalLines.length) * 10;
    checkPageBreak(totalH);

    doc.setFillColor(254, 243, 199); // Soft amber
    doc.setDrawColor(245, 158, 11);
    doc.rect(margin, y, contentWidth, totalH, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(120, 53, 15);
    doc.text(qLines, margin + 10, y + 12);

    let curY = y + 12 + qLines.length * 10;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(60, 60, 60);
    doc.text(ctxLines, margin + 10, curY);

    curY += ctxLines.length * 10;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(146, 64, 14);
    doc.text(goalLines, margin + 10, curY);

    y += totalH + 6;
  });

  y += 8;

  // 4. Exhibits & Evidence Checklist
  if (brief.suggestedExhibitsAndEvidence && brief.suggestedExhibitsAndEvidence.length > 0) {
    checkPageBreak(60);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(28, 25, 23);
    doc.text('4. EVIDENCE & EXHIBITS TO ASSEMBLE PRIOR TO CONSULTATION', margin, y);
    y += 4;
    doc.line(margin, y, margin + 330, y);
    y += 12;

    brief.suggestedExhibitsAndEvidence.forEach((docItem) => {
      checkPageBreak(16);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(40, 40, 40);
      doc.text(`[ ]  ${docItem}`, margin + 6, y);
      y += 14;
    });

    y += 8;
  }

  // 5. Defined Terms Glossary
  if (brief.keyTermsDefined && brief.keyTermsDefined.length > 0) {
    checkPageBreak(60);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(28, 25, 23);
    doc.text('5. KEY DEFINED LEGAL TERMS & MEANINGS', margin, y);
    y += 4;
    doc.line(margin, y, margin + 240, y);
    y += 12;

    brief.keyTermsDefined.forEach((term) => {
      const defLines = doc.splitTextToSize(`${term.term}: ${term.definition}`, contentWidth - 12);
      const h = defLines.length * 10 + 4;
      checkPageBreak(h);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(28, 25, 23);
      doc.text(defLines, margin + 6, y);
      y += h;
    });
  }

  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(150, 150, 150);
    doc.text(`LexiClear Legal Consultation Packet • ${documentTitle.slice(0, 35)}`, margin, pageHeight - 20);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin - 50, pageHeight - 20);
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.5);
    doc.line(margin, pageHeight - 28, pageWidth - margin, pageHeight - 28);
  }

  const cleanTitle = documentTitle
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .slice(0, 40)
    .toLowerCase();
  doc.save(`Attorney_Briefing_${cleanTitle}.pdf`);
}

