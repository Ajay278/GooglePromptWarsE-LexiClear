import { describe, it, expect } from 'vitest';
import { safeParseJson } from '../server/services/gemini';

describe('safeParseJson Utility', () => {
  it('parses valid raw JSON object correctly', () => {
    const input = '{"title": "Non-Disclosure Agreement", "riskScore": 42}';
    const result = safeParseJson(input);
    expect(result).toEqual({ title: 'Non-Disclosure Agreement', riskScore: 42 });
  });

  it('strips markdown ```json code blocks', () => {
    const input = '```json\n{"summary": "Standard SaaS contract", "isFair": true}\n```';
    const result = safeParseJson(input);
    expect(result).toEqual({ summary: 'Standard SaaS contract', isFair: true });
  });

  it('strips generic markdown ``` code blocks', () => {
    const input = '```\n{"answer": "Notice must be given within 30 days."}\n```';
    const result = safeParseJson(input);
    expect(result).toEqual({ answer: 'Notice must be given within 30 days.' });
  });

  it('extracts embedded JSON when model includes conversational prefixes or suffixes', () => {
    const input = 'Here is the analysis:\n{"riskLevel": "Critical", "trap": "Uncapped liability"}\nHope this helps!';
    const result = safeParseJson(input);
    expect(result).toEqual({ riskLevel: 'Critical', trap: 'Uncapped liability' });
  });

  it('extracts top-level arrays accurately', () => {
    const input = '["Payment within 15 days", "30-day cure period", "Mutual NDA"]';
    const result = safeParseJson<string[]>(input);
    expect(result).toHaveLength(3);
    expect(result[0]).toBe('Payment within 15 days');
  });

  it('throws a SyntaxError when text has no valid JSON structure', () => {
    const input = 'This is purely unformatted natural language without any braces or brackets.';
    expect(() => safeParseJson(input)).toThrow();
  });
});
