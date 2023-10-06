const Koa = require('koa',);
const router = require('koa-router',)();
const fetch = require('node-fetch',);
const cors = require('kcors',);

// API key for OpenWeatherMap API
const appId = process.env.APPID || '1234567890';

// Set API depending on environment
let mapURI;
if (process.env.MAP_ENDPOINT) {
  mapURI = process.env.MAP_ENDPOINT;
} else if (process.env.NODE_ENV === 'test') {
  mapURI = 'http://localhost:9100/data/2.5';
} else {
  mapURI = 'http://api.openweathermap.org/data/2.5';
}
console.debug(`OpenWeatherMap API URL: ${mapURI}`,);

// Secondary variables
const targetCity = process.env.TARGET_CITY || 'Helsinki,fi';
const port = process.env.PORT || 9000;

const app = new Koa();

app.use(cors(),);

// Function to fetch forecast data from OpenWeatherMap API
// ARGUMENTS: lat, string, latitude of the location
//           long, string, longitude of the location
// RETURNS: object, weather data object
const fetchForecast = async (lat, long,) => {
  let endpoint;

  // Check and validate location data
  if (lat && long && /^[0-9]{1,3}\.[0-9]{1,15}$/.test(lat,) && /^[0-9]{1,3}\.[0-9]{1,15}$/.test(long,)) {
    endpoint = `${mapURI}/forecast?lat=${lat}&lon=${long}&units=metric&appid=${appId}`;
  // If no location data, use default location
  } else {
    endpoint = `${mapURI}/forecast?q=${targetCity}&appid=${appId}`;
  }
  console.debug(`fetchForecast: ${endpoint}`,);
  const response = await fetch(endpoint,);

  return response ? response.json() : {};
};

// Function to fetch weather data from OpenWeatherMap API, returns JSON data
// eslint-disable-next-line comma-dangle
router.get('/api/weather', async ctx => {
  const { lat, long, } = ctx.query;
  const weatherData = await fetchForecast(lat, long,);

  ctx.type = 'application/json; charset=utf-8';
  ctx.body = weatherData;
},);

app.use(router.routes(),);
app.use(router.allowedMethods(),);

app.listen(port,);

// Needed for testing
module.exports = { app, appId, mapURI, targetCity, };

console.log(`Backend listening on port ${port}`,);
