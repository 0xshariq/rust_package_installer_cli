import request from 'supertest';


const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';


describe('AngularJS app', () => {
test('GET /health returns 200', async () => {
const res = await request(BASE_URL).get('/health');
expect(res.status).toBe(200);
});
});