import 'axios';

declare module 'axios' {
  interface InternalAxiosRequestConfig {
    retriedAfterRefresh?: boolean;
  }
}
