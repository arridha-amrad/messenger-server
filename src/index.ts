import { createServer } from './app';
import { config } from './utils/config';
import { connectToDB } from './utils/db';

const port = config.PORT;

const startServer = async (): Promise<void> => {
    const app = createServer();

    await connectToDB();

    app.listen(port);
};

startServer()
    .then(() => {
        console.log(`express server is running from port : ${port}`);
    })
    .catch((err) => console.log('failed to run server : ', err));
