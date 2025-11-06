import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import passport from './config/passport.js';
import errorHandler from './middlewares/error.js';
import accountRouter from './routes/accountRouter.js';
import indexRouter from './routes/indexRouter.js';
import postRouter from './routes/postRouter.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
app.use(helmet());

app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/account', accountRouter);
app.use('/api/posts', postRouter);

app.use(errorHandler);

export default app;
