import { z } from 'zod';
import { DB_DRIVER_VALUES, DB_DRIVERS, TOKEN_LIMITS } from '../constants/index.js';

const commaSeparatedUrls = z
  .string()
  .min(1)
  .transform((value) => value.split(',').map((origin) => origin.trim()))
  .pipe(z.array(z.url()));

const envSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().int().positive(),
    LOG_LEVEL: z
      .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'])
      .default('info'),
    CORS_ORIGINS: commaSeparatedUrls,
    TRUST_PROXY: z.coerce.number().int().min(0).default(0),
    DB_DRIVER: z.enum(DB_DRIVER_VALUES).default(DB_DRIVERS.MEMORY),
    MONGO_URI: z.string().min(1).optional(),
    JWT_ACCESS_SECRET: z.string().min(TOKEN_LIMITS.JWT_SECRET_MIN_LENGTH),
    SEED_ADMIN_NAME: z.string().optional(),
    SEED_ADMIN_EMAIL: z.string().optional(),
    SEED_ADMIN_PASSWORD: z.string().optional(),
  })
  .refine((env) => env.DB_DRIVER !== DB_DRIVERS.MONGO || env.MONGO_URI, {
    path: ['MONGO_URI'],
    message: 'MONGO_URI is required when DB_DRIVER is mongo',
  });

type Env = z.infer<typeof envSchema>;

export const loadEnv = (source: NodeJS.ProcessEnv): Env => {
  const result = envSchema.safeParse(source);
  if (!result.success) {
    throw new Error(`Invalid environment variables:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
};

export const env = loadEnv(process.env);
