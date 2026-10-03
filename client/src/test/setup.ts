import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { DEFAULT_LANGUAGE } from '../constants';
import { i18n } from '../lib/i18n';
import { queryClient } from '../lib/query-client';
import { tokenStore } from '../lib/token-store';
import { server } from './server';

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

afterEach(async () => {
  cleanup();
  server.resetHandlers();
  queryClient.clear();
  tokenStore.clear();
  localStorage.clear();
  await i18n.changeLanguage(DEFAULT_LANGUAGE);
});

afterAll(() => {
  server.close();
});
