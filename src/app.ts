import 'dotenv';
import express from 'express';
import TestRoute from './module/test/test.routes';
import UserRoute from './module/user/user.routes';

export const createServer = (): express.Express => {
    const app = express();

    app.use(express.json());

    app.use('/api/test', TestRoute);
    app.use('/api/user', UserRoute);

    return app;
};
