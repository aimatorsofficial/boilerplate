import type { OpenAPIRegistry, RouteConfig } from '@asteasolutions/zod-to-openapi';
import { API_PREFIX, API_ROUTES, HTTP_STATUS } from '../../constants/index.js';
import {
  dataResponse,
  emptyResponse,
  errorResponse,
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

const TAGS = ['Users'];
const USERS_PATH = `${API_PREFIX}${API_ROUTES.USERS.ROOT}`;
const USER_BY_ID_PATH = toOpenApiPath(`${USERS_PATH}${API_ROUTES.USERS.BY_ID}`);

const userComponent = userResponseSchema.meta({ id: 'User' });

const invalidInput = errorResponse('Invalid input (VALIDATION_FAILED)');
const userNotFound = errorResponse('User not found (USER_NOT_FOUND)');
const emailTaken = errorResponse('Email already used (EMAIL_TAKEN)');

const listUsers: RouteConfig = {
  method: 'get',
  path: USERS_PATH,
  tags: TAGS,
  summary: 'List users, newest first',
  request: { query: listUsersQuerySchema },
  responses: {
    [HTTP_STATUS.OK]: listResponse('A page of users', userComponent),
    [HTTP_STATUS.BAD_REQUEST]: invalidInput,
  },
};

const createUser: RouteConfig = {
  method: 'post',
  path: USERS_PATH,
  tags: TAGS,
  summary: 'Create a user',
  request: { body: jsonBody(createUserBodySchema) },
  responses: {
    [HTTP_STATUS.CREATED]: dataResponse('The created user', userComponent),
    [HTTP_STATUS.BAD_REQUEST]: invalidInput,
    [HTTP_STATUS.CONFLICT]: emailTaken,
  },
};

const getUser: RouteConfig = {
  method: 'get',
  path: USER_BY_ID_PATH,
  tags: TAGS,
  summary: 'Get one user',
  request: { params: userIdParamsSchema },
  responses: {
    [HTTP_STATUS.OK]: dataResponse('The user', userComponent),
    [HTTP_STATUS.BAD_REQUEST]: invalidInput,
    [HTTP_STATUS.NOT_FOUND]: userNotFound,
  },
};

const updateUser: RouteConfig = {
  method: 'patch',
  path: USER_BY_ID_PATH,
  tags: TAGS,
  summary: 'Update some fields of a user',
  request: { params: userIdParamsSchema, body: jsonBody(updateUserBodySchema) },
  responses: {
    [HTTP_STATUS.OK]: dataResponse('The updated user', userComponent),
    [HTTP_STATUS.BAD_REQUEST]: invalidInput,
    [HTTP_STATUS.NOT_FOUND]: userNotFound,
    [HTTP_STATUS.CONFLICT]: emailTaken,
  },
};

const deleteUser: RouteConfig = {
  method: 'delete',
  path: USER_BY_ID_PATH,
  tags: TAGS,
  summary: 'Delete a user',
  request: { params: userIdParamsSchema },
  responses: {
    [HTTP_STATUS.NO_CONTENT]: emptyResponse('The user was deleted'),
    [HTTP_STATUS.BAD_REQUEST]: invalidInput,
    [HTTP_STATUS.NOT_FOUND]: userNotFound,
  },
};

export const registerUsersDocs = (registry: OpenAPIRegistry) => {
  const routes = [listUsers, createUser, getUser, updateUser, deleteUser];
  routes.forEach((route) => registry.registerPath(route));
};
