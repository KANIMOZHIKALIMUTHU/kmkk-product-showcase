const request = require('supertest');
const app = require('../index');

describe('Products API', () => {
  test('GET /api/products returns products', async () => {
    const res = await request(app)
      .get('/api/products')
      .expect(200);
    
    expect(res.body.products).toBeInstanceOf(Array);
    expect(res.body.total).toBeGreaterThan(0);
  });
});
