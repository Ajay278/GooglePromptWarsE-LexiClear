import { describe, it, expect } from 'vitest';
import { cleanPdfFilename } from '../src/utils/pdfExport';

describe('PDF Export Sanitizer Utilities', () => {
  it('sanitizes titles with spaces and special characters', () => {
    const raw = 'Acme Corp / Master Services Agreement (v2.1) - FINAL!';
    const sanitized = cleanPdfFilename(raw);
    expect(sanitized).toBe('acme_corp___master_services_agreement__v');
    expect(sanitized.length).toBeLessThanOrEqual(40);
    expect(sanitized).not.toContain('/');
    expect(sanitized).not.toContain('!');
  });

  it('provides safe fallback for empty or whitespace-only titles', () => {
    expect(cleanPdfFilename('')).toBe('document');
    expect(cleanPdfFilename('   ')).toBe('___');
  });

  it('handles clean alphanumeric strings with underscores', () => {
    const title = 'nda_agreement_2026';
    expect(cleanPdfFilename(title)).toBe('nda_agreement_2026');
  });
});
