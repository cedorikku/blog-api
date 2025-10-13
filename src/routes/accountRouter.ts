import { Router } from 'express';
import passport from 'passport';

import accountController from '../controllers/accountController.js';

const router = Router();

router.post('/signup', accountController.signUpPost);
router.post(
  '/login',
  passport.authenticate('local', { session: false }),
  accountController.loginPost
);

export default router;
