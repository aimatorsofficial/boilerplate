import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { readData, readPage } from './api-response';

const itemSchema = z.object({ id: z.string() });
const meta = { page: 1, limit: 20, total: 1, totalPages: 1 };

describe('readData', () => {
  it('returns the parsed data field', () => {
    expect(readData(itemSchema, { data: { id: 'a', extra: true } })).toEqual({ id: 'a' });
  });

  it('throws when the body does not match the schema', () => {
    expect(() => readData(itemSchema, { data: { id: 1 } })).toThrow();
  });
});

describe('readPage', () => {
  it('returns the parsed items and meta', () => {
    expect(readPage(itemSchema, { data: [{ id: 'a' }], meta })).toEqual({
      items: [{ id: 'a' }],
      meta,
    });
  });
});
