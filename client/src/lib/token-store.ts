import { z } from 'zod';
import { STORAGE_KEYS } from '../constants';

export const tokenPairSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

export type TokenPair = z.infer<typeof tokenPairSchema>;

let accessToken: string | null = null;
let inMemoryRefreshToken: string | null = null;

const readRefreshToken = () => {
  try {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  } catch {
    return inMemoryRefreshToken;
  }
};

const writeRefreshToken = (value: string | null) => {
  inMemoryRefreshToken = value;
  try {
    if (value) localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, value);
    else localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  } catch {
    return;
  }
};

export const tokenStore = {
  getAccessToken: () => accessToken,

  getRefreshToken: readRefreshToken,

  hasSession: () => Boolean(accessToken ?? readRefreshToken()),

  save(tokens: TokenPair) {
    accessToken = tokens.accessToken;
    writeRefreshToken(tokens.refreshToken);
  },

  clear() {
    accessToken = null;
    writeRefreshToken(null);
  },
};
