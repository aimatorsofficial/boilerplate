import { z } from 'zod';
import {
  PASSWORD_LIMITS,
  ROLE_VALUES,
  ROLES,
  USER_LIMITS,
  type Role,
} from '../../constants/index.js';
import { paginationQuerySchema } from '../../lib/pagination.js';

const nameSchema = z.string().trim().min(1).max(USER_LIMITS.NAME_MAX_LENGTH);
const emailSchema = z.email().max(USER_LIMITS.EMAIL_MAX_LENGTH).toLowerCase();
const passwordSchema = z.string().min(PASSWORD_LIMITS.MIN_LENGTH).max(PASSWORD_LIMITS.MAX_LENGTH);
const roleSchema = z.enum(ROLE_VALUES);

export const userFieldSchemas = {
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
};

export const userIdParamsSchema = z.object({ id: z.uuid() });

export const listUsersQuerySchema = paginationQuerySchema;

export const createUserBodySchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  role: roleSchema.default(ROLES.USER),
});

export const updateUserBodySchema = z
  .object({ name: nameSchema, email: emailSchema, role: roleSchema })
  .partial()
  .refine((body) => Object.keys(body).length > 0, { path: ['body'] });

export const userResponseSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  email: z.email(),
  role: roleSchema,
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
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCredentials extends User {
  passwordHash: string;
}

export type NewUserRecord = Omit<CreateUserInput, 'password'> & { passwordHash: string };
