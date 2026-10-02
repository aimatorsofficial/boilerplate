import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { pinoHttp } from 'pino-http';
import { env } from './config/env.js';
import { API_PREFIX, API_ROUTES, BODY_SIZE_LIMIT } from './constants/index.js';
import type { Repositories } from './database/index.js';
import { createDocsRouter } from './docs/swagger.js';
import { logger } from './lib/logger.js';
import { errorHandler } from './middleware/error-handler.js';
import { notFound } from './middleware/not-found.js';
import { requestId } from './middleware/request-id.js';
import { createUsersRouter } from './modules/users/users.routes.js';
import { createUsersService } from './modules/users/users.service.js';
import { healthRouter } from './monitoring/health.js';

export const createApp = (repositories: Repositories) => {
  const app = express();
  const usersService = createUsersService(repositories.users);

  app.use(requestId);
  app.use(pinoHttp({ logger, genReqId: (req) => req.id }));
  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGINS }));
  app.use(compression());
  app.use(express.json({ limit: BODY_SIZE_LIMIT }));

  app.use(healthRouter);
  app.use(createDocsRouter());
  app.use(`${API_PREFIX}${API_ROUTES.USERS.ROOT}`, createUsersRouter(usersService));

  app.use(notFound);
  app.use(errorHandler);

  return app;
};
