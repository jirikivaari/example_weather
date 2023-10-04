const app = require('../index.js');
const { expect } = require('chai');
const request = require('supertest');

describe('GET /api/weather', () => {
  it('responds with 200 OK', async () => {
    const response = await request(app.callback()).get('/api/weather');
    expect(response.status).to.equal(200);
  });
});
