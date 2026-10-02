import { OpenAPIRegistry, OpenApiGeneratorV31 } from '@asteasolutions/zod-to-openapi';
import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import { APP_NAME, APP_VERSION, SYSTEM_ROUTES } from '../constants/index.js';
import { registerAuthDocs } from '../modules/auth/auth.docs.js';
import { registerUsersDocs } from '../modules/users/users.docs.js';
import { registerMonitoringDocs } from '../monitoring/monitoring.docs.js';
import { BEARER_AUTH } from './openapi-responses.js';

const OPENAPI_VERSION = '3.1.0';

export const buildOpenApiDocument = () => {
  const registry = new OpenAPIRegistry();
  registry.registerComponent('securitySchemes', BEARER_AUTH, {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
  });
  registerMonitoringDocs(registry);
  registerAuthDocs(registry);
  registerUsersDocs(registry);

  return new OpenApiGeneratorV31(registry.definitions).generateDocument({
    openapi: OPENAPI_VERSION,
    info: { title: APP_NAME, version: APP_VERSION },
  });
};

export const createDocsRouter = () => {
  const router = Router();
  const document = buildOpenApiDocument();

  router.get(SYSTEM_ROUTES.OPENAPI_JSON, (_req, res) => {
    res.json(document);
  });
  router.use(SYSTEM_ROUTES.DOCS, swaggerUi.serve, swaggerUi.setup(document));

  return router;
};
