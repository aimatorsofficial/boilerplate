import { z } from 'zod';
import { ROLES } from '../../constants/index.js';
import type { UsersRepository } from './users.repository.js';
import { userFieldSchemas } from './users.schema.js';
import type { UsersService } from './users.service.js';

export const seedAdminInputSchema = z.object({
  name: userFieldSchemas.name,
  email: userFieldSchemas.email,
  password: userFieldSchemas.password,
});

type SeedAdminInput = z.infer<typeof seedAdminInputSchema>;

export const seedAdmin = async (
  usersService: UsersService,
  usersRepo: UsersRepository,
  input: SeedAdminInput,
) => {
  const existing = await usersRepo.findByEmail(input.email);
  if (!existing) {
    return { user: await usersService.create({ ...input, role: ROLES.ADMIN }), created: true };
  }
  if (existing.role === ROLES.ADMIN) return { user: existing, created: false };
  return { user: await usersService.update(existing.id, { role: ROLES.ADMIN }), created: false };
};
