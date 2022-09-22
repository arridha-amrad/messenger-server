import morgan from 'morgan';

import cookieParser from 'cookie-parser';
import express from 'express';

import UserRoutes from '@user-module/user.routes';
import ChatRoutes from '@chat-module/chat.routes';

export const createServer = (): express.Express => {
  const app = express();

  app.use(express.json());
  app.use(cookieParser());
  app.use(morgan('dev'));

  app.use('/api/user', UserRoutes);
  app.use('/api/chat', ChatRoutes);

  return app;
};
