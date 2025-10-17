import { Router } from 'express';

import postController from '../controllers/postController.js';
import { validate } from '../middlewares/validation.js';
import { createPostSchema } from '../schemas/postSchema.js';

const router = Router();

router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPostById);
router.post('/', validate(createPostSchema), postController.createPost);
router.delete('/:id', postController.deletePost);
// router.patch('/:id', postController.editPost)

export default router;
