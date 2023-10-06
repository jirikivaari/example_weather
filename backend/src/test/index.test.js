/* eslint-disable no-undef */
import { app } from '../index.js';
import { expect } from 'chai';
import request from 'supertest';

// Import for JSON mock data
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// import fetchMock from 'fetch-mock';

describe('GET /api/weather', () => {
  // This data matches to mockapi JSON data
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const mockData1 = JSON.parse(fs.readFileSync(path.join(__dirname, 'weatherData1.json'), 'utf8'));
  const mockData2 = JSON.parse(fs.readFileSync(path.join(__dirname, 'weatherData2.json'), 'utf8'));

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
