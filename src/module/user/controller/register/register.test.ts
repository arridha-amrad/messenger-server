import { describe, it, beforeAll, afterAll, expect } from '@jest/globals';
import { Server } from 'http';
import { Express } from 'express';
import request from 'supertest';
import { faker } from '@faker-js/faker';

import { connectToDB, disconnectDB } from '@utils/db';
import { createServer } from '@root/app';

let app: Express;
let server: Server;

beforeAll(async () => {
   app = createServer();
   server = app.listen(5001);
   await connectToDB();
});

afterAll(async () => {
   server.close();
   await disconnectDB();
});

describe('register controller', () => {
   const mainBody = {
      email: faker.internet.email(),
      username: faker.internet.userName().toLowerCase().replace(/\./g, '_'),
      password: 'MyPower123',
      firstname: faker.name.firstName(),
      lastname: faker.name.lastName(),
   };
   it('should return 400 when email is invalid', async () => {
      const body = {
         ...mainBody,
         email: 'invalid email',
      };
      const response = await request(app).post('/api/user/register').send(body);
      expect(response.statusCode).toBe(400);
      expect(response.body).toMatchObject([
         {
            field: expect.stringMatching('email'),
            message: expect.stringContaining('email'),
         },
      ]);
   });

   it('should return 400 when username is invalid ', async () => {
      const body = {
         ...mainBody,
         username: 'invalidusername.',
      };

      const response = await request(app).post('/api/user/register').send(body);
      expect(response.statusCode).toBe(400);
      expect(response.body).toMatchObject([
         {
            field: expect.stringMatching('username'),
            message: expect.stringContaining('username'),
         },
      ]);
   });

   it('should return 400 when password is invalid ', async () => {
      const body = {
         ...mainBody,
         password: 'invalid password',
      };
      const response = await request(app).post('/api/user/register').send(body);
      expect(response.statusCode).toBe(400);
      expect(response.body).toMatchObject([
         {
            field: expect.stringMatching('password'),
            message: expect.stringContaining('password'),
         },
      ]);
   });

   it('should return 400 when password or username or email is in invalid ', async () => {
      const body = {
         ...mainBody,
         email: 'invalid email',
         username: 'invalid username',
         password: 'invalid password',
      };

      const response = await request(app).post('/api/user/register').send(body);
      expect(response.statusCode).toBe(400);
      expect(response.body).toMatchObject([
         {
            field: expect.stringMatching('username'),
            message: expect.stringContaining('username'),
         },
         {
            field: expect.stringMatching('email'),
            message: expect.stringContaining('email'),
         },
         {
            field: expect.stringMatching('password'),
            message: expect.stringContaining('password'),
         },
      ]);
   });

   it('should return with status code 201 when input valid', async () => {
      const body = {
         ...mainBody,
      };
      const response = await request(app).post('/api/user/register').send(body);
      expect(response.statusCode).toBe(201);
      expect(response.body).toMatchObject({
         message: expect.stringContaining('An email has been sent'),
      });
   });

   it("should return with status code 403 and json {error: ''} when duplicated email is detected", async () => {
      const body = {
         ...mainBody,
         username: 'alexdoexxx',
         email: 'xxx.xxx.test@test.test',
      };
      const response = await request(app).post('/api/user/register').send(body);
      expect(response.statusCode).toBe(403);
      expect(response.body).toMatchObject({
         error: expect.stringContaining('email already registered'),
      });
   });

   it("should return with status code 403 and json {error: ''} when duplicated username is detected", async () => {
      const body = {
         ...mainBody,
         username: 'alexdoe',
         email: 'xxx@test.test',
      };
      const response = await request(app).post('/api/user/register').send(body);
      expect(response.statusCode).toBe(403);
      expect(response.body).toMatchObject({
         error: expect.stringContaining('username already registered'),
      });
   });
});
