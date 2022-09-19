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
      console.info({
         status: 'server is running',
         port: `${port}`,
         env: `${config.NODE_ENV}`,
      });
   })
   .catch((err) => console.log('failed to run server : ', err));
