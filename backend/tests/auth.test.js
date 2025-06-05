const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');

describe('Auth API', () => {
  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should return 400 for invalid login', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'fake@example.com', password: 'wrong' });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Invalid credentials');
  });

  it('should return 400 for missing credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({});
    expect(res.statusCode).toBe(400);
  });
}); 