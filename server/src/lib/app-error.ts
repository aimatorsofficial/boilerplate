import { ERROR_STATUS, type ErrorCode, type HttpStatus } from '../constants/index.js';

export interface ErrorDetail {
  path: string;
  code: string;
}

export class AppError extends Error {
  readonly code: ErrorCode;
  readonly status: HttpStatus;
  readonly details?: ErrorDetail[];

  constructor(code: ErrorCode, details?: ErrorDetail[]) {
    super(code);
    this.name = 'AppError';
    this.code = code;
    this.status = ERROR_STATUS[code];
    this.details = details;
  }
}
