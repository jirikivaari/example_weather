import React from 'react';
import ReactDOM from 'react-dom';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Accordion from 'react-bootstrap/Accordion';
import Stack from 'react-bootstrap/Stack';

const baseURL = process.env.ENDPOINT;

const getWeatherFromApi = async (lat, long) => {
  let response;

  try {
    if (lat && long) {
      response = await fetch(`${baseURL}/weather?lat=${lat}&long=${long}`);
    } else {
      response = await fetch(`${baseURL}/weather`);
    }
    return response.json();
  } catch (error) {
    console.error(error);
  }

  return {};
};

class Weather extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      weather: {},
    };
  }

  async componentDidMount() {
    let crd;

    // This could be wrapped in async+await structure
    navigator.geolocation.getCurrentPosition(async (pos) => {
      crd = pos.coords;

      const weather = await getWeatherFromApi(crd.latitude, crd.longitude);

      // Fetch the weather data from backend
      this.setState({
        weather,
      });

      console.log("Your current position is:");
      console.log(`Latitude : ${crd.latitude}`);
      console.log(`Longitude: ${crd.longitude}`);
      console.log(`More or less ${crd.accuracy} meters.`);
    },
    async (err) => {
      const weather = await getWeatherFromApi(crd.latitude, crd.longitude);
      // Fetch the weather data from backend
      this.setState({
        weather,
      });

      console.warn(`ERROR(${err.code}): ${err.message}`);
    },
    {
      enableHighAccuracy: true,
      timeout: 60000,
      maximumAge: 0,
    });
  }

  render() {
    const { weather } = this.state;

    return (
      <Stack gap={3}>
        { weather.list && weather.list.slice(0, 5).map((e, i) => (
          <div className="p-2">
            <h3>
              { weather.city.name }
              &nbsp;-&nbsp;
              { e.dt_txt }
            </h3>
            { e.weather[0].main }
            &nbsp;
            { <img src={`/img/${e.weather[0].icon.slice(0, -1)}.svg`} alt="Weather icon" width="15" height="15" /> }
            <br />
            Temperature:&nbsp;
            { e.main.temp }
            &nbsp;
            (
            { e.main.temp_min }
            -
            { e.main.temp_max }
            )
            <br />
            Wind:&nbsp;
            { e.wind.speed }
            &nbsp; m/s
          </div>
        )) }
      </Stack>
    );
  }
}

ReactDOM.render(
  <Weather />,
  document.getElementById('app'),
);
