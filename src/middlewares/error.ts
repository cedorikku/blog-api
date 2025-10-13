import type { NextFunction, Request, Response } from 'express';

import { isAuthenticationError } from '../utils/typeGuards.js';

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  if (isAuthenticationError(err)) {
    return res.status(err.status).json({ message: err.message });
  }

  res.sendStatus(500);
};

export default errorHandler;
