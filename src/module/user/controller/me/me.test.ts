import { beforeAll, afterAll, describe, it, expect } from '@jest/globals';
import { connectToDB, disconnectDB } from '@utils/db';
import { createServer } from '@root/app';
import { Server } from 'http';
import request, { SuperTest, Test } from 'supertest';
import { config } from '@root/utils/config';
import { faker } from '@faker-js/faker';
import { createToken } from '@root/utils/token/token';

let server: Server;
let supertest: SuperTest<Test>;
beforeAll(async () => {
  const app = createServer();
  server = app.listen(config.PORT);
  supertest = request(app);
  await connectToDB();
});

afterAll(async () => {
  server.close();
  await disconnectDB();
});

describe('Me Route', () => {
  it('should return status code 401 when no access token provided', async () => {
    const response = await supertest.get('/api/user/me');
    expect(response.statusCode).toBe(401);
  });

  it("should return status code 403 when token type is not equal to 'auth'", async () => {
    const userId = faker.database.mongodbObjectId();
    const token = await createToken(userId, 'link');
    const response = await supertest
      .get('/api/user/me')
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(403);
    expect(response.body).toMatchObject({
      error: expect.stringContaining('invalid token'),
    });
  });

  it('should return status code 404 when user not found', async () => {
    const userId = faker.database.mongodbObjectId();
    const token = await createToken(userId, 'auth');
    const response = await supertest
      .get('/api/user/me')
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(404);
    expect(response.body).toMatchObject({
      error: expect.stringContaining('User not found'),
    });
  });

  it('should return status code 200 when authorization header is provided and intended user found', async () => {
    const userId = '632820d2e912927de21cf2a8';
    const token = await createToken(userId, 'auth');
    const response = await supertest
      .get('/api/user/me')
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({
      user: {
        id: expect.any(String),
        email: expect.any(String),
        fullname: expect.any(String),
        imageURL: expect.any(String),
        username: expect.any(String),
      },
    });
  });
});
