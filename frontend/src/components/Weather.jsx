import React from 'react';

// React components from Bootstrap
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Stack from 'react-bootstrap/Stack';

// Function to fetch the weather data from backend
import getWeatherFromApi from '../lib/api';

/* global window */
/* eslint no-undef: "error" */

class Weather extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // Store weather data. JSON converted to JS object
      weather: {},
      // Status variable for robot testing
      isLoading: true,
    };
  }

  async componentDidMount() {
    // Location coordinates of the user
    let crd;

    // This could be wrapped in async+await structure
    /* global navigator */
    navigator.geolocation.getCurrentPosition(async (pos) => {
      crd = pos.coords;

      // Get weather data from backend and store for the view
      const weather = await getWeatherFromApi(crd.latitude, crd.longitude);
      this.setState({
        weather,
      });

      // Debug data
      /* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
      // console.log('Your current position is:');
      // console.log(`Latitude : ${crd.latitude}`);
      // console.log(`Longitude: ${crd.longitude}`);
      // console.log(`More or less ${crd.accuracy} meters.`);
    },
    async (err) => {
      // Get weather data from backend and store for the view
      const weather = await getWeatherFromApi();
      this.setState({
        weather,
      });

      console.warn(`ERROR(${err.code}): ${err.message}`);
    },
    {
      enableHighAccuracy: false,
      timeout: 20000,
      maximumAge: 0,
    });

    // Set isLoading for robot testing
    setTimeout(() => {
      this.setState({ isLoading: false });
    }, 2000);
  }

  componentDidUpdate() {
    const { isLoading } = this.state;
    if (!isLoading) {
      window.appStatus = true;
    }
  }

  render() {
    const { weather } = this.state;

    // Iterate over the weather data and show it in the view
    return (
      <Stack className="weatherData" gap={3}>
        {weather && weather.list && weather.list.slice(0, 5).map((e) => (
          <div className="p-1 weatherItem" key={`weather-${e.dt}`}>
            <Container className="bg-light bg-gradient rounded p-2">
              <Row>
                <Col>
                  <h3>
                    {weather.city.name}
                    &nbsp;-&nbsp;
                    {e.dt_txt}
                  </h3>
                </Col>
              </Row>
              <Row>
                <Col>
                  {e.weather[0].main}
                  &nbsp;
                  {<img className="weatherIcon" src={`/img/${e.weather[0].icon.slice(0, -1)}.svg`} alt="Weather icon" width="15" height="15" />}
                  <br />
                  Temp.:&nbsp;
                  <span className="temp">
                    {e.main.temp}
                  </span>
                  &#8451;
                  &nbsp;
                  (
                  {e.main.temp_min}
                  -
                  {e.main.temp_max}
                  &#8451;)
                  <br />
                  Wind:&nbsp;
                  <span className="wind">
                    {e.wind.speed}
                  </span>
                  &nbsp; m/s
                </Col>
                <Col>
                  Humidity:&nbsp;
                  {e.main.humidity}
                  %
                  <br />
                  Rain in 1h:&nbsp;
                  {e.rain && e.rain['3h'] ? e.rain['1h'] : 0 }
                  mm
                  <br />
                  Probab. of precipitation:&nbsp;
                  {e.pop}
                  %
                </Col>
              </Row>
            </Container>
          </div>
        ))}
      </Stack>
    );
  }
}

// Export for testing
export default Weather;
