import type { OpenAPIRegistry, RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { HTTP_STATUS, SYSTEM_ROUTES } from '../constants/index.js';
import {
  bearerSecurity,
  dataResponse,
  errorResponse,
  signedInResponses,
} from '../docs/openapi-responses.js';

const TAGS = ['Monitoring'];

const health: RouteConfig = {
  method: 'get',
  path: SYSTEM_ROUTES.HEALTH,
  tags: TAGS,
  summary: 'The process is alive',
  responses: {
    [HTTP_STATUS.OK]: dataResponse(
      'Alive',
      z.object({ status: z.string(), uptimeSeconds: z.number().int() }),
    ),
  },
};

const ready: RouteConfig = {
  method: 'get',
  path: SYSTEM_ROUTES.READY,
  tags: TAGS,
  summary: 'The database is reachable',
  responses: {
    [HTTP_STATUS.OK]: dataResponse('Ready', z.object({ status: z.string() })),
    [HTTP_STATUS.SERVICE_UNAVAILABLE]: errorResponse('Database unreachable (DATABASE_UNAVAILABLE)'),
  },
};

const metrics: RouteConfig = {
  method: 'get',
  path: SYSTEM_ROUTES.METRICS,
  tags: TAGS,
  security: bearerSecurity,
  summary: 'Prometheus metrics (needs METRICS_TOKEN as a bearer token when it is set)',
  responses: {
    [HTTP_STATUS.OK]: {
      description: 'Prometheus text format',
      content: { 'text/plain': { schema: z.string() } },
    },
    ...signedInResponses,
  },
};

export const registerMonitoringDocs = (registry: OpenAPIRegistry) => {
  [health, ready, metrics].forEach((route) => registry.registerPath(route));
};
