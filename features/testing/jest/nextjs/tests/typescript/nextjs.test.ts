import request from 'supertest';


const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';


describe('Next.js app', () => {
test('GET /api/health returns 200', async () => {
const res = await request(BASE_URL).get('/api/health');
expect(res.status).toBe(200);
});
});