import type { Request, Response } from 'express';

import type { CreatePostSchema } from '../schemas/postSchema.js';

import prisma from '../db/prisma.js';
import slugify from '../utils/slugify.js';

const getAllPosts = async (req: Request, res: Response) => {
  const posts = await prisma.post.findMany();
  res.status(200).json(posts);
};

const getPublishedPosts = async (req: Request, res: Response) => {
  const published = await prisma.post.findMany({
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
      published: true,
    },
  });

  const posts = published.map((post) => ({
    ...post,
    tags: post.tags.map((t) => t.tag),
  }));

  res.status(200).json(posts);
};

const getPostById = async (req: Request, res: Response) => {
  res.status(200).json(req.post);
};

const createPost = async (req: Request, res: Response) => {
  const { title, content, tags, published }: CreatePostSchema = req.body;

  if (!req.user) {
    return res.sendStatus(401);
  }

  const newPost = await prisma.post.create({
    data: {
      title,
      content,
      published,
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
      slug: await slugify(title),
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
  await prisma.post.delete({
    where: { id: req.post!.id },
  });

  res.sendStatus(204);
};

const publishPost = async (req: Request, res: Response) => {
  const updatedPost = await prisma.post.update({
    where: { id: req.post!.id },
    data: { published: true },
  });

  res.status(200).json(updatedPost);
};

export default {
  getAllPosts,
  getPostById,
  createPost,
  deletePost,
  publishPost,
  getPublishedPosts,
};
