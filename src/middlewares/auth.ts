import passport from '../config/passport.js';

const auth = passport.authenticate('jwt', {
  session: false,
  failWithError: true,
});

export default auth;
