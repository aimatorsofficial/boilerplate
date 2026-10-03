import { API_PATHS } from '../../constants';
import { apiClient } from '../../lib/api-client';
import { readData } from '../../lib/api-response';
import { tokenPairSchema } from '../../lib/token-store';
import { userSchema } from '../users/users.schema';

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput extends LoginInput {
  name: string;
}

export const authApi = {
  async register(input: RegisterInput) {
    const response = await apiClient.post(API_PATHS.REGISTER, input);
    return readData(tokenPairSchema, response.data);
  },

  async login(input: LoginInput) {
    const response = await apiClient.post(API_PATHS.LOGIN, input);
    return readData(tokenPairSchema, response.data);
  },

  async logout(refreshToken: string) {
    await apiClient.post(API_PATHS.LOGOUT, { refreshToken });
  },

  async fetchCurrentUser() {
    const response = await apiClient.get(API_PATHS.ME);
    return readData(userSchema, response.data);
  },
};
