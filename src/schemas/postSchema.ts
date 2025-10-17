import * as z from 'zod';

export const createPostSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title cannot be empty')
    .max(50, 'Title can only be 50 characters long'),
  content: z.string().trim().min(1, 'Post content cannot be empty'),
  tags: z
    .array(z.string().trim())
    .min(1, 'Should have at least 1 tag value')
    .superRefine((val, ctx) => {
      if (val.length !== new Set(val).size) {
        ctx.addIssue({
          code: 'custom',
          message: 'No duplicates allowed',
          input: val,
        });
      }
    }),
});

export type CreatePostSchema = z.infer<typeof createPostSchema>;
