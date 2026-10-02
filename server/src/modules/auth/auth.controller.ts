import type { Request, Response } from 'express';
import type { NoParams } from '../../lib/http-types.js';
import { sendCreated, sendNoContent, sendOk } from '../../lib/response.js';
import { getAuth } from '../../middleware/auth.js';
import type { LoginInput, RefreshTokenInput, RegisterInput } from './auth.schema.js';
import type { AuthService } from './auth.service.js';

export const createAuthController = (authService: AuthService) => ({
  async register(req: Request<NoParams, unknown, RegisterInput>, res: Response) {
    sendCreated(res, await authService.register(req.body));
  },

  async login(req: Request<NoParams, unknown, LoginInput>, res: Response) {
    sendOk(res, await authService.login(req.body));
  },

  async refresh(req: Request<NoParams, unknown, RefreshTokenInput>, res: Response) {
    sendOk(res, await authService.refresh(req.body.refreshToken));
  },

  async logout(req: Request<NoParams, unknown, RefreshTokenInput>, res: Response) {
    await authService.logout(req.body.refreshToken);
    sendNoContent(res);
  },

  async me(req: Request, res: Response) {
    sendOk(res, await authService.me(getAuth(req).userId));
  },
});
