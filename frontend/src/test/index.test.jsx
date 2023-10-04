/* eslint-disable global-require */

// React-related imports
import React from 'react';
import { render, act } from '@testing-library/react';
// import { shallow } from 'enzyme';

// Testing libraries
import {
  describe, it, before, after, beforeEach, afterEach,
} from 'mocha';
import { expect } from 'chai';

// Used for mocking functions
import sinon from 'sinon';
import fetchMock from 'fetch-mock';

// DOM-related imports
import { JSDOM } from 'jsdom';
import { XPathResult } from 'xpath';

describe('Weather Component Testing', () => {
  let dom;
  let Weather;

  before(async () => {
    // Create a fake DOM because these globals do not exist in Node
    dom = await JSDOM.fromURL('http://localhost:8000');
    global.window = dom.window;
    global.document = dom.window.document;
    global.navigator = dom.window.navigator;

    // Stub the navigator.geolocation.getCurrentPosition method
    // Create a mock navigator object with a mock getCurrentPosition method
    global.navigator = {
      geolocation: {
        getCurrentPosition: sinon.stub().callsArgWith(0, {
          coords: { latitude: 37.7749, longitude: -122.4194 },
        }),
      },
    };

    // Mock backend requests
    const mockData = require('./weatherData1.json');
    fetchMock.mock('*', {
      status: 200,
      body: mockData,
    });

    // const stub = sinon.stub(global.navigator.geolocation, 'getCurrentPosition');
    // stub.callsArgWith(0, { coords: { latitude: 37.7749, longitude: -122.4194 } });
    // stub.callsArgWith(1, { message: 'User denied geolocation' });

    // The component is imported here because window needs to be defined.
    Weather = require('../components/Weather').default;
  });

  after(() => {
    // delete global.window;
    // delete global.document;
    // dom.window.close();
    fetchMock.restore();
  });

  beforeEach(() => {
  });

  afterEach(async () => {
    // Let microtasks run and complete
    await new Promise((resolve) => setTimeout(resolve, 0));
  });

  it('Index has correct header', async () => {
    act(() => {
      render(<Weather />);
    });

    const element = document.evaluate('/html/body/container/row[1]/h1', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    expect(element.textContent).to.equal('Weather App');
  });

  it('Has first weather item', async () => {
    await act(async () => {
      render(<Weather />);
    });

    const element = document.evaluate('//*[contains(@class, "weatherData")]/div/div[1]/div/div[1]/h3', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    expect(element.textContent).contains('Helsinki');
  });

  it('Has correct weather data', async () => {
    await act(async () => {
      render(<Weather />);
    });

    const temp = document.evaluate('//*[contains(@class, "weatherData")]/div/div[1]/div/div[1]/*[contains(@class, "temp")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    expect(temp.textContent).contains('9.74');

    const wind = document.evaluate('//*[contains(@class, "weatherData")]/div/div[1]/div/div[1]/*[contains(@class, "wind")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    expect(wind.textContent).contains('3.98');
  });

  it('Has correct number of weather items', async () => {
    await act(async () => {
      render(<Weather />);
    });

    const weatherData = document.querySelector('.weatherData');
    const items = weatherData.querySelectorAll('div.weatherItem');

    expect(items.length).to.equal(5);
  });

  it('Has required weather icons', async () => {
    await act(async () => {
      render(<Weather />);
    });

    const weatherData = document.querySelector('.weatherData');
    const items = weatherData.querySelectorAll('img.weatherIcon');

    expect(items.length).to.equal(5);
  });
});

// describe('<Weather />', () => {
//     it('renders an h1 element with the text "Weather App"', () => {
//       const wrapper = shallow(React.createElement(Weather));
//       expect(wrapper.find('h1').text()).to.equal('Weather App');
//     });
//   });
