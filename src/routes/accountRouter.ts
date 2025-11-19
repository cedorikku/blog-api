import { Router } from 'express';
import passport from 'passport';

import accountController from '../controllers/accountController.js';
import { validate } from '../middlewares/validation.js';
import { userLoginSchema, userSignupSchema } from '../schemas/userSchema.js';

const router = Router();

router.post(
  '/signup',
  validate(userSignupSchema),
  accountController.signUpPost
);

router.post(
  '/login',
  validate(userLoginSchema),
  passport.authenticate('local', { session: false }),
  accountController.loginPost
);

router.post('/logout', accountController.logout);

router.get('/refresh', accountController.refresh);

export default router;
