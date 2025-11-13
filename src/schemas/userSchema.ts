import * as z from 'zod';

import prisma from '../db/prisma.js';

export const userSignupSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, 'Username too short')
    .max(30, 'Username is too long')
    .superRefine((val, ctx) => {
      if (/\s/.test(val)) {
        ctx.addIssue({
          code: 'custom',
          message: `Username contains spaces`,
        });
      }

      if (/\W/.test(val)) {
        ctx.addIssue({
          code: 'custom',
          message: `Usernam contains special characters`,
        });
      }

      if (/([_])\1/.test(val)) {
        ctx.addIssue({
          code: 'custom',
          message: `Username contains double underscores`,
        });
      }

      if (/^[^a-zA-Z0-9]/.test(val)) {
        ctx.addIssue({
          code: 'custom',
          message: `Username starting character is non-alphanumeric`,
        });
      }
    })
    .refine(async (username) => {
      const user = await prisma.user.findFirst({
        where: { username: username.toLowerCase() },
      });
      return !user;
    }, 'Username already exists'),
  password: z
    .string()
    .min(8, 'Password is too short')
    .max(255, 'Password is too long'),
  name: z
    .string()
    .min(2, 'Provided name is too short')
    .max(255, 'Provided name is too long'),
});

export type UserSignupSchema = z.infer<typeof userSignupSchema>;

export const userLoginSchema = z.object({
  username: z.string().min(1, 'Username cannot be left empty'),
  password: z.string().min(1, 'Password cannot be left empty'),
});
