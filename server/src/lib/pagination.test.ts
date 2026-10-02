import { describe, expect, it } from 'vitest';
import { PAGINATION } from '../constants/index.js';
import { buildPageMeta, paginationQuerySchema, toSkip } from './pagination.js';

describe('paginationQuerySchema', () => {
  it('uses the default page and limit when none are given', () => {
    expect(paginationQuerySchema.parse({})).toEqual({
      page: PAGINATION.DEFAULT_PAGE,
      limit: PAGINATION.DEFAULT_LIMIT,
    });
  });

  it('converts query strings to numbers', () => {
    expect(paginationQuerySchema.parse({ page: '3', limit: '5' })).toEqual({ page: 3, limit: 5 });
  });

  it('rejects a limit above the maximum', () => {
    const result = paginationQuerySchema.safeParse({ limit: PAGINATION.MAX_LIMIT + 1 });

    expect(result.success).toBe(false);
  });

  it('rejects a page below 1', () => {
    expect(paginationQuerySchema.safeParse({ page: 0 }).success).toBe(false);
  });
});

describe('toSkip', () => {
  it('skips the items of all previous pages', () => {
    expect(toSkip({ page: 3, limit: 10 })).toBe(20);
  });
});

describe('buildPageMeta', () => {
  it('rounds the page count up', () => {
    expect(buildPageMeta({ page: 1, limit: 10 }, 21)).toEqual({
      page: 1,
      limit: 10,
      total: 21,
      totalPages: 3,
    });
  });

  it('reports zero pages for an empty list', () => {
    expect(buildPageMeta({ page: 1, limit: 10 }, 0).totalPages).toBe(0);
  });
});
