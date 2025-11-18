import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import passport from './config/passport.js';
import errorHandler from './middlewares/error.js';
import accountRouter from './routes/accountRouter.js';
import indexRouter from './routes/indexRouter.js';
import postRouter from './routes/postRouter.js';
import userRouter from './routes/userRouter.js';

const app = express();

const corsOptions = {
  origin: process.env.JWT_AUDIENCE,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded());
app.use(helmet());
app.use(cookieParser());

app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/api/account', accountRouter);
app.use('/api/posts', postRouter);
app.use('/api/users', userRouter);

app.use(errorHandler);

export default app;
