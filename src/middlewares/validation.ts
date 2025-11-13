import type { NextFunction, Request, Response } from 'express';

import * as z from 'zod';

import { formatZodErrors } from '../utils/formatZodError.js';

export function validate(schema: z.ZodObject) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json(formatZodErrors(err));
      }

      next(err);
    }
  };
}
