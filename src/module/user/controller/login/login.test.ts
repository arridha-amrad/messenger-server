import { connectToDB, disconnectDB } from '@utils/db';
import { createServer } from '@root/app';
import request from 'supertest';
import { describe, it, beforeAll, afterAll, expect } from '@jest/globals';
import { Express } from 'express';
import { Server } from 'http';

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

describe('Login route', () => {
  const mainBody = {
    identity: 'dummy_username',
    password: 'wrong_password',
  };

  it('should return with status code 400 when identity is empty', async () => {
    const body = {
      ...mainBody,
      identity: '',
    };
    const response = await request(app).post('/api/user/login').send(body);
    expect(response.statusCode).toBe(400);
    expect(response.body).toMatchObject([
      {
        field: expect.stringContaining('identity'),
        message: expect.stringContaining('username or email'),
      },
    ]);
  });

  it('should return with status code 400 when password is empty', async () => {
    const body = {
      ...mainBody,
      password: '',
    };
    const response = await request(app).post('/api/user/login').send(body);
    expect(response.statusCode).toBe(400);
    expect(response.body).toMatchObject([
      {
        field: expect.stringContaining('password'),
        message: expect.stringContaining('password'),
      },
    ]);
  });

  it('should return with status code 404 when user not found', async () => {
    const body = {
      ...mainBody,
    };
    const response = await request(app).post('/api/user/login').send(body);
    expect(response.statusCode).toBe(404);
    expect(response.body).toMatchObject({
      error: expect.stringContaining('user not found'),
    });
  });

  it('should return with status code 400 when user found but not verified', async () => {
    const body = {
      ...mainBody,
      identity: 'alexdoe',
    };
    const response = await request(app).post('/api/user/login').send(body);
    expect(response.statusCode).toBe(400);
    expect(response.body).toMatchObject({
      error: expect.stringContaining('please verify your email before login'),
    });
  });

  it('should return with status code 400 when user is verified but registered with google', async () => {
    const body = {
      ...mainBody,
      identity: 'Clifford_Durgan@google.com',
    };
    const response = await request(app).post('/api/user/login').send(body);
    expect(response.statusCode).toBe(400);
    expect(response.body).toMatchObject({
      error: expect.stringContaining(
        'this account is registered with different strategy'
      ),
    });
  });

  it('should return with status code 400 when password not match', async () => {
    const body = {
      ...mainBody,
      identity: 'dev_with_ari_08',
    };
    const response = await request(app).post('/api/user/login').send(body);
    expect(response.statusCode).toBe(400);
    expect(response.body).toMatchObject({
      error: expect.stringContaining('password not match'),
    });
  });

  it('should return with status code 200 when user is verified, found, and password matched', async () => {
    const body = {
      identity: 'alexdoe12',
      password: 'MyPower123',
    };
    const response = await request(app).post('/api/user/login').send(body);
    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({
      token: expect.any(String),
      user: expect.objectContaining({
        id: expect.any(String),
        username: expect.any(String),
        email: expect.any(String),
        fullname: expect.any(String),
        imageURL: expect.any(String),
      }),
    });
    expect(response.header['set-cookie']).toMatchObject([
      expect.stringContaining('token='),
    ]);
  });
});
