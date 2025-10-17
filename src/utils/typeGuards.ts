/* eslint-disable @typescript-eslint/no-explicit-any */

export function isAuthenticationError(err: any): err is AuthenticationError {
  return (
    err && typeof err.status === 'number' && err.name === 'AuthenticationError'
  );
}

import type { AuthenticationError } from '../types/errors.js';
