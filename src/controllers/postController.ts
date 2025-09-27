import type { Request, Response } from 'express';

import prisma from '../db/prisma.js';

const getAllPosts = async (req: Request, res: Response) => {
  const posts = await prisma.post.findMany();
  res.status(200).json(posts);
};

const getPostById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  const posts = await prisma.post.findUnique({
    where: { id: id },
  });
  res.status(200).json(posts);
};

function isStringArray(arr: unknown[]): arr is string[] {
  return arr.every((item) => typeof item === 'string');
}

const createPost = async (req: Request, res: Response) => {
  // HACK: replace soon with real user
  const userId = 1;
  const { title, content, tags } = req.body;

  // HACK: Temporary validation for these endpoints
  if (!title.trim()) {
    return res.status(400).send("Ensure that title isn't empty.");
  } else if (!content.trim()) {
    return res.status(400).send("Ensure that content isn't empty.");
  } else if (!Array.isArray(tags) || !isStringArray(tags)) {
    return res
      .status(400)
      .send('Tags must be defined and formatted in an array of strings');
  }

  const newPost = await prisma.post.create({
    data: {
      title,
      content,
      author: {
        // HACK: replace soon with real user
        connectOrCreate: {
          create: {
            username: 'test',
            password: 'testPassword',
          },
          where: { id: userId },
        },
      },
      tags: {
        create: tags.map((tagName) => ({
          tag: {
            connectOrCreate: {
              where: { name: tagName },
              create: { name: tagName },
            },
          },
        })),
      },
    },
  });

  res.status(201).json(newPost);
};

const deletePost = async (req: Request, res: Response) => {
  const postId = parseInt(req.params.id);
  const { title } = await prisma.post.delete({
    where: { id: postId },
  });

  res.send(204).send(`The post "${title}" has been successfully deleted`);
};

// TODO: (low) Editing Posts

export default {
  getAllPosts,
  getPostById,
  createPost,
  deletePost,
};
