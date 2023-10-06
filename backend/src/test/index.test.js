/* eslint-disable no-undef */
const { app, } = require('../index.js',);
const { expect, } = require('chai',);
const request = require('supertest',);
// const fetchMock = require('fetch-mock');

describe('GET /api/weather', () => {
  // This data matches to mockapi JSON data
  const mockData1 = require('./weatherData1.json',);
  const mockData2 = require('./weatherData2.json',);

  // before(() => {
  //   // Read mock data from file and feed it to API function
  //   fetchMock.mock(`https://${mapURI}/forecast?q=${targetCity}&appid=${appId}`, {
  //     status: 200,
  //     body: mockData,
  //   });
  // });

  // after(() => {
  //   delete global.window;
  //   delete global.document;
  //   dom.window.close();
  //   fetchMock.restore();
  // });

  // Test that the API returns 200 OK
  it('responds with 200 OK', async () => {
    const response = await request(app.callback(),).get('/api/weather',);
    expect(response.status,).to.equal(200,);
  },);

  // Test that query without lat+long returns default data
  it('returns default weather data', async () => {
    const response = await request(app.callback(),).get('/api/weather',);
    expect(response.status,).to.equal(200,);
    expect(response.body,).to.deep.equal(mockData1,);
  },);

  // Test that query with lat+long returns lat+long-based data
  it('returns lat+long-based weather data', async () => {
    const response = await request(app.callback(),).get('/api/weather?&lat=60.1695&long=24.9355',);
    expect(response.status,).to.equal(200,);
    expect(response.body,).to.deep.equal(mockData2,);
  },);
},);
