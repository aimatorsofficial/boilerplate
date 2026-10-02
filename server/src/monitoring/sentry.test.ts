import * as Sentry from '@sentry/node';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { flushSentry, initSentry, reportError } from './sentry.js';

vi.mock('@sentry/node', () => ({
  init: vi.fn(),
  isInitialized: vi.fn(),
  captureException: vi.fn(),
  flush: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('initSentry', () => {
  it('does nothing without a DSN', () => {
    initSentry(undefined, 'production');

    expect(Sentry.init).not.toHaveBeenCalled();
  });

  it('starts Sentry without headers, cookies, bodies or variables when a DSN is set', () => {
    initSentry('https://key@sentry.example.com/1', 'production');

    expect(Sentry.init).toHaveBeenCalledWith(
      expect.objectContaining({
        environment: 'production',
        dataCollection: expect.objectContaining({
          userInfo: false,
          cookies: false,
          httpHeaders: false,
          httpBodies: [],
          stackFrameVariables: false,
        }),
      }),
    );
  });
});

describe('reportError', () => {
  it('does not send anything when Sentry is off', () => {
    vi.mocked(Sentry.isInitialized).mockReturnValue(false);

    reportError(new Error('boom'), 'req-1');

    expect(Sentry.captureException).not.toHaveBeenCalled();
  });

  it('sends the error tagged with the request id when Sentry is on', () => {
    vi.mocked(Sentry.isInitialized).mockReturnValue(true);
    const error = new Error('boom');

    reportError(error, 'req-1');

    expect(Sentry.captureException).toHaveBeenCalledWith(error, { tags: { requestId: 'req-1' } });
  });
});

describe('flushSentry', () => {
  it('skips flushing when Sentry is off', async () => {
    vi.mocked(Sentry.isInitialized).mockReturnValue(false);

    await flushSentry();

    expect(Sentry.flush).not.toHaveBeenCalled();
  });
});
