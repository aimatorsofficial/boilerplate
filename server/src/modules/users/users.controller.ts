import type { Request, Response } from 'express';
import type { NoParams } from '../../lib/http-types.js';
import { buildPageMeta } from '../../lib/pagination.js';
import { sendCreated, sendList, sendNoContent, sendOk } from '../../lib/response.js';
import type {
  CreateUserInput,
  ListUsersQuery,
  UpdateUserInput,
  UserIdParams,
} from './users.schema.js';
import type { UsersService } from './users.service.js';

export const createUsersController = (usersService: UsersService) => ({
  async list(req: Request<NoParams, unknown, unknown, ListUsersQuery>, res: Response) {
    const page = await usersService.list(req.query);
    sendList(res, page.items, buildPageMeta(req.query, page.total));
  },

  async getById(req: Request<UserIdParams>, res: Response) {
    sendOk(res, await usersService.getById(req.params.id));
  },

  async create(req: Request<NoParams, unknown, CreateUserInput>, res: Response) {
    sendCreated(res, await usersService.create(req.body));
  },

  async update(req: Request<UserIdParams, unknown, UpdateUserInput>, res: Response) {
    sendOk(res, await usersService.update(req.params.id, req.body));
  },

  async remove(req: Request<UserIdParams>, res: Response) {
    await usersService.remove(req.params.id);
    sendNoContent(res);
  },
});
