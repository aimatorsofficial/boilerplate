import { AxiosError, AxiosHeaders } from 'axios';
import { describe, expect, it } from 'vitest';
import { toErrorMessageKey } from './api-error';

const apiError = (status: number, body: unknown) =>
  new AxiosError('failed', 'ERR_BAD_REQUEST', undefined, undefined, {
    status,
    statusText: '',
    data: body,
    headers: {},
    config: { headers: new AxiosHeaders() },
  });

describe('toErrorMessageKey', () => {
  it('maps a known API error code to its message key', () => {
    expect(toErrorMessageKey(apiError(409, { error: { code: 'EMAIL_TAKEN' } }))).toBe(
      'errors.EMAIL_TAKEN',
    );
  });

  it('falls back to the unknown message for codes the client does not know', () => {
    expect(toErrorMessageKey(apiError(500, { error: { code: 'INTERNAL_ERROR' } }))).toBe(
      'errors.UNKNOWN',
    );
  });

  it('uses the network message when there is no response', () => {
    expect(toErrorMessageKey(new AxiosError('offline', 'ERR_NETWORK'))).toBe('errors.NETWORK');
  });

  it('uses the unknown message for errors that are not from the API', () => {
    expect(toErrorMessageKey(new Error('boom'))).toBe('errors.UNKNOWN');
  });
});
