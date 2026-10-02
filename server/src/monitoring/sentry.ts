import * as Sentry from '@sentry/node';
import { APP_VERSION, SENTRY } from '../constants/index.js';

const NO_PERSONAL_DATA: Sentry.NodeOptions['dataCollection'] = {
  userInfo: false,
  cookies: false,
  httpHeaders: false,
  httpBodies: [],
  urlQueryParams: false,
  databaseQueryData: false,
  stackFrameVariables: false,
};

export const initSentry = (dsn: string | undefined, environment: string) => {
  if (!dsn) return;
  Sentry.init({ dsn, environment, release: APP_VERSION, dataCollection: NO_PERSONAL_DATA });
};

export const reportError = (error: unknown, requestId: string) => {
  if (!Sentry.isInitialized()) return;
  Sentry.captureException(error, { tags: { requestId } });
};

export const flushSentry = async () => {
  if (Sentry.isInitialized()) await Sentry.flush(SENTRY.FLUSH_TIMEOUT_MS);
};
