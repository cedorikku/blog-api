import { Router } from 'express';

import userController from '../controllers/userController.js';
import { authAllowGuest } from '../middlewares/auth.js';

const router = Router();

router.get('/:username/check', userController.checkUsernameAvailability);
router.get('/:username/posts', authAllowGuest, userController.getPostsByUsername);

export default router;
