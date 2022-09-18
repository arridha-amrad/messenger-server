import 'dotenv';

import cookieParser from 'cookie-parser';
import express from 'express';

import TestRoute from './module/test/test.routes';
import UserRoute from './module/user/user.routes';

export const createServer = (): express.Express => {
   const app = express();

   app.use(express.json());
   app.use(cookieParser());

   app.use('/api/test', TestRoute);
   app.use('/api/user', UserRoute);

   return app;
};
