// express.test.js
import request from 'supertest';
import app from '../index'; // change path to your Express app

describe('Express App', () => {
  it('GET / should return 200', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
  });
});
