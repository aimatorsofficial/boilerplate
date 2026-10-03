import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resetSessionCache } from '../../lib/query-client';
import { tokenStore, type TokenPair } from '../../lib/token-store';
import { authApi } from './auth.api';
import { currentUserQuery } from './useCurrentUser';

const useStartSession = () => {
  const queryClient = useQueryClient();
  return async (tokens: TokenPair) => {
    tokenStore.save(tokens);
    await queryClient.fetchQuery(currentUserQuery);
  };
};

export const useLogin = () => {
  const startSession = useStartSession();
  return useMutation({ mutationFn: authApi.login, onSuccess: startSession });
};

export const useRegister = () => {
  const startSession = useStartSession();
  return useMutation({ mutationFn: authApi.register, onSuccess: startSession });
};

export const useLogout = () =>
  useMutation({
    mutationFn: async () => {
      const refreshToken = tokenStore.getRefreshToken();
      if (refreshToken) await authApi.logout(refreshToken);
    },
    onSettled: () => {
      tokenStore.clear();
      resetSessionCache();
    },
  });
