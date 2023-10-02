const debug = require('debug',)('weathermap',);

const Koa = require('koa',);
const router = require('koa-router',)();
const fetch = require('node-fetch',);
const cors = require('kcors',);

const appId = process.env.APPID || '';
const mapURI = process.env.MAP_ENDPOINT || 'http://api.openweathermap.org/data/2.5';
const geoURI = 'http://api.openweathermap.org/geo/1.0';
const targetCity = process.env.TARGET_CITY || 'Helsinki,fi';
const cityLimit = 1;

const port = process.env.PORT || 9000;

const app = new Koa();

app.use(cors(),);

const fetchWeather = async () => {
  const endpoint = `${mapURI}/weather?q=${targetCity}&appid=${appId}`;
  const response = await fetch(endpoint,);

  return response ? response.json() : {};
};

const fetchCityCoords = async (lat, long,) => {
  const endpoint = `${geoURI}/reverse?lat=${lat}&lon=${long}&limit=${cityLimit}&appid=${appId}`;
  const response = await fetch(endpoint,);

  return response && await response.json()[0] ? [response.json()[0].lat, response.json()[0].lon] : [60.1695, 24.9355];
};

const fetchForecast = async (lat, long,) => {
  let endpoint;

  // Check and validate location data
  if (lat && long && /^[0-9]{1,3}\.[0-9]{1,15}$/.test(lat,) && /^[0-9]{1,3}\.[0-9]{1,15}$/.test(long,)) {
    // [cityLat, cityLong] = await fetchCityCoords(lat, long,);
    endpoint = `${mapURI}/forecast?lat=${lat}&lon=${long}&units=metric&appid=${appId}`;
  } else {
    endpoint = `${mapURI}/forecast?q=${targetCity}&appid=${appId}`;
  }
  const response = await fetch(endpoint,);

  return response ? response.json() : {};
};

router.get('/api/weather', async ctx => {
  const { lat, long, } = ctx.query;
  const weatherData = await fetchForecast(lat, long,);

  ctx.type = 'application/json; charset=utf-8';
  // ctx.body = weatherData.weather ? weatherData.weather[0] : {};
  ctx.body = weatherData;
},);

app.use(router.routes(),);
app.use(router.allowedMethods(),);

app.listen(port,);

console.log(`App listening on port ${port}`,);
