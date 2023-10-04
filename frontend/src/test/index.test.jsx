/* eslint-disable global-require */
import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
// import { shallow } from 'enzyme';
import {
  describe, it, before, after, beforeEach, afterEach,
} from 'mocha';
import { expect } from 'chai';
import { JSDOM } from 'jsdom';
import sinon from 'sinon';
import fetchMock from 'fetch-mock';
import { XPathResult } from 'xpath-react';

// global.document = JSDOM({
//  url: 'http://localhost:3000/',
// });

describe('Weather Component Testing', () => {
  let dom;
  let Weather;

  before(async () => {
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

    const mockData = require('./weatherData.json');
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

  let rootContainer;

  beforeEach(() => {
    rootContainer = document.createElement('div');
    document.body.appendChild(rootContainer);
  });

  afterEach(() => {
    document.body.removeChild(rootContainer);
    rootContainer = null;
  });

  it('Renders Hello World Title', async () => {
    act(() => {
      ReactDOM.render(<Weather />, rootContainer);
    });

    await new Promise((resolve) => setTimeout(resolve, 0));

    const element = document.evaluate('/html/body/container/row[1]/h1', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    expect(element.textContent).to.equal('Weather App');

    // const h1 = rootContainer.querySelectorAll('h1')[0];
    // expect(h1.textContent).to.equal('Weather App');

    // Check that the component is displaying the mock data
    // expect(wrapper.find('.temperature')).to.have.text('72°F');
    // expect(wrapper.find('.description')).to.have.text('Sunny');
  });
});

// describe('<Weather />', () => {
//     it('renders an h1 element with the text "Weather App"', () => {
//       const wrapper = shallow(React.createElement(Weather));
//       expect(wrapper.find('h1').text()).to.equal('Weather App');
//     });
//   });
