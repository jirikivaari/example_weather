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
  const { lat, long, targetCity } = ctx.query;

  // Return mock data based on arguments
  if(lat && long) {
    ctx.body = mockData2;
  } else if(targetCity) {
    ctx.body = mockData1;
  } else {
    ctx.body = {};
    ctx.status = 400;
  }

  ctx.type = 'application/json; charset=utf-8';
},);

app.use(router.routes(),);
app.use(router.allowedMethods(),);

app.listen(port,);

console.log(`App listening on port ${port}`,);
