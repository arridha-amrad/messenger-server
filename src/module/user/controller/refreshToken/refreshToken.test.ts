import { connectToDB, disconnectDB } from '@utils/db';
import { config } from '@utils/config';
import { Server } from 'http';
import { createServer } from '@root/app';
import { faker } from '@faker-js/faker';
import { createToken } from '@utils/token/token';
import { describe, beforeAll, afterAll, it, expect } from '@jest/globals';
import request, { SuperTest, Test } from 'supertest';

let superTest: SuperTest<Test>;
let server: Server;

let loginRefToken: string;

beforeAll(async () => {
   const app = createServer();
   await connectToDB();
   server = app.listen(config.PORT);
   superTest = request(app);
   const response = await superTest.post('/api/user/login').send({
      identity: 'dev_with_ari_08',
      password: 'Ok123blabla',
   });

   /*
   console.log('response header : ', response.header);

   response header :  {
      'x-powered-by': 'Express',
      'set-cookie': [
        'token=Bearer%20eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzI4MjBkMmU5MTI5MjdkZTIxY2YyYTgiLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTY2MzU4OTY1OSwiZXhwIjoxNjYzNjc2MDU5fQ.RZjgJuGrF9pJ88lB83Wo3RsR73BPv0-HWcOEXgv2oQl2hP0Pk0-Faw431yHrDT_olp7ACI3gYg3F35LA52wrwOD04Pt4i2JCtgOwD1N7HwP1HGqtpc8Y0H7uh7dPfXVk4SAOuj8HFn9r5ahCSkCbh99GJYwLErks_QimABWvHDQ; Max-Age=31536000; Path=/; Expires=Tue, 19 Sep 2023 12:14:19 GMT; HttpOnly; SameSite=Lax'
      ],
      'content-type': 'application/json; charset=utf-8',
      'content-length': '482',
      etag: 'W/"1e2-2CArgVoFYdbREGySe3yK9zd1Zbs"',
      date: 'Mon, 19 Sep 2022 12:14:19 GMT',
      connection: 'close'
    }
    */
   const tokenCookie = response.header['set-cookie'][0]
      .split(';')[0]
      .split('=')[1];
   loginRefToken = tokenCookie;
});

afterAll(async () => {
   server.close();
   await disconnectDB();
});

describe('Refresh Token route', () => {
   it('should return 403 when no refresh token included', async () => {
      const response = await superTest
         .get('/api/user/refresh-token')
         .set('Cookie', []); // no token-cookie included
      expect(response.statusCode).toBe(403);
      expect(response.body).toMatchObject({
         error: expect.stringContaining('ref token was not included'),
      });
   });

   it('should return 403 when token type in not refresh', async () => {
      const userId = faker.database.mongodbObjectId();
      const token = await createToken(userId, 'auth');
      const response = await superTest
         .get('/api/user/refresh-token')
         .set('Cookie', [`token=Bearer ${token}`]);
      expect(response.statusCode).toBe(403);
      expect(response.body).toMatchObject({
         error: expect.stringContaining('token invalid'),
      });
   });

   it('should return 403 when reuse detected or no user has the token', async () => {
      const userId = faker.database.mongodbObjectId();
      const token = await createToken(userId, 'refresh');
      const response = await superTest
         .get('/api/user/refresh-token')
         .set('Cookie', [`token=Bearer ${token}`]);
      expect(response.statusCode).toBe(403);
      expect(response.body).toMatchObject({
         error: expect.stringContaining('reuse detected'),
      });
   });

   it('should return 200 then refresh token and authToken renewed', async () => {
      const response = await superTest
         .get('/api/user/refresh-token')
         .set('Cookie', [`token=${loginRefToken}`]);
      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject({
         token: expect.stringContaining('Bearer'),
      });
      expect(response.header['set-cookie']).toMatchObject([
         expect.stringContaining('token=Bearer'),
      ]);
   });
});
