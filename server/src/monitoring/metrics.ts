import { createHash, timingSafeEqual } from 'node:crypto';
import { Router, type Request, type RequestHandler, type Response } from 'express';
import { collectDefaultMetrics, Histogram, Registry } from 'prom-client';
import {
  BEARER_PREFIX,
  ERROR_CODES,
  HTTP_HEADERS,
  METRICS,
  SYSTEM_ROUTES,
} from '../constants/index.js';
import { AppError } from '../lib/app-error.js';

type HttpDurationHistogram = Histogram<'method' | 'route' | 'status'>;

const sha256 = (value: string) => createHash('sha256').update(value).digest();

const isSameSecret = (given: string, expected: string) =>
  timingSafeEqual(sha256(given), sha256(expected));

const readRouteLabel = (req: Request, res: Response) => {
  const routePath: unknown = req.route?.path;
  if (typeof routePath !== 'string') return METRICS.UNMATCHED_ROUTE;
  const savedBase: unknown = res.locals[METRICS.ROUTE_BASE_LOCAL];
  const base = typeof savedBase === 'string' ? savedBase : req.baseUrl;
  return routePath === '/' && base ? base : `${base}${routePath}`;
};

export const createMetrics = () => {
  const registry = new Registry();
  collectDefaultMetrics({ register: registry });

  const httpDuration: HttpDurationHistogram = new Histogram({
    name: METRICS.HTTP_DURATION_NAME,
    help: METRICS.HTTP_DURATION_HELP,
    labelNames: ['method', 'route', 'status'],
    buckets: [...METRICS.DURATION_BUCKETS_SECONDS],
    registers: [registry],
  });

  return { registry, httpDuration };
};

export const createRequestTimer =
  (httpDuration: HttpDurationHistogram): RequestHandler =>
  (req, res, next) => {
    const stopTimer = httpDuration.startTimer();
    res.on('finish', () => {
      stopTimer({ method: req.method, route: readRouteLabel(req, res), status: res.statusCode });
    });
    next();
  };

const requireMetricsToken =
  (token: string | undefined): RequestHandler =>
  (req, _res, next) => {
    const header = req.get(HTTP_HEADERS.AUTHORIZATION) ?? '';
    const given = header.startsWith(BEARER_PREFIX) ? header.slice(BEARER_PREFIX.length) : '';
    if (token && !isSameSecret(given, token)) throw new AppError(ERROR_CODES.UNAUTHORIZED);
    next();
  };

export const createMetricsRouter = (registry: Registry, token: string | undefined) => {
  const router = Router();

  router.get(SYSTEM_ROUTES.METRICS, requireMetricsToken(token), async (_req, res) => {
    res.set('Content-Type', registry.contentType);
    res.send(await registry.metrics());
  });

  return router;
};
