import type { NextFunction, Request, Response } from 'express';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import type { UserSignupSchema } from '../schemas/userSchema.js';

import prisma from '../db/prisma.js';

const signUpPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password, name }: UserSignupSchema = req.body;

    const passwordHash = await bcrypt.hash(password, 14);
    await prisma.user.create({
      data: {
        username: username.trim().toLowerCase(),
        password: passwordHash,
        name,
      },
    });

    res.status(201).json({ username, name });
  } catch (err) {
    next(err);
  }
};

const loginPost = async (req: Request, res: Response) => {
  if (!req.user) return res.sendStatus(401);

  const key = process.env.JWT_SECRET_KEY;
  if (!key) {
    throw new Error('JWT_SECRET_KEY is not defined');
  }

  const refreshToken = jwt.sign({ userId: req.user.id }, key, {
    // sign options
    algorithm: 'HS256',
    expiresIn: '30d',
    issuer: process.env.JWT_ISSUER,
    audience: process.env.JWT_AUDIENCE,
    // domain: ''
  });

  const accessToken = jwt.sign({ userId: req.user.id }, key, {
    algorithm: 'HS256',
    expiresIn: '20m',
    issuer: process.env.JWT_ISSUER,
    audience: process.env.JWT_AUDIENCE,
    // domain: ''
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days * 24 hours * 60 minutes * 60 seconds * 1000 ms
    path: '/account/refresh',
  });

  res.status(200).json({ accessToken });
};

export default {
  signUpPost,
  loginPost,
};
