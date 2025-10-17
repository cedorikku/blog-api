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
    return res.sendStatus(err.status);
  }

  res.sendStatus(500);
};

export default errorHandler;
