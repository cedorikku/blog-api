import type {
  Post,
  User as PrismaUser,
} from './generated/prisma-client/client.js';

declare global {
  namespace Express {
    interface Request {
      post?: Post;
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface User extends PrismaUser {}
  }
}
