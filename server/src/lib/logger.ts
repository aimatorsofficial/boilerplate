import { pino } from 'pino';
import { env } from '../config/env.js';

const REDACTED_PATHS = [
  'password',
  '*.password',
  'token',
  '*.token',
  'req.headers.authorization',
  'req.headers.cookie',
  'res.headers["set-cookie"]',
];

const prettyTransport = { target: 'pino-pretty', options: { colorize: true } };

export const logger = pino({
  level: env.LOG_LEVEL,
  redact: { paths: REDACTED_PATHS, censor: '[REDACTED]' },
  transport: env.NODE_ENV === 'development' ? prettyTransport : undefined,
});
