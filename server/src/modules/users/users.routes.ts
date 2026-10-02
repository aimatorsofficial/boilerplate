import { API_ROUTES, ROLES } from '../../constants/index.js';
import { createApiRouter } from '../../lib/api-router.js';
import { authenticate } from '../../middleware/auth.js';
import { requireRole } from '../../middleware/require-role.js';
import { validate } from '../../middleware/validate.js';
import { createUsersController } from './users.controller.js';
import {
  createUserBodySchema,
  listUsersQuerySchema,
  updateUserBodySchema,
  userIdParamsSchema,
} from './users.schema.js';
import type { UsersService } from './users.service.js';

const { BY_ID } = API_ROUTES.USERS;

export const createUsersRouter = (usersService: UsersService) => {
  const router = createApiRouter();
  const controller = createUsersController(usersService);

  router.use(authenticate, requireRole(ROLES.ADMIN));

  router.get('/', validate({ query: listUsersQuerySchema }), controller.list);
  router.post('/', validate({ body: createUserBodySchema }), controller.create);
  router.get(BY_ID, validate({ params: userIdParamsSchema }), controller.getById);
  router.patch(
    BY_ID,
    validate({ params: userIdParamsSchema, body: updateUserBodySchema }),
    controller.update,
  );
  router.delete(BY_ID, validate({ params: userIdParamsSchema }), controller.remove);

  return router;
};
