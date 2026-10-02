import { createApp } from './app.js';
import { env } from './config/env.js';
import { SHUTDOWN_TIMEOUT_MS } from './constants/index.js';
import { createRepositories } from './database/index.js';
import { logger } from './lib/logger.js';

const app = createApp(createRepositories());

const server = app.listen(env.PORT, (error) => {
  if (error) {
    logger.fatal({ err: error }, 'Server failed to start');
    process.exit(1);
  }
  logger.info({ port: env.PORT }, 'Server started');
});

const shutdown = (signal: NodeJS.Signals) => {
  logger.info({ signal }, 'Shutting down');

  server.close((error) => {
    if (error) logger.error({ err: error }, 'Shutdown failed');
    process.exit(error ? 1 : 0);
  });

  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, SHUTDOWN_TIMEOUT_MS).unref();
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
