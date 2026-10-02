import type { OpenAPIRegistry, RouteConfig } from '@asteasolutions/zod-to-openapi';
import { API_PREFIX, API_ROUTES, HTTP_STATUS } from '../../constants/index.js';
import {
  adminOnlyResponses,
  bearerSecurity,
  dataResponse,
  emptyResponse,
  errorResponse,
  invalidInputResponse,
  jsonBody,
  listResponse,
  toOpenApiPath,
} from '../../docs/openapi-responses.js';
import {
  createUserBodySchema,
  listUsersQuerySchema,
  updateUserBodySchema,
  userIdParamsSchema,
  userResponseSchema,
} from './users.schema.js';

const USERS_PATH = `${API_PREFIX}${API_ROUTES.USERS.ROOT}`;
const USER_BY_ID_PATH = toOpenApiPath(`${USERS_PATH}${API_ROUTES.USERS.BY_ID}`);
const ADMIN_ONLY = { tags: ['Users'], security: bearerSecurity };

export const userComponent = userResponseSchema.meta({ id: 'User' });

const userNotFound = errorResponse('User not found (USER_NOT_FOUND)');
const emailTaken = errorResponse('Email already used (EMAIL_TAKEN)');

const listUsers: RouteConfig = {
  ...ADMIN_ONLY,
  method: 'get',
  path: USERS_PATH,
  summary: 'List users, newest first (admin)',
  request: { query: listUsersQuerySchema },
  responses: {
    [HTTP_STATUS.OK]: listResponse('A page of users', userComponent),
    [HTTP_STATUS.BAD_REQUEST]: invalidInputResponse,
    ...adminOnlyResponses,
  },
};

const createUser: RouteConfig = {
  ...ADMIN_ONLY,
  method: 'post',
  path: USERS_PATH,
  summary: 'Create a user with any role (admin)',
  request: { body: jsonBody(createUserBodySchema) },
  responses: {
    [HTTP_STATUS.CREATED]: dataResponse('The created user', userComponent),
    [HTTP_STATUS.BAD_REQUEST]: invalidInputResponse,
    ...adminOnlyResponses,
    [HTTP_STATUS.CONFLICT]: emailTaken,
  },
};

const getUser: RouteConfig = {
  ...ADMIN_ONLY,
  method: 'get',
  path: USER_BY_ID_PATH,
  summary: 'Get one user (admin)',
  request: { params: userIdParamsSchema },
  responses: {
    [HTTP_STATUS.OK]: dataResponse('The user', userComponent),
    [HTTP_STATUS.BAD_REQUEST]: invalidInputResponse,
    ...adminOnlyResponses,
    [HTTP_STATUS.NOT_FOUND]: userNotFound,
  },
};

const updateUser: RouteConfig = {
  ...ADMIN_ONLY,
  method: 'patch',
  path: USER_BY_ID_PATH,
  summary: 'Update some fields of a user (admin)',
  request: { params: userIdParamsSchema, body: jsonBody(updateUserBodySchema) },
  responses: {
    [HTTP_STATUS.OK]: dataResponse('The updated user', userComponent),
    [HTTP_STATUS.BAD_REQUEST]: invalidInputResponse,
    ...adminOnlyResponses,
    [HTTP_STATUS.NOT_FOUND]: userNotFound,
    [HTTP_STATUS.CONFLICT]: emailTaken,
  },
};

const deleteUser: RouteConfig = {
  ...ADMIN_ONLY,
  method: 'delete',
  path: USER_BY_ID_PATH,
  summary: 'Delete a user (admin)',
  request: { params: userIdParamsSchema },
  responses: {
    [HTTP_STATUS.NO_CONTENT]: emptyResponse('The user was deleted'),
    [HTTP_STATUS.BAD_REQUEST]: invalidInputResponse,
    ...adminOnlyResponses,
    [HTTP_STATUS.NOT_FOUND]: userNotFound,
  },
};

export const registerUsersDocs = (registry: OpenAPIRegistry) => {
  const routes = [listUsers, createUser, getUser, updateUser, deleteUser];
  routes.forEach((route) => registry.registerPath(route));
};
