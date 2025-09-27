import { Router } from 'express';

import postController from '../controllers/postController.js';

const router = Router();

router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPostById);
router.post('/', postController.createPost)
router.delete('/:id', postController.deletePost)
// router.patch('/:id', postController.editPost)

export default router;
