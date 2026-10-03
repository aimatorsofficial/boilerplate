import { z } from 'zod';
import { ROLE_VALUES } from '../../constants';

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  role: z.enum(ROLE_VALUES),
  createdAt: z.string(),
});

export type User = z.infer<typeof userSchema>;

export const ROLE_LABEL_KEYS = {
  user: 'roles.user',
  admin: 'roles.admin',
} as const;
