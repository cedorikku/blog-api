import type { NextFunction, Request, Response } from 'express';

export enum PostAction {
  View,
  Edit,
  Delete,
}

  // NOTE: Doesn't consider admin permissions yet
export const permitAction  = (action: PostAction) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const post = req.post!;

    if (post.authorId === req.user?.id) {
      return next();
    }

    if (action === PostAction.View) {
      if (!post.published) {
        return res.sendStatus(404);
      }
    }

    next();
  };
};
