import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const envFile =
  process.env.NODE_ENV !== 'production' ? '.env.dev' : '.env.prod';

dotenv.config({
  path: path.resolve(__dirname, '..', envFile),
});
