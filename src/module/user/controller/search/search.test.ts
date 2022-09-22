import { connectToDB, disconnectDB } from '@utils/db';
import { Server } from 'http';
import { config } from '@root/utils/config';
import { createServer } from '@root/app';
import { beforeAll, afterAll, describe, it, expect } from '@jest/globals';
import request, { SuperTest, Test } from 'supertest';

let supertest: SuperTest<Test>;
let server: Server;

beforeAll(async () => {
  const app = createServer();
  supertest = request(app);
  server = app.listen(config.PORT);
  await connectToDB();
});

afterAll(async () => {
  server.close();
  await disconnectDB();
});

describe('search route', () => {
  it('should return 200 with users', async () => {
    const key = 'alex';
    const { body, statusCode } = await supertest
      .get('/api/user/search')
      .send({ key });
    expect(statusCode).toBe(200);
    console.log(body);

    expect(body).toMatchObject({
      users: expect.arrayContaining([
        {
          _id: expect.any(String),
          username: expect.any(String),
          imageURL: expect.any(String),
          fullname: expect.any(String),
        },
      ]),
    });
  });
});
