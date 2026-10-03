import { isAxiosError } from 'axios';
import { z } from 'zod';

const ERROR_MESSAGE_KEYS = {
  VALIDATION_FAILED: 'errors.VALIDATION_FAILED',
  EMAIL_TAKEN: 'errors.EMAIL_TAKEN',
  INVALID_CREDENTIALS: 'errors.INVALID_CREDENTIALS',
  TOO_MANY_REQUESTS: 'errors.TOO_MANY_REQUESTS',
  FORBIDDEN: 'errors.FORBIDDEN',
} as const;

const NETWORK_ERROR_KEY = 'errors.NETWORK';
const UNKNOWN_ERROR_KEY = 'errors.UNKNOWN';

type KnownErrorCode = keyof typeof ERROR_MESSAGE_KEYS;

const apiErrorBodySchema = z.object({ error: z.object({ code: z.string() }) });

const isKnownErrorCode = (code: string): code is KnownErrorCode =>
  Object.hasOwn(ERROR_MESSAGE_KEYS, code);

export const readApiErrorCode = (error: unknown) => {
  if (!isAxiosError(error)) return undefined;
  return apiErrorBodySchema.safeParse(error.response?.data).data?.error.code;
};

export const toErrorMessageKey = (error: unknown) => {
  const code = readApiErrorCode(error);
  if (code && isKnownErrorCode(code)) return ERROR_MESSAGE_KEYS[code];
  if (isAxiosError(error) && !error.response) return NETWORK_ERROR_KEY;
  return UNKNOWN_ERROR_KEY;
};
