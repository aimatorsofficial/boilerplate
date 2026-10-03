import axios, { isAxiosError } from 'axios';
import { API_BASE_URL, API_PATHS, AUTH_PATHS_WITHOUT_RETRY, HTTP_STATUS } from '../constants';
import { readData } from './api-response';
import { resetSessionCache } from './query-client';
import { tokenPairSchema, tokenStore } from './token-store';

export const apiClient = axios.create({ baseURL: API_BASE_URL });

let refreshInFlight: Promise<string | null> | null = null;

const requestNewAccessToken = async () => {
  const refreshToken = tokenStore.getRefreshToken();
  if (!refreshToken) return null;
  try {
    const response = await axios.post(`${API_BASE_URL}${API_PATHS.REFRESH}`, { refreshToken });
    const tokens = readData(tokenPairSchema, response.data);
    tokenStore.save(tokens);
    return tokens.accessToken;
  } catch {
    return null;
  }
};

const refreshAccessTokenOnce = async () => {
  refreshInFlight ??= requestNewAccessToken();
  try {
    return await refreshInFlight;
  } finally {
    refreshInFlight = null;
  }
};

const endSession = () => {
  tokenStore.clear();
  resetSessionCache();
};

apiClient.interceptors.request.use((config) => {
  const accessToken = tokenStore.getAccessToken();
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

apiClient.interceptors.response.use(undefined, async (error: unknown) => {
  const config = isAxiosError(error) ? error.config : undefined;
  const isUnauthorized = isAxiosError(error) && error.response?.status === HTTP_STATUS.UNAUTHORIZED;
  const canRetry =
    config && !config.retriedAfterRefresh && !AUTH_PATHS_WITHOUT_RETRY.includes(config.url ?? '');
  if (!isUnauthorized || !canRetry) throw error;

  const accessToken = await refreshAccessTokenOnce();
  if (!accessToken) {
    endSession();
    throw error;
  }
  config.retriedAfterRefresh = true;
  return apiClient(config);
});
