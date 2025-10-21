import { Router } from 'express';

import postController from '../controllers/postController.js';
import auth, { authAllowGuest } from '../middlewares/auth.js';
import { loadPost } from '../middlewares/loader.js';
import { permitAction, PostAction } from '../middlewares/postPermissions.js';
import { validate } from '../middlewares/validation.js';
import { createPostSchema } from '../schemas/postSchema.js';

const router = Router();

router.get('/', postController.getAllPosts);

router.get(
  '/:id',
  authAllowGuest,
  loadPost,
  permitAction(PostAction.View),
  postController.getPostById
);

router.post('/', auth, validate(createPostSchema), postController.createPost);

router.delete(
  '/:id',
  auth,
  loadPost,
  permitAction(PostAction.Delete),
  postController.deletePost
);

// router.patch('/:id', postController.editPost)

export default router;
