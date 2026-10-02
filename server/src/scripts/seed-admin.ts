import { env } from '../config/env.js';
import { DB_DRIVERS } from '../constants/index.js';
import { createDatabase } from '../database/index.js';
import { logger } from '../lib/logger.js';
import { seedAdmin, seedAdminInputSchema } from '../modules/users/users.seed.js';
import { createUsersService } from '../modules/users/users.service.js';

const run = async () => {
  if (env.DB_DRIVER === DB_DRIVERS.MEMORY) {
    logger.warn('DB_DRIVER is memory, so a seeded admin would be lost. Set DB_DRIVER=mongo.');
    return;
  }

  const input = seedAdminInputSchema.parse({
    name: env.SEED_ADMIN_NAME,
    email: env.SEED_ADMIN_EMAIL,
    password: env.SEED_ADMIN_PASSWORD,
  });
  const database = await createDatabase(env.DB_DRIVER, env.MONGO_URI);

  try {
    const users = database.repositories.users;
    const { user, created } = await seedAdmin(createUsersService(users), users, input);
    logger.info({ email: user.email, created }, 'Admin user is ready');
  } finally {
    await database.disconnect();
  }
};

try {
  await run();
} catch (error) {
  logger.fatal({ err: error }, 'Seeding the admin user failed');
  process.exitCode = 1;
}
