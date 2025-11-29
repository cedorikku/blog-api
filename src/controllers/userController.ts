import type { Request, Response } from 'express';

import prisma from '../db/prisma.js';

const checkUsernameAvailability = async (req: Request, res: Response) => {
  const { username } = req.params;

  const user = await prisma.user.findUnique({
    where: { username: username.trim().toLowerCase() },
  });

  res.status(200).json({ availability: !user });
};

const getPostsByUsername = async (req: Request, res: Response) => {
  const username = req.params.username;

  const user = await prisma.user.findUnique({
    where: { username: username.trim().toLowerCase() },
  });

  if (!user) {
    res.sendStatus(404);
  }

  // Based on who's requesting
  const requestingUser = req.user ?? null;

  let posts = [];
  if (requestingUser && requestingUser.username === username) {
    posts = await prisma.post.findMany({
      select: {
        id: true,
        title: true,
        createdAt: true,
        modifiedAt: true,
        slug: true,
        author: {
          select: { username: true, name: true },
        },
        tags: {
          select: {
            tag: {
              select: { id: true, name: true },
            },
          },
        },
        published: true,
      },
      where: {
        author: { username },
      },
    });
  } else {
    posts = await prisma.post.findMany({
      select: {
        id: true,
        title: true,
        createdAt: true,
        modifiedAt: true,
        slug: true,
        author: {
          select: { username: true, name: true },
        },
        tags: {
          select: {
            tag: {
              select: { id: true, name: true },
            },
          },
        },
      },
      where: {
        author: { username },
        published: true,
      },
    });
  }

  posts = posts.map((post) => ({
    ...post,
    tags: post.tags.map((t) => t.tag),
  }));

  res.status(200).json({ user, posts });
};

export default {
  checkUsernameAvailability,
  getPostsByUsername,
};
