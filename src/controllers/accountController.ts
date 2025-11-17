import type { NextFunction, Request, Response } from 'express';
import type { JwtPayload } from 'jsonwebtoken';

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

  const refreshKey = process.env.JWT_REFRESH_KEY;
  if (!refreshKey) throw new Error('JWT_REFRESH_KEY is not defined');

  const accessKey = process.env.JWT_ACCESS_KEY;
  if (!accessKey) throw new Error('JWT_ACCESS_KEY is not defined');

  const refreshToken = jwt.sign({ userId: req.user.id }, refreshKey, {
    // sign options
    algorithm: 'HS256',
    expiresIn: '30d',
    issuer: process.env.JWT_ISSUER,
    audience: process.env.JWT_AUDIENCE,
    // domain: ''
  });

  const accessToken = jwt.sign({ userId: req.user.id }, accessKey, {
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

const logout = (req: Request, res: Response) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/account/refresh',
  });

  return res.sendStatus(204);
};

const refresh = (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken as string;
  const refreshKey = process.env.JWT_REFRESH_KEY;
  if (!refreshKey) throw new Error('JWT_REFRESH_KEY is not defined');

  try {
    const payload = jwt.verify(refreshToken, refreshKey) as JwtPayload;
    const userId = payload.userId;

    const accessKey = process.env.JWT_ACCESS_KEY;
    if (!accessKey) throw new Error('JWT_ACCESS_KEY is not defined');

    const newAccessToken = jwt.sign({ userId }, accessKey, {
      algorithm: 'HS256',
      expiresIn: '20m',
      issuer: process.env.JWT_ISSUER,
      audience: process.env.JWT_AUDIENCE,
    });

    return res.status(200).json({ accessToken: newAccessToken });
  } catch {
    return res.sendStatus(401);
  }
};

export default {
  signUpPost,
  loginPost,
  logout,
  refresh,
};
