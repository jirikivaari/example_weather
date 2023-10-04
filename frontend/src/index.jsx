import React from 'react';
import ReactDOM from 'react-dom';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
// import Accordion from 'react-bootstrap/Accordion';
import Stack from 'react-bootstrap/Stack';

const baseURL = process.env.ENDPOINT;

window.appStatus = false;

const updateStatus = () => {
  window.appStatus = true;
};

const getWeatherFromApi = async (lat, long) => {
  let response;

  try {
    if (lat && long) {
      response = await fetch(`${baseURL}/weather?lat=${lat}&long=${long}`);
    } else {
      response = await fetch(`${baseURL}/weather`);
    }
    const data = await response.json();
    if (data) {
      return data;
    }
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
      isLoading: true,
    };
  }

  async componentDidMount() {
    let crd;

    // This could be wrapped in async+await structure
    /* global navigator */
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
      const weather = await getWeatherFromApi();

      // Fetch the weather data from backend
      this.setState({
        weather,
      });

      console.warn(`ERROR(${err.code}): ${err.message}`);
    },
    {
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 0,
    });

    setTimeout(() => {
      this.setState({ isLoading: false });
    }, 2000);
  }

  componentDidUpdate() {
    if (!this.state.isLoading) {
      updateStatus();
    }
  }

  render() {
    const { weather } = this.state;

    return (
      <Stack gap={3}>
        { weather && weather.list && weather.list.slice(0, 5).map((e) => (
          <div className="p-2" key={`${e.dt}`}>
            <Container>
              <Row>
                <Col>
                  <h3>
                    { weather.city.name }
                    &nbsp;-&nbsp;
                    { e.dt_txt }
                  </h3>
                </Col>
              </Row>
              <Row>
                <Col>
                  { e.weather[0].main }
                  &nbsp;
                  { <img src={`/img/${e.weather[0].icon.slice(0, -1)}.svg`} alt="Weather icon" width="15" height="15" /> }
                  <br />
                  Temp.:&nbsp;
                  { e.main.temp }
                  &#8451;
                  &nbsp;
                  (
                  { e.main.temp_min }
                  -
                  { e.main.temp_max }
                  &#8451;)
                  <br />
                  Wind:&nbsp;
                  { e.wind.speed }
                  &nbsp; m/s
                </Col>
                <Col>
                  Extra information
                </Col>
              </Row>
            </Container>
          </div>
        )) }
      </Stack>
    );
  }
}

ReactDOM.render(
  <Weather updateStatus={updateStatus} />,
  document.getElementById('app'),
);

export default Weather;
