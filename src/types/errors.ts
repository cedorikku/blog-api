export interface AuthenticationError extends Error {
  message: 'Unauthorized';
  status: 401;
}
