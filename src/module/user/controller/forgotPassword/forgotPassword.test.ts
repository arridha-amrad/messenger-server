import request from 'supertest';
import { config } from '@utils/config';
import { createServer } from '@root/app';
import { disconnectDB } from '@utils/db';
import { Server } from 'http';
import { beforeAll, afterAll, describe, it, expect } from '@jest/globals';
import { connectToDB } from '@root/utils/db';
import { Express } from 'express';

let server: Server;
let app: Express;
beforeAll(async () => {
   await connectToDB();
   app = createServer();
   server = app.listen(config.PORT);
});
afterAll(async () => {
   await disconnectDB();
   server.close();
});

describe('Forgot Password route', () => {
   // this is verified user
   const mainBody = {
      email: 'Katheryn_Hauck@yahoo.com',
   };

   it('should reutrn with status code 403 when email is invalid', async () => {
      const body = {
         email: 'invalid email',
      };
      const response = await request(app)
         .post('/api/user/forgot-password')
         .send(body);
      expect(response.statusCode).toBe(403);
      expect(response.body).toMatchObject([
         {
            field: expect.stringMatching('email'),
            message: expect.stringContaining('email'),
         },
      ]);
   });

   it("should return 404 with error: 'user not found' when no corresponding user found", async () => {
      const body = {
         email: 'klsjdsakdjas@sdj.sd',
      };
      const response = await request(app)
         .post('/api/user/forgot-password')
         .send(body);
      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
         error: expect.stringContaining('user not found'),
      });
   });

   it("should return 400 with  error: 'please verify your email' when user account is not verified", async () => {
      const body = {
         email: 'Bernardo30@gmail.com',
      };
      const response = await request(app)
         .post('/api/user/forgot-password')
         .send(body);
      expect(response.statusCode).toBe(400);
      expect(response.body).toMatchObject({
         error: expect.stringContaining('please verify your email'),
      });
   });

   it("should return 400 with error: 'your account is created with different strategy' when user is verified but created with google strategy", async () => {
      const body = {
         email: 'Clifford_Durgan@google.com',
      };
      const response = await request(app)
         .post('/api/user/forgot-password')
         .send(body);
      expect(response.statusCode).toBe(400);
      expect(response.body).toMatchObject({
         error: expect.stringContaining(
            'your account is created with different strategy'
         ),
      });
   });

   it('should return 200', async () => {
      const response = await request(app)
         .post('/api/user/forgot-password')
         .send(mainBody);
      expect(response.statusCode).toBe(200);
   });
});
