import type { NextFunction, Request, Response } from 'express';
import type { AuthenticateCallback } from 'passport';

import passport from '../config/passport.js';

const auth = passport.authenticate('jwt', {
  session: false,
  failWithError: true,
});

export default auth;

export const authAllowGuest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const cb: AuthenticateCallback = (err, user) => {
    if (err) {
      return next(err);
    }

    req.user = user ? user : undefined;
    next();
  };

  return passport.authenticate('jwt', { session: false }, cb)(req, res, next);
};
