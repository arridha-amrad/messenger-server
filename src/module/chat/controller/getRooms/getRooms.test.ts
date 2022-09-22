import { Server } from 'http';
import { SuperTest, Test } from 'supertest';

import { closeTest, prepareTest } from '@chat-module/chat.helpers';
import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';

let server: Server;
let request: SuperTest<Test>;
let authToken: string;

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
      .get('/api/chat/rooms')
      .set('Authorization', authToken);
    expect(statusCode).toBe(200);
    console.log(JSON.stringify(body, null, 2));
  });
});
