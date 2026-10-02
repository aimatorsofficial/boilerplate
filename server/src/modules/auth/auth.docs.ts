import type { OpenAPIRegistry, RouteConfig } from '@asteasolutions/zod-to-openapi';
import { API_PREFIX, API_ROUTES, HTTP_STATUS } from '../../constants/index.js';
import {
  bearerSecurity,
  dataResponse,
  emptyResponse,
  errorResponse,
  invalidInputResponse,
  jsonBody,
  signedInResponses,
} from '../../docs/openapi-responses.js';
import { userComponent } from '../users/users.docs.js';
import {
  loginBodySchema,
  refreshTokenBodySchema,
  registerBodySchema,
  tokenPairResponseSchema,
} from './auth.schema.js';

const { ROOT, REGISTER, LOGIN, REFRESH, LOGOUT, ME } = API_ROUTES.AUTH;
const AUTH_PATH = `${API_PREFIX}${ROOT}`;
const TAGS = ['Auth'];

const tokenPair = dataResponse('A new access and refresh token', tokenPairResponseSchema);
const tooManyRequests = errorResponse('Too many attempts (TOO_MANY_REQUESTS)');
const refreshTokenInvalid = errorResponse('Refresh token unknown, used or expired');

const register: RouteConfig = {
  method: 'post',
  path: `${AUTH_PATH}${REGISTER}`,
  tags: TAGS,
  summary: 'Create an account with the user role',
  request: { body: jsonBody(registerBodySchema) },
  responses: {
    [HTTP_STATUS.CREATED]: tokenPair,
    [HTTP_STATUS.BAD_REQUEST]: invalidInputResponse,
    [HTTP_STATUS.CONFLICT]: errorResponse('Email already used (EMAIL_TAKEN)'),
    [HTTP_STATUS.TOO_MANY_REQUESTS]: tooManyRequests,
  },
};

const login: RouteConfig = {
  method: 'post',
  path: `${AUTH_PATH}${LOGIN}`,
  tags: TAGS,
  summary: 'Log in with email and password',
  request: { body: jsonBody(loginBodySchema) },
  responses: {
    [HTTP_STATUS.OK]: tokenPair,
    [HTTP_STATUS.BAD_REQUEST]: invalidInputResponse,
    [HTTP_STATUS.UNAUTHORIZED]: errorResponse('Wrong email or password (INVALID_CREDENTIALS)'),
    [HTTP_STATUS.TOO_MANY_REQUESTS]: tooManyRequests,
  },
};

const refresh: RouteConfig = {
  method: 'post',
  path: `${AUTH_PATH}${REFRESH}`,
  tags: TAGS,
  summary: 'Swap a refresh token for a new token pair (the old one stops working)',
  request: { body: jsonBody(refreshTokenBodySchema) },
  responses: {
    [HTTP_STATUS.OK]: tokenPair,
    [HTTP_STATUS.BAD_REQUEST]: invalidInputResponse,
    [HTTP_STATUS.UNAUTHORIZED]: refreshTokenInvalid,
    [HTTP_STATUS.TOO_MANY_REQUESTS]: tooManyRequests,
  },
};

const logout: RouteConfig = {
  method: 'post',
  path: `${AUTH_PATH}${LOGOUT}`,
  tags: TAGS,
  summary: 'Revoke a refresh token',
  request: { body: jsonBody(refreshTokenBodySchema) },
  responses: {
    [HTTP_STATUS.NO_CONTENT]: emptyResponse('The refresh token no longer works'),
    [HTTP_STATUS.BAD_REQUEST]: invalidInputResponse,
  },
};

const me: RouteConfig = {
  method: 'get',
  path: `${AUTH_PATH}${ME}`,
  tags: TAGS,
  security: bearerSecurity,
  summary: 'Get the signed-in user',
  responses: {
    [HTTP_STATUS.OK]: dataResponse('The signed-in user', userComponent),
    ...signedInResponses,
    [HTTP_STATUS.NOT_FOUND]: errorResponse('The account was deleted (USER_NOT_FOUND)'),
  },
};

export const registerAuthDocs = (registry: OpenAPIRegistry) => {
  const routes = [register, login, refresh, logout, me];
  routes.forEach((route) => registry.registerPath(route));
};
