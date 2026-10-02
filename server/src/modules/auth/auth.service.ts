import { ERROR_CODES, ROLES } from '../../constants/index.js';
import { AppError } from '../../lib/app-error.js';
import { verifyPassword } from '../../lib/password.js';
import type { UsersRepository } from '../users/users.repository.js';
import type { User } from '../users/users.schema.js';
import type { UsersService } from '../users/users.service.js';
import type { LoginInput, RegisterInput } from './auth.schema.js';
import { hashRefreshToken, issueTokenPair } from './auth.tokens.js';
import type { RefreshTokensRepository } from './refresh-tokens.repository.js';

interface AuthServiceDependencies {
  usersService: UsersService;
  usersRepo: UsersRepository;
  refreshTokensRepo: RefreshTokensRepository;
}

export const createAuthService = (deps: AuthServiceDependencies) => {
  const { usersService, usersRepo, refreshTokensRepo } = deps;

  const issueTokensFor = (user: User) =>
    issueTokenPair(refreshTokensRepo, { userId: user.id, role: user.role });

  return {
    async register(input: RegisterInput) {
      const user = await usersService.create({ ...input, role: ROLES.USER });
      return issueTokensFor(user);
    },

    async login({ email, password }: LoginInput) {
      const credentials = await usersRepo.findCredentialsByEmail(email);
      const isValid = credentials && (await verifyPassword(credentials.passwordHash, password));
      if (!credentials || !isValid) throw new AppError(ERROR_CODES.INVALID_CREDENTIALS);
      return issueTokensFor(credentials);
    },

    async refresh(refreshToken: string) {
      const stored = await refreshTokensRepo.consume(hashRefreshToken(refreshToken));
      const isExpired = !stored || stored.expiresAt <= new Date();
      const user = stored && !isExpired ? await usersRepo.findById(stored.userId) : null;
      if (!user) throw new AppError(ERROR_CODES.REFRESH_TOKEN_INVALID);
      return issueTokensFor(user);
    },

    async logout(refreshToken: string) {
      await refreshTokensRepo.consume(hashRefreshToken(refreshToken));
    },

    me: (userId: string) => usersService.getById(userId),
  };
};

export type AuthService = ReturnType<typeof createAuthService>;
