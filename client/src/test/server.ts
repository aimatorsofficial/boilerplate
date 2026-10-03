import { setupServer } from 'msw/node';
import { API_BASE_URL } from '../constants';

export const server = setupServer();

export const apiUrl = (path: string) => `${API_BASE_URL}${path}`;
