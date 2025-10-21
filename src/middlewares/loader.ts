import type { NextFunction, Request, Response } from 'express';

import prisma from '../db/prisma.js';

export const loadPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const postId = parseInt(req.params.id);

  if (isNaN(postId)) return res.sendStatus(400);

  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) return res.sendStatus(404);

  req.post = post;
  next();
};
