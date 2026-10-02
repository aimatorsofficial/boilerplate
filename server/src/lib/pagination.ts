import { z } from 'zod';
import { PAGINATION } from '../constants/index.js';

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(PAGINATION.DEFAULT_PAGE),
  limit: z.coerce.number().int().min(1).max(PAGINATION.MAX_LIMIT).default(PAGINATION.DEFAULT_LIMIT),
});

export type PaginationQuery = z.infer<typeof paginationQuerySchema>;

export interface Page<T> {
  items: T[];
  total: number;
}

export interface PageMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const toSkip = ({ page, limit }: PaginationQuery) => (page - 1) * limit;

export const buildPageMeta = ({ page, limit }: PaginationQuery, total: number): PageMeta => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit),
});
