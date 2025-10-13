import type { Strategy } from 'passport';
import type {
  StrategyOptionsWithoutRequest,
  VerifyCallback,
} from 'passport-jwt';
import type { VerifyFunction } from 'passport-local';

import bcrypt from 'bcryptjs';
import passport from 'passport';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';

import prisma from '../db/prisma.js';

const localCallback: VerifyFunction = async (username, password, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { username: username },
    });

    if (!user) {
      return done(null, false, { message: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return done(null, false, { message: 'Invalid credentials' });
    }

    return done(null, user);
  } catch (err) {
    return done(err);
  }
};

// TODO: (low) Replace in production
const jwtOptions: StrategyOptionsWithoutRequest = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey:
    process.env.JWT_SECRET_KEY ||
    (() => {
      throw new Error('JWT_SECRET_KEY is not defined');
    })(),
  issuer: 'http://localhost:5000',
  audience: 'http://localhost:5000',
};

const jwtCallback: VerifyCallback = async (jwt_payload, done) => {
  try {
    const id: number = jwt_payload.userId;

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return done(null, false);
    }

    return done(null, user);
  } catch (err) {
    return done(err, false);
  }
};

const localStrategy: Strategy = new LocalStrategy(localCallback);
const jwtStrategy: Strategy = new JwtStrategy(jwtOptions, jwtCallback);

passport.use('local', localStrategy);
passport.use('jwt', jwtStrategy);

export default passport;
