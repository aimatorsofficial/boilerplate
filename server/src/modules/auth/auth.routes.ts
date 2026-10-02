import { API_ROUTES } from '../../constants/index.js';
import { createApiRouter } from '../../lib/api-router.js';
import { authenticate } from '../../middleware/auth.js';
import { createAuthRateLimit } from '../../middleware/rate-limit.js';
import { validate } from '../../middleware/validate.js';
import { createAuthController } from './auth.controller.js';
import { loginBodySchema, refreshTokenBodySchema, registerBodySchema } from './auth.schema.js';
import type { AuthService } from './auth.service.js';

const { REGISTER, LOGIN, REFRESH, LOGOUT, ME } = API_ROUTES.AUTH;

export const createAuthRouter = (authService: AuthService) => {
  const router = createApiRouter();
  const controller = createAuthController(authService);
  const authRateLimit = createAuthRateLimit();

  router.post(REGISTER, authRateLimit, validate({ body: registerBodySchema }), controller.register);
  router.post(LOGIN, authRateLimit, validate({ body: loginBodySchema }), controller.login);
  router.post(
    REFRESH,
    authRateLimit,
    validate({ body: refreshTokenBodySchema }),
    controller.refresh,
  );
  router.post(LOGOUT, validate({ body: refreshTokenBodySchema }), controller.logout);
  router.get(ME, authenticate, controller.me);

  return router;
};
