import { faker } from '@faker-js/faker';
import { beforeAll, afterAll, describe, it, expect } from '@jest/globals';
import { createServer } from '@root/app';
import { config } from '@root/utils/config';
import { connectToDB, disconnectDB } from '@root/utils/db';
import { createToken } from '@root/utils/token/token';
import { Server } from 'http';
import request, { SuperTest, Test } from 'supertest';

let server: Server;
let supertest: SuperTest<Test>;

const newPassword = 'PasswordOk123';

const userToResetPassword = {
  id: '632820d2e912927de21cf2a8',
  username: 'dev_with_ari_08',
};

beforeAll(async () => {
  const app = createServer();
  server = app.listen(config.PORT);
  await connectToDB();
  supertest = request(app);
});

afterAll(async () => {
  await disconnectDB();
  server.close();
});

describe('Reset password route', () => {
  it('should return 403 when password is invalid', async () => {
    const { body, statusCode } = await supertest
      .post(`/api/user/reset-password/invalid_token`)
      .send({
        password: 'invalid_password',
      });
    expect(statusCode).toBe(403);
    expect(body).toMatchObject([
      {
        field: expect.stringContaining('password'),
        message: expect.stringContaining('password require'),
      },
    ]);
  });

  it("should return with status code 400 when token type is not equal to 'link'", async () => {
    const token = await createToken(
      faker.database.mongodbObjectId(),
      'refresh'
    );
    const { body, statusCode } = await supertest
      .post(`/api/user/reset-password/${token}`)
      .send({
        password: newPassword,
      });
    expect(statusCode).toBe(400);
    expect(body).toMatchObject({
      error: expect.stringContaining('invalid token'),
    });
  });

  it('should return with status code 404 when user not found', async () => {
    const token = await createToken(faker.database.mongodbObjectId(), 'link');
    const { body, statusCode } = await supertest
      .post(`/api/user/reset-password/${token}`)
      .send({
        password: newPassword,
      });
    expect(statusCode).toBe(404);
    expect(body).toMatchObject({
      error: expect.stringContaining('user not found'),
    });
  });

  it('should return with status code 200 request is successful', async () => {
    const token = await createToken(userToResetPassword.id, 'link');
    const { body, statusCode } = await supertest
      .post(`/api/user/reset-password/${token}`)
      .send({
        password: newPassword,
      });
    expect(statusCode).toBe(200);
    expect(body).toMatchObject({
      message: expect.stringContaining('congratulations'),
    });
  });
});

describe('Login Route', () => {
  it('should login with new password and return status code 200', async () => {
    const { statusCode } = await supertest.post('/api/user/login').send({
      identity: userToResetPassword.username,
      password: newPassword,
    });
    expect(statusCode).toBe(200);
  });
});
