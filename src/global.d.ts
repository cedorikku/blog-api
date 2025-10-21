import type { User as PrismaUser } from '@prisma/client';
import type { Post } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      post?: Post;
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface User extends PrismaUser {}
  }
}
