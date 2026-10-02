import { z } from 'zod';
import { USER_LIMITS } from '../../constants/index.js';
import { paginationQuerySchema } from '../../lib/pagination.js';

const nameSchema = z.string().trim().min(1).max(USER_LIMITS.NAME_MAX_LENGTH);
const emailSchema = z.email().max(USER_LIMITS.EMAIL_MAX_LENGTH).toLowerCase();

export const userIdParamsSchema = z.object({ id: z.uuid() });

export const listUsersQuerySchema = paginationQuerySchema;

export const createUserBodySchema = z.object({
  name: nameSchema,
  email: emailSchema,
});

export const updateUserBodySchema = createUserBodySchema
  .partial()
  .refine((body) => Object.keys(body).length > 0, { path: ['body'] });

export const userResponseSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  email: z.email(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export type UserIdParams = z.infer<typeof userIdParamsSchema>;
export type ListUsersQuery = z.infer<typeof listUsersQuerySchema>;
export type CreateUserInput = z.infer<typeof createUserBodySchema>;
export type UpdateUserInput = z.infer<typeof updateUserBodySchema>;

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}
