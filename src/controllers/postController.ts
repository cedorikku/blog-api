import type { Request, Response } from 'express';

import type { CreatePostSchema } from '../schemas/postSchema.js';

import prisma from '../db/prisma.js';

const getAllPosts = async (req: Request, res: Response) => {
  const posts = await prisma.post.findMany();
  res.status(200).json(posts);
};

const getPostById = async (req: Request, res: Response) => {
  const postId = parseInt(req.params.id);
  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) return res.sendStatus(404);

  res.status(200).json(post);
};

const createPost = async (req: Request, res: Response) => {
  const { title, content, tags }: CreatePostSchema = req.body;

  if (!req.user) {
    return res.sendStatus(401);
  }

  const newPost = await prisma.post.create({
    data: {
      title,
      content,
      author: {
        connect: { id: req.user.id },
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
    include: {
      author: {
        select: {
          id: true,
          username: true,
          name: true,
        },
      },
      tags: {
        select: {
          id: true,
          tag: {
            select: { id: true, name: true },
          },
        },
      },
    },
  });

  res.status(201).json(newPost);
};

const deletePost = async (req: Request, res: Response) => {
  const postId = parseInt(req.params.id);
  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) return res.sendStatus(404);

  await prisma.post.delete({
    where: { id: postId },
  });

  res.sendStatus(204);
};

// TODO: (low) Editing Posts

export default {
  getAllPosts,
  getPostById,
  createPost,
  deletePost,
};
