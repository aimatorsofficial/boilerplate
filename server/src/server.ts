import { createApp } from './app.js';
import { env } from './config/env.js';
import { SHUTDOWN_TIMEOUT_MS } from './constants/index.js';
import { createDatabase, type Database } from './database/index.js';
import { logger } from './lib/logger.js';
import { flushSentry, initSentry } from './monitoring/sentry.js';

initSentry(env.SENTRY_DSN, env.NODE_ENV);

const connectDatabase = async () => {
  try {
    const database = await createDatabase(env.DB_DRIVER, env.MONGO_URI);
    logger.info({ driver: env.DB_DRIVER }, 'Database connected');
    return database;
  } catch (error) {
    logger.fatal({ err: error }, 'Database connection failed');
    process.exit(1);
  }
};

const database: Database = await connectDatabase();

const server = createApp(database).listen(env.PORT, (error) => {
  if (error) {
    logger.fatal({ err: error }, 'Server failed to start');
    process.exit(1);
  }
  logger.info({ port: env.PORT }, 'Server started');
});

const shutdown = (signal: NodeJS.Signals) => {
  logger.info({ signal }, 'Shutting down');

  server.close(async (error) => {
    if (error) logger.error({ err: error }, 'Shutdown failed');
    await database.disconnect();
    await flushSentry();
    process.exit(error ? 1 : 0);
  });

  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, SHUTDOWN_TIMEOUT_MS).unref();
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
