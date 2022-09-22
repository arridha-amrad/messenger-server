import { closeTest } from './../../chat.helpers';
import { IMessage } from '@chat-module/chat.types';
import { describe, it, beforeAll, afterAll, expect } from '@jest/globals';
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
  await closeTest(server);
});

describe('send message route ', () => {
  let roomId: string;
  it('should return 200 when initiate conversation', async () => {
    const {
      statusCode,
      body,
    }: { statusCode: number; body: { message: IMessage } } = await request
      .post('/api/chat/message')
      .send({
        text: 'Hi there',
        toId: '6328a851545fdf211b9ebcfe',
        roomId: roomId ?? '',
      })
      .set('Authorization', authToken);

    roomId = body.message.room.toString();

    expect(statusCode).toBe(200);
  });

  it('should return 200 when roomId provided', async () => {
    const { statusCode }: { statusCode: number; body: IMessage } = await request
      .post('/api/chat/message')
      .send({
        text: 'How r you',
        toId: '6328a851545fdf211b9ebcfe',
        roomId: roomId ?? '',
      })
      .set('Authorization', authToken);

    // console.log(JSON.stringify(body, null, 2));

    expect(statusCode).toBe(200);
  });
});
