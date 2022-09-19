import { createToken } from '@utils/token/token';
import { describe, it, beforeAll, afterAll, expect } from '@jest/globals';
import { Server } from 'http';
import { Express } from 'express';
import request, { SuperTest, Test } from 'supertest';

import { connectToDB, disconnectDB } from '@utils/db';
import { createServer } from '@root/app';

let app: Express;
let server: Server;
let supertest: SuperTest<Test>;
let authtoken: string;
let refToken: string;

beforeAll(async () => {
   app = createServer();
   server = app.listen(5001);
   await connectToDB();
   supertest = request(app);
   const { body, header } = await supertest.post('/api/user/login').send({
      identity: 'dev_with_ari_08',
      password: 'Ok123blabla',
   });
   authtoken = body.token;
   const cookieToken = header['set-cookie'][0].split(';')[0].split('=')[1];
   refToken = cookieToken;
   authtoken = await createToken('632820d2e912927de21cf2a8', 'auth');
});

afterAll(async () => {
   server.close();
   await disconnectDB();
});

describe('Logout route', () => {
   it('should return with status code 200', async () => {
      const response = await request(app)
         .get('/api/user/logout')
         .set('Cookie', [`token=${refToken}`])
         .set('Authorization', `${authtoken}`);
      expect(response.statusCode).toBe(200);
      expect(response.text).toMatch('logout success');
      const cookie = response.header['set-cookie'][0].split(';')[0] as string;
      expect(cookie).toEqual('token=');
   });
});
