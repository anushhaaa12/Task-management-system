const request = require('supertest');
const app = require('../src/app');

describe('Tasks API', () => {
  it('should return 401 if not authenticated', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.statusCode).toBe(401);
  });
}); 