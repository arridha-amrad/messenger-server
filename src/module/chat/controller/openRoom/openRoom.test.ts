import { Server } from 'http';
import { SuperTest, Test } from 'supertest';

import { closeTest, prepareTest } from '@chat-module/chat.helpers';
import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';

let server: Server;
let request: SuperTest<Test>;
let authToken: string;

const ROOM_ID = '632c378ef10a8195e63b8d2d';

beforeAll(async () => {
  const { server: sv, supertest, token } = await prepareTest();
  authToken = token;
  server = sv;
  request = supertest;
});

afterAll(async () => {
  await closeTest(server);
});

describe('Get Room route', () => {
  it('should return 200', async () => {
    const { statusCode, body } = await request
      .get(`/api/chat/room/${ROOM_ID}`)
      .set('Authorization', authToken);
    expect(statusCode).toBe(200);
    console.log(JSON.stringify(body, null, 2));
  });
});
