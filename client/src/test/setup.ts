import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll } from 'vitest';
import '../lib/i18n';
import { queryClient } from '../lib/query-client';
import { tokenStore } from '../lib/token-store';
import { server } from './server';

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => {
  cleanup();
  server.resetHandlers();
  queryClient.clear();
  tokenStore.clear();
});

afterAll(() => {
  server.close();
});
