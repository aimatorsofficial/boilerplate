import type { AuthContext } from '../modules/auth/auth.schema.js';

declare global {
  namespace Express {
    interface Request {
      auth?: AuthContext;
    }
  }
}
