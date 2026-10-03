import { API_PATHS, PAGINATION } from '../../constants';
import { apiClient } from '../../lib/api-client';
import { readPage } from '../../lib/api-response';
import { userSchema } from './users.schema';

export const usersApi = {
  async list(page: number) {
    const response = await apiClient.get(API_PATHS.USERS, {
      params: { page, limit: PAGINATION.PAGE_SIZE },
    });
    return readPage(userSchema, response.data);
  },
};
