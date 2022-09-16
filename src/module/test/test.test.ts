import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { sum } from './test.services';
import request from 'supertest';
import { Express } from 'express';
import { createServer } from '../../app';
import { Server } from 'http';

let app: Express;
let server: Server;

beforeAll(() => {
    app = createServer();
    server = app.listen(5000);
});

afterAll(() => {
    server.close();
});

describe('sum number', () => {
    it('should sum the arguments', () => {
        expect(sum(2, 3)).toBe(5);
    });
});

describe('test routes', () => {
    it('should return with status code 200 and body Test Routes', async () => {
        const response = await request(app).get('/api/test');
        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject({ message: 'Test Routes' });
    });
});
