import { createServer } from '@root/app';
import { config } from '@root/utils/config';
import { connectToDB } from '@root/utils/db';
import { Server } from 'http';
import request, { SuperTest, Test } from 'supertest';

export interface IPrepareTest {
  server: Server;
  token: string;
  supertest: SuperTest<Test>;
}

export const prepareTest = async (): Promise<IPrepareTest> => {
  const app = createServer();
  const server = app.listen(config.PORT);
  await connectToDB();
  const supertest = request(app);
  const { body } = await supertest.post('/api/user/login').send({
    identity: 'dev_with_ari_08',
    password: 'PasswordOk123',
  });
  const token = body.token;
  return {
    server,
    token,
    supertest,
  };
};
