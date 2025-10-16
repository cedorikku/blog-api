import type { NextFunction, Request, Response } from 'express';

import * as z from 'zod';

export function validate(schema: z.ZodObject) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json(z.treeifyError(err));
      }

      next(err);
    }
  };
}
