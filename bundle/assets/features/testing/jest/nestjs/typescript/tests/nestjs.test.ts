// nestjs.test.js
import request from 'supertest';
import app from './main'; // Nest app

describe('NestJS App', () => {
  it('GET / should return 200', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
  });
});
