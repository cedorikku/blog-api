import cors from 'cors';
import express from 'express';

import indexRouter from './routes/indexRouter.js';
import postRouter from './routes/postRouter.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

app.use('/', indexRouter);
app.use('/api/posts', postRouter);

export default app;
