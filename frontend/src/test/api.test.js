// Testing libraries
import {
  describe, it, afterEach,
} from 'mocha';
import { expect } from 'chai';

// Used for mocking functions
import fetchMock from 'fetch-mock';

// Function to fetch the weather data from backend
import getWeatherFromApi from '../lib/api';

import mockData1 from './weatherData1.json';
import mockData2 from './weatherData2.json';

describe('API Library Testing', () => {
  afterEach(async () => {
    fetchMock.restore();

    // Let microtasks run and complete
    await new Promise((resolve) => {
      setTimeout(resolve, 0);
    });
  });

  it('Returns correct data without arguments', async () => {
    // Mock backend requests
    fetchMock.mock('*', {
      status: 200,
      body: mockData1,
    });

    const weather = await getWeatherFromApi();
    expect(weather).to.have.property('list');
    expect(weather.list).to.be.an('array');
    expect(weather.list).to.have.lengthOf(40);
  });

  it('Returns correct data with arguments', async () => {
    // Mock backend requests
    fetchMock.mock('*', {
      status: 200,
      body: mockData2,
    });

    const weather = await getWeatherFromApi('60.1695', '24.9355');
    expect(weather).to.have.property('list');
    expect(weather.list).to.be.an('array');
    expect(weather.list).to.have.lengthOf(40);
    expect(weather.list[0].main.temp).to.be.equal(282.2);
  });

  it('Calls the correct backend API without args', async () => {
    fetchMock.mock('*', {
      status: 200,
      body: {},
    });

    await getWeatherFromApi();

    // Check if a fetch call was made with the expected URL using regexp
    const fetchCalls = fetchMock.calls();
    const pattern = /^http:\/\/localhost:9000\/api\/weather$/;
    const callMade = fetchCalls.some((call) => pattern.test(call[0]));
    // eslint-disable-next-line no-unused-expressions
    expect(callMade).to.be.true;
  });

  it('Calls the correct backend API with args', async () => {
    fetchMock.mock('*', {
      status: 200,
      body: {},
    });

    await getWeatherFromApi('60.1695', '24.9355');

    // Check if a fetch call was made with the expected URL using regexp
    const fetchCalls = fetchMock.calls();
    const pattern = /^http:\/\/localhost:9000\/api\/weather\?lat=60.1695&long=24.9355$/;
    const callMade = fetchCalls.some((call) => pattern.test(call[0]));
    // eslint-disable-next-line no-unused-expressions
    expect(callMade).to.be.true;
  });
});

// describe('<Weather />', () => {
//     it('renders an h1 element with the text "Weather App"', () => {
//       const wrapper = shallow(React.createElement(Weather));
//       expect(wrapper.find('h1').text()).to.equal('Weather App');
//     });
//   });
