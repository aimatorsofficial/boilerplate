import { QueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { HTTP_STATUS, QUERY_KEYS, QUERY_SETTINGS } from '../constants';

const isClientError = (error: unknown) => {
  const status = isAxiosError(error) ? error.response?.status : undefined;
  return (
    status !== undefined &&
    status >= HTTP_STATUS.CLIENT_ERROR_MIN &&
    status < HTTP_STATUS.SERVER_ERROR_MIN
  );
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: QUERY_SETTINGS.STALE_TIME_MS,
      retry: (failureCount, error) =>
        !isClientError(error) && failureCount < QUERY_SETTINGS.MAX_RETRIES,
    },
  },
});

const isCurrentUserQuery = (queryKey: readonly unknown[]) =>
  queryKey.length === QUERY_KEYS.CURRENT_USER.length &&
  queryKey.every((part, index) => part === QUERY_KEYS.CURRENT_USER[index]);

export const resetSessionCache = () => {
  queryClient.removeQueries({ predicate: (query) => !isCurrentUserQuery(query.queryKey) });
  queryClient.setQueryData(QUERY_KEYS.CURRENT_USER, null);
};
