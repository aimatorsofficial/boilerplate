import { describe, expect, it } from 'vitest';
import { formatDate, formatNumber } from './formatters';

describe('formatters', () => {
  it('formats a date for the given language', () => {
    expect(formatDate('2026-10-02T12:00:00.000Z', 'en')).toBe('Oct 2, 2026');
  });

  it('formats a number for the given language', () => {
    expect(formatNumber(1234567, 'en')).toBe('1,234,567');
    expect(formatNumber(1234567, 'hi')).toBe('12,34,567');
  });
});
