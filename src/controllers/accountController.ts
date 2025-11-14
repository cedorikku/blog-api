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

  const token = jwt.sign(
    { userId: req.user.id }, // payload
    // secret key
    process.env.JWT_SECRET_KEY ||
    (() => {
      throw new Error('JWT_SECRET_KEY is not defined');
    })(),
    {
      // sign options
      algorithm: 'HS256',
      expiresIn: '2h', // TODO: Aim for longer expiration time
      issuer: process.env.JWT_ISSUER,
      audience: process.env.JWT_AUDIENCE,
    }
  );

  res.json({ token });
};

export default {
  signUpPost,
  loginPost,
};
