import { describe, it, beforeAll, afterAll, expect } from '@jest/globals';
import { disconnectDB } from '@root/utils/db';
import { Server } from 'http';
import { SuperTest, Test } from 'supertest';
import { prepareTest } from '@chat-module/chat.helpers';

let authToken: string;
let server: Server;
let request: SuperTest<Test>;

beforeAll(async () => {
  const { server: sv, token, supertest } = await prepareTest();
  authToken = token;
  server = sv;
  request = supertest;
});

afterAll(async () => {
  await disconnectDB();
  server.close();
});

describe('send message route ', () => {
  it('should return 200 when initiate conversation', async () => {
    const { statusCode, body } = await request
      .post('/api/chat/message')
      .send({
        text: 'Hi there',
        toId: '6328a851545fdf211b9ebcfe',
        roomId: '',
      })
      .set('Authorization', authToken);

    console.log(JSON.stringify(body, null, 2));

    expect(statusCode).toBe(200);
  });
});
