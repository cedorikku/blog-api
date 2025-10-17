import type { Request, Response } from 'express';

import type { CreatePostSchema } from '../schemas/postSchema.js';

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
        connectOrCreate: {
          create: {
            username: req.user.username,
            password: req.user.password,
            name: req.user.name,
          },
          where: { id: req.user.id },
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
