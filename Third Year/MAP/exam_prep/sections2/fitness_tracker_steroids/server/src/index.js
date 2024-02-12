var koa = require('koa');
var app = module.exports = new koa();
const server = require('http').createServer(app.callback());
const WebSocket = require('ws');
const wss = new WebSocket.Server({ server });
const Router = require('koa-router');
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');

app.use(bodyParser());

app.use(cors());

app.use(middleware);

function middleware(ctx, next) {
  const start = new Date();
  return next().then(() => {
    const ms = new Date() - start;
    console.log(`${start.toLocaleTimeString()} ${ctx.response.status} ${ctx.request.method} ${ctx.request.url} - ${ms}ms`);
  });
}

const activities = [
  {
    id: 1,
    date: "2023-02-01",
    type: "Running",
    duration: 30,
    distance: 8000,
    calories: 400,
    rate: 120
  },
  {
    id: 2,
    date: "2023-02-01",
    type: "Swimming",
    duration: 45,
    distance: 2000,
    calories: 350,
    rate: 115
  },
  {
    id: 3,
    date: "2023-02-02",
    type: "Cycling",
    duration: 60,
    distance: 30000,
    calories: 500,
    rate: 125
  },
  {
    id: 4,
    date: "2023-02-03",
    type: "Yoga",
    duration: 75,
    distance: 0,
    calories: 300,
    rate: 110
  },
  {
    id: 5,
    date: "2023-02-03",
    type: "Weightlifting",
    duration: 45,
    distance: 0,
    calories: 400,
    rate: 115
  },
  {
    id: 6,
    date: "2023-02-04",
    type: "Running",
    duration: 20,
    distance: 6000,
    calories: 300,
    rate: 130
  },
  {
    id: 7,
    date: "2023-02-04",
    type: "Cycling",
    duration: 45,
    distance: 25000,
    calories: 450,
    rate: 120
  },
  {
    id: 8,
    date: "2023-02-05",
    type: "Swimming",
    duration: 30,
    distance: 1500,
    calories: 250,
    rate: 105
  },
  {
    id: 9,
    date: "2023-02-06",
    type: "Yoga",
    duration: 60,
    distance: 0,
    calories: 200,
    rate: 100
  },
  {
    id: 10,
    date: "2023-02-07",
    type: "Weightlifting",
    duration: 60,
    distance: 0,
    calories: 500,
    rate: 115
  },
  {
    id: 11,
    date: "2023-02-08",
    type: "Running",
    duration: 25,
    distance: 7000,
    calories: 350,
    rate: 125
  },
  {
    id: 12,
    date: "2023-02-09",
    type: "Cycling",
    duration: 75,
    distance: 35000,
    calories: 550,
    rate: 130
  },
  {
    id: 13,
    date: "2023-02-10",
    type: "Swimming",
    duration: 50,
    distance: 2500,
    calories: 400,
    rate: 120
  },
  {
    id: 14,
    date: "2023-02-11",
    type: "Yoga",
    duration: 90,
    distance: 0,
    calories: 350,
    rate: 115
  },
  {
    id: 15,
    date: "2023-02-12",
    type: "Weightlifting",
    duration: 45,
    distance: 0,
    calories: 400,
    rate: 120
  },
  {
    id: 16,
    date: "2023-02-13",
    type: "Running",
    duration: 35,
    distance: 9000,
    calories: 450,
    rate: 125
  },
  {
    id: 17,
    date: "2023-02-14",
    type: "Cycling",
    duration: 60,
    distance: 30000,
    calories: 500,
    rate: 130
  },
  {
    id: 18,
    date: "2023-02-15",
    type: "Swimming",
    duration: 40,
    distance: 2000,
    calories: 350,
    rate: 115
  }
];

const router = new Router();
router.get('/dates', ctx => {
  const dates = activities.map(activity => activity.date);
  const uniqueDates = new Set(dates);
  ctx.response.body = [...uniqueDates];
  ctx.response.status = 200;
});

router.get('/entries/:date', ctx => {
  // console.log("ctx: " + JSON.stringify(ctx));
  const headers = ctx.params;
  const date = headers.date;
  // console.log("category: " + JSON.stringify(category));
  ctx.response.body = activities.filter(activity => activity.date == date);
  // console.log("body: " + JSON.stringify(ctx.response.body));
  ctx.response.status = 200;
});

router.get('/all', ctx => {
  ctx.response.body = activities;
  ctx.response.status = 200;
});

const broadcast = (data) =>
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });

router.post('/entry', ctx => {
  // console.log("ctx: " + JSON.stringify(ctx));
  const headers = ctx.request.body;
  // console.log("body: " + JSON.stringify(headers));
  const date = headers.date;
  const type = headers.type;
  const duration = headers.duration;
  const distance = headers.distance;
  const calories = headers.calories;
  const rate = headers.rate;
  if (typeof date !== 'undefined'
    && typeof type !== 'undefined'
    && typeof duration !== 'undefined'
    && typeof distance !== 'undefined'
    && typeof calories !== 'undefined'
    && typeof rate !== 'undefined') {
    const index = activities.findIndex(activity => activity.date == date && activity.type == type);
    if (index !== -1) {
      const msg = "Activity already exists!";
      console.log(msg);
      ctx.response.body = { text: msg };
      ctx.response.status = 404;
    } else {
      let maxId = Math.max.apply(Math, activities.map(activity => activity.id)) + 1;
      let activity = {
        id: maxId,
        date,
        type,
        distance,
        calories,
        duration,
        rate
      };
      activities.push(activity);
      broadcast(activity);
      ctx.response.body = activity;
      ctx.response.status = 200;
    }
  } else {
    const msg = "Missing or invalid date: " + date + " type: " + type 
    + " duration: " + duration + " distance: " + distance + " calories: " + calories + " rate: " + rate;
    console.log(msg);
    ctx.response.body = { text: msg };
    ctx.response.status = 404;
  }
});

router.del('/entry/:id', ctx => {
  // console.log("ctx: " + JSON.stringify(ctx));
  const headers = ctx.params;
  // console.log("body: " + JSON.stringify(headers));
  const id = headers.id;
  if (typeof id !== 'undefined') {
    const index = activities.findIndex(activity => activity.id == id);
    if (index === -1) {
      const msg = "No activity with id: " + id;
      console.log(msg);
      ctx.response.body = { text: msg };
      ctx.response.status = 404;
    } else {
      let activity = activities[index];
      activities.splice(index, 1);
      ctx.response.body = activity;
      ctx.response.status = 200;
    }
  } else {
    ctx.response.body = { text: 'Id missing or invalid' };
    ctx.response.status = 404;
  }
});

app.use(router.routes());
app.use(router.allowedMethods());

const port = 2305;

server.listen(port, () => {
  console.log(`🚀 Server listening on ${port} ... 🚀`);
  console.log(`WebSocket server is listening on ${server.address().address}:${server.address().port}`);
});