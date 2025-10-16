/* eslint-disable @typescript-eslint/no-explicit-any */

export function isAuthenticationError(err: any): err is AuthenticationError {
  return (
    err && typeof err.status === 'number' && err.name === 'AuthenticationError'
  );
}

import type { AuthenticationError } from '../types/errors.js';
export function isStringArray(arr: unknown[]): arr is string[] {
  return arr.every((item) => typeof item === 'string');
}
