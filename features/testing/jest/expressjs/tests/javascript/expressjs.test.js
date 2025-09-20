import request from 'supertest';


const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';


describe('ExpressJS app', () => {
test('GET /status returns 200', async () => {
const res = await request(BASE_URL).get('/status');
expect(res.status).toBe(200);
});
});