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

const listings = [
  { id: 1, name: "Cozy Apartment", date: "2024-03-10", details: "2-bedroom apartment with a scenic view", status: "available", viewers: 150, type: "apartment" },
  { id: 2, name: "Spacious House", date: "2024-04-05", details: "4-bedroom house with a large backyard", status: "pending", viewers: 120, type: "house" },
  { id: 3, name: "Commercial Space", date: "2024-02-20", details: "Prime location for business operations", status: "sold", viewers: 200, type: "commercial" },
  { id: 4, name: "Modern Condo", date: "2024-05-15", details: "1-bedroom condo with modern amenities", status: "available", viewers: 180, type: "apartment" },
  { id: 5, name: "Luxury Villa", date: "2024-03-28", details: "Exclusive villa with a private pool", status: "available", viewers: 250, type: "house" },
  { id: 6, name: "Office Space", date: "2024-04-10", details: "Suitable for professional offices", status: "pending", viewers: 120, type: "commercial" },
  { id: 7, name: "Urban Loft", date: "2024-02-15", details: "Open-concept loft in the heart of the city", status: "sold", viewers: 180, type: "apartment" },
  { id: 8, name: "Family Home", date: "2024-05-05", details: "3-bedroom house with a family-friendly layout", status: "available", viewers: 200, type: "house" },
  { id: 9, name: "Retail Space", date: "2024-03-18", details: "Ideal for retail businesses", status: "pending", viewers: 150, type: "commercial" },
  { id: 10, name: "Penthouse Suite", date: "2024-04-20", details: "Luxurious penthouse with panoramic views", status: "available", viewers: 300, type: "apartment" },
];

const router = new Router();

router.get('/listings', ctx => {
  ctx.response.body = listings;
  ctx.response.status = 200;
});

router.get('/interest', ctx => {
  ctx.response.body = listings.filter(entry => entry.status != "sold");
  ctx.response.status = 200;
});

router.get('/types', ctx => {
  ctx.response.body = listings.map(entry => entry.type);
  ctx.response.status = 200;
});

router.get('/property/:id', ctx => {
  // console.log("ctx: " + JSON.stringify(ctx));
  const headers = ctx.params;
  // console.log("body: " + JSON.stringify(headers));
  const id = headers.id;
  if (typeof id !== 'undefined') {
    const index = listings.findIndex(entry => entry.id == id);
    if (index === -1) {
      const msg = "No entity with id: " + id;
      console.log(msg);
      ctx.response.body = { text: msg };
      ctx.response.status = 404;
    } else {
      let entry = listings[index];
      ctx.response.body = entry;
      ctx.response.status = 200;
    }
  } else {
    ctx.response.body = { text: 'Id missing or invalid' };
    ctx.response.status = 404;
  }
});

const broadcast = (data) =>
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });

router.post('/property', ctx => {
  // console.log("ctx: " + JSON.stringify(ctx));
  const headers = ctx.request.body;
  // console.log("body: " + JSON.stringify(headers));
  const name = headers.name;
  const date = headers.date;
  const details = headers.details;
  const status = headers.status;
  const viewers = headers.viewers;
  const type = headers.type;
  if (typeof name !== 'undefined'
    && typeof date !== 'undefined'
    && typeof details !== 'undefined'
    && typeof status !== 'undefined'
    && typeof viewers !== 'undefined'
    && typeof type !== 'undefined') {
    const index = listings.findIndex(entry => entry.name == name && entry.date == date);
    if (index !== -1) {
      const msg = "The entity already exists!";
      console.log(msg);
      ctx.response.body = { text: msg };
      ctx.response.status = 404;
    } else {
      let maxId = Math.max.apply(Math, listings.map(entry => entry.id)) + 1;
      let entry = {
        id: maxId,
        name,
        date,
        details,
        status,
        viewers,
        type
      };
      listings.push(entry);
      broadcast(entry);
      ctx.response.body = entry;
      ctx.response.status = 200;
    }
  } else {
    const msg = "Missing or invalid name: " + name + " date: " + date + " details: " + details
      + " status: " + status + " viewers: " + viewers + " type: " + type;
    console.log(msg);
    ctx.response.body = { text: msg };
    ctx.response.status = 404;
  }
});

router.put('/register/:type', ctx => {
  const headers = ctx.params;
  const type = headers.type;
  if (typeof type !== 'undefined') {
    const index = listings.findIndex(entry => entry.type == type);
    if (index === -1) {
      //create new entry
      const msg = "No entity with type: " + type;
      console.log(msg);
      ctx.response.body = { text: msg };
      ctx.response.status = 404;
    } else {
      let entry = listings[index];
      entry.viewers++;
      ctx.response.body = entry;
      ctx.response.status = 200;
    }
  } else {
    const msg = "Type missing or invalid. type: " + type;
    console.log(msg);
    ctx.response.body = { text: msg };
    ctx.response.status = 404;
  }
});

app.use(router.routes());
app.use(router.allowedMethods());

const port = 2407;

server.listen(port, () => {
  console.log(`🚀 Server listening on ${port} ... 🚀`);
});