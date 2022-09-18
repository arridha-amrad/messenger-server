import { Express } from 'express';
import { Server } from 'http';
import request from 'supertest';

import { faker } from '@faker-js/faker';
import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import { connectToDB, disconnectDB } from '@utils/db';
import { createToken } from '@utils/token/token';

import { createServer } from '@root/app';
import { config } from '@utils/config';
import { findUserByIdAndUpdate } from '@user-module/user.services';

let app: Express;
let server: Server;

beforeAll(async () => {
   await connectToDB();
   app = createServer();
   server = app.listen(config.PORT);
});

afterAll(async () => {
   await findUserByIdAndUpdate('6324896b279f6bd1c23cba0a', {
      isVerified: false,
   });
   await disconnectDB();
   server.close();
});

describe('Email verification controller', () => {
   it('should return status 400 when token type is not link', async () => {
      const userId = faker.database.mongodbObjectId();
      const token = await createToken(userId, 'refresh');
      const response = await request(app).get(
         `/api/user/email-verification/${token}`
      );
      expect(response.statusCode).toBe(400);
      expect(response.text).toEqual('<p>Your token is invalid</p>');
   });

   it('should return status 404 when user not found', async () => {
      const userId = faker.database.mongodbObjectId();
      const token = await createToken(userId, 'link');
      const response = await request(app).get(
         `/api/user/email-verification/${token}`
      );
      expect(response.statusCode).toBe(404);
      expect(response.text).toEqual('<p>User not found</p>');
   });

   it('should return 200 when email verification is successfull', async () => {
      // unverified user id
      const userId = '6324896b279f6bd1c23cba0a';
      const token = await createToken(userId, 'link');
      const response = await request(app).get(
         `/api/user/email-verification/${token}`
      );
      expect(response.statusCode).toBe(200);
      expect(response.text).toMatch(/Verification successful/i);
   });

   it('should return 400 when user already verified', async () => {
      const userId = '6324896b279f6bd1c23cba0a';
      const token = await createToken(userId, 'link');
      const response = await request(app).get(
         `/api/user/email-verification/${token}`
      );
      expect(response.statusCode).toBe(400);
      expect(response.text).toEqual('<p>Your email has been verified</p>');
   });
});
