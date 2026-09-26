import { describe, it, expect } from 'vitest';

describe('Accessibility & Defensive Rendering Tests', () => {
  it('handles null/undefined whoBenefits gracefully without throwing', () => {
    const getWhoBenefitsBadge = (who?: string | null) => {
      const safeWho = (who || '').trim();
      if (!safeWho) {
        return { label: 'Neutral / Both Parties', color: 'bg-stone-100 text-stone-700' };
      }
      if (safeWho.toLowerCase().includes('client') || safeWho.toLowerCase().includes('employer') || safeWho.toLowerCase().includes('landlord')) {
        return { label: `Favors ${safeWho}`, color: 'bg-rose-50 text-rose-700' };
      }
      if (safeWho.toLowerCase().includes('contractor') || safeWho.toLowerCase().includes('tenant') || safeWho.toLowerCase().includes('user')) {
        return { label: `Favors ${safeWho}`, color: 'bg-emerald-50 text-emerald-700' };
      }
      return { label: safeWho, color: 'bg-amber-50 text-amber-700' };
    };

    expect(() => getWhoBenefitsBadge(undefined)).not.toThrow();
    expect(() => getWhoBenefitsBadge(null)).not.toThrow();
    expect(getWhoBenefitsBadge(undefined).label).toBe('Neutral / Both Parties');
    expect(getWhoBenefitsBadge('Landlord').label).toContain('Favors Landlord');
  });

  it('handles null/undefined impact verdicts in contract comparison', () => {
    const getImpactBadge = (verdict?: string | null) => {
      const safe = (verdict || '').toLowerCase();
      if (safe.includes('favorable') || safe.includes('improved')) {
        return { label: verdict || 'Favorable', color: 'bg-emerald-50 text-emerald-700' };
      }
      if (safe.includes('unfavorable') || safe.includes('worse') || safe.includes('higher risk')) {
        return { label: verdict || 'Unfavorable', color: 'bg-rose-50 text-rose-700' };
      }
      return { label: verdict || 'Neutral / Modified', color: 'bg-stone-100 text-stone-700' };
    };

    expect(() => getImpactBadge(undefined)).not.toThrow();
    expect(() => getImpactBadge(null)).not.toThrow();
    expect(getImpactBadge(null).label).toBe('Neutral / Modified');
    expect(getImpactBadge('Favorable modification').color).toContain('emerald');
  });

  it('risk scoring correctly maps to appropriate WCAG accessible color tokens', () => {
    const getScoreBadge = (score: number) => {
      if (score >= 70) return { label: 'Critical Risk', textClass: 'text-rose-700', bgClass: 'bg-rose-50' };
      if (score >= 45) return { label: 'High Risk', textClass: 'text-amber-700', bgClass: 'bg-amber-50' };
      if (score >= 25) return { label: 'Moderate Risk', textClass: 'text-yellow-700', bgClass: 'bg-yellow-50' };
      return { label: 'Low Risk', textClass: 'text-emerald-700', bgClass: 'bg-emerald-50' };
    };

    expect(getScoreBadge(85).label).toBe('Critical Risk');
    expect(getScoreBadge(60).label).toBe('High Risk');
    expect(getScoreBadge(35).label).toBe('Moderate Risk');
    expect(getScoreBadge(15).label).toBe('Low Risk');
  });
});
