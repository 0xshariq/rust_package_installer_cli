import request from 'supertest';


const BASE_URL = process.env.BASE_URL || 'http://localhost:8080';


describe('Go backend service', () => {
test('GET /health returns 200', async () => {
const res = await request(BASE_URL).get('/health');
expect(res.status).toBe(200);
});
});