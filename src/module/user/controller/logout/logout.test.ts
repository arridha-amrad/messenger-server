import { createToken } from '@utils/token/token';
import { describe, it, beforeAll, afterAll, expect } from '@jest/globals';
import { Server } from 'http';
import { Express } from 'express';
import request from 'supertest';

import { connectToDB, disconnectDB } from '@utils/db';
import { createServer } from '@root/app';

let app: Express;
let server: Server;
let authtoken: string;
let refToken: string;

// eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzI4MjBkMmU5MTI5MjdkZTIxY2YyYTgiLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTY2MzU3NjUwNiwiZXhwIjoxNjYzNjYyOTA2fQ.gXwuQxnf1PZfy0vmojSmhraK3RVZKcW7Y6T2-_niynSvLafmClxSrRqbMCc831AszHr9U4W2ju2QVu8bSnYj3V0lh8rtVK9U-buA_jGDilyO_VeuV69dp5y9ybi6Myu-2Yp5g7aNWEM4JZ8el5usjPjRGlY0W-bYJahoeiXbAgU

beforeAll(async () => {
   app = createServer();
   server = app.listen(5001);
   await connectToDB();
   authtoken = await createToken('632820d2e912927de21cf2a8', 'auth');
   refToken =
      'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzI4MjBkMmU5MTI5MjdkZTIxY2YyYTgiLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTY2MzU3NjUwNiwiZXhwIjoxNjYzNjYyOTA2fQ.gXwuQxnf1PZfy0vmojSmhraK3RVZKcW7Y6T2-_niynSvLafmClxSrRqbMCc831AszHr9U4W2ju2QVu8bSnYj3V0lh8rtVK9U-buA_jGDilyO_VeuV69dp5y9ybi6Myu-2Yp5g7aNWEM4JZ8el5usjPjRGlY0W-bYJahoeiXbAgU';
});

afterAll(async () => {
   server.close();
   await disconnectDB();
});

describe('Logout route', () => {
   it('should logout the user', async () => {
      const response = await request(app)
         .get('/api/user/logout')
         .set('Cookie', [`token=Bearer ${refToken}`])
         .set('Authorization', `Bearer ${authtoken}`);
      expect(response.statusCode).toBe(200);
      expect(response.text).toMatch('logout success');
      const cookie = response.header['set-cookie'][0].split(';')[0] as string;
      expect(cookie).toEqual('token=');
   });
});
