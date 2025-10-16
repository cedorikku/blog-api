import * as z from 'zod';

export const userSignupSchema = z.object({
  username: z
    .string()
    .min(3, 'Username too short')
    .max(255, 'Username is too long'),
  password: z
    .string()
    .min(8, 'Password is too short')
    .max(255, 'Password is too long'),
  name: z
    .string()
    .min(2, 'Provided name is too short')
    .max(255, 'Provided name is too long'),
});

export const userLoginSchema = z.object({
  username: z.string().min(1, 'Username cannot be left empty'),
  password: z.string().min(1, 'Password cannot be left empty'),
});
