const Koa = require('koa',);
const router = require('koa-router',)();
const cors = require('kcors',);

const mockData1 = require('./weatherData1.json');
const mockData2 = require('./weatherData2.json');

const port = process.env.PORT || 9100;

const app = new Koa();

app.use(cors(),);

// Function to provide mock data from OpenWeatherMap API to backend
router.get('/data/2.5/forecast', async ctx => {
  const { lat, lon, q, appid } = ctx.query;

  ctx.body = {};

  if(appid != "1234567890") {
    ctx.status = 403;
  // Return mock data based on latitude and longitude arguments
  } else if(lat && lon ) {
    ctx.body = mockData2;
  // If query string given, return mock data
  } else if(q) {
    ctx.body = mockData1;
  // If no args present, return 400
  } else {
    ctx.status = 400;
  }

  ctx.type = 'application/json; charset=utf-8';
},);

app.use(router.routes(),);
app.use(router.allowedMethods(),);

app.listen(port,);

console.log(`App listening on port ${port}`,);
