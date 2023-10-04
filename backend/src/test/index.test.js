const { app, appId, mapURI, targetCity } = require('../index.js');
const { expect } = require('chai');
const request = require('supertest');
// const fetchMock = require('fetch-mock');
// const fetch = require('node-fetch');

describe('GET /api/weather', () => {
  const mockData1 = require('./weatherData1.json');
  const mockData2 = require('./weatherData2.json');

  before(() => {
    // Read mock data from file and feed it to API function
    // fetchMock.mock(`https://${mapURI}/forecast?q=${targetCity}&appid=${appId}`, {
    //   status: 200,
    //   body: mockData,
    // });
  });

  after(() => {
    // delete global.window;
    // delete global.document;
    // dom.window.close();
    // fetchMock.restore();
  });

  it('responds with 200 OK', async () => {
    const response = await request(app.callback()).get('/api/weather');
    expect(response.status).to.equal(200);
  });

  it('returns default weather data', async () => {
    const response = await request(app.callback()).get('/api/weather');
    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal(mockData1);
  });

  it('returns lat+long-based weather data', async () => {
    const response = await request(app.callback()).get('/api/weather?&lat=60.1695&long=24.9355');
    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal(mockData2);
  });
});