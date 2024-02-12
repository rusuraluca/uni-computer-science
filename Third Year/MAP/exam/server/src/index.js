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

const events = [
  { id: 1, name: "Tech Conference 2024", organizer: "Tech Events LLC", category: "Technology", capacity: 500, registered: 350 },
  { id: 2, name: "Art Exhibition: Beyond Colors", organizer: "Creative Arts Society", category: "Art", capacity: 200, registered: 150 },
  { id: 3, name: "Business Networking Mixer", organizer: "Business Connections Inc.", category: "Networking", capacity: 100, registered: 80 },
  { id: 4, name: "Health and Wellness Seminar", organizer: "Healthy Living Foundation", category: "Wellness", capacity: 150, registered: 120 },
  { id: 5, name: "Music Festival 2024", organizer: "Groove Entertainment", category: "Music", capacity: 1000, registered: 800 },
  { id: 6, name: "Food Tasting Extravaganza", organizer: "Culinary Delights Co.", category: "Food & Drink", capacity: 300, registered: 250 },
  { id: 7, name: "Environmental Sustainability Summit", organizer: "Green Earth Alliance", category: "Environment", capacity: 200, registered: 180 },
  { id: 8, name: "Sports Fan Meetup", organizer: "Sports Enthusiasts Club", category: "Sports", capacity: 50, registered: 40 },
  { id: 9, name: "Educational Workshop Series", organizer: "Learning Solutions Institute", category: "Education", capacity: 120, registered: 90 },
  { id: 10, name: "Charity Gala Night", organizer: "Hope Foundation", category: "Charity", capacity: 150, registered: 130 },
  { id: 11, name: "Fashion Show: Trends Unleashed", organizer: "Chic Designs Agency", category: "Fashion", capacity: 300, registered: 280 },
  { id: 12, name: "Science and Technology Expo", organizer: "Innovate Labs Inc.", category: "Science", capacity: 250, registered: 200 },
  { id: 13, name: "Literary Symposium", organizer: "Book Lovers Society", category: "Literature", capacity: 80, registered: 60 },
  { id: 14, name: "Film Festival 2024", organizer: "Cinema Enthusiasts Guild", category: "Film", capacity: 200, registered: 180 },
  { id: 15, name: "Community Volunteer Day", organizer: "Community Helpers Foundation", category: "Community Service", capacity: 150, registered: 120 },
];

const router = new Router();

router.get('/events', ctx => {
  ctx.response.body = events;
  ctx.response.status = 200;
});

router.get('/reserved', ctx => {
  ctx.response.body = events.filter(event => event.registered > 0);
  ctx.response.status = 200;
});

router.put('/reserve/:id', ctx => {
  // console.log("ctx: " + JSON.stringify(ctx));
  const headers = ctx.params;
  // console.log("body: " + JSON.stringify(headers));
  const id = headers.id;
  if (typeof id !== 'undefined') {
    const index = events.findIndex(event => event.id == id);
    if (index === -1) {
      const msg = "No entity with id: " + id;
      console.log(msg);
      ctx.response.body = { text: msg };
      ctx.response.status = 404;
    } else {
      let event = events[index];
      if (event.registered < event.capacity) {
        event.registered++;
        ctx.response.body = event;
        ctx.response.status = 200;
      } else {
        const msg = "No more seats available!";
        console.log(msg);
        ctx.response.body = { text: msg };
        ctx.response.status = 404;
      }
    }
  } else {
    ctx.response.body = { text: 'Id missing or invalid' };
    ctx.response.status = 404;
  }
});

router.put('/attend/:id', ctx => {
  const headers = ctx.params;
  const id = headers.id;
  if (typeof id !== 'undefined') {
    const index = events.findIndex(event => event.id == id);
    if (index === -1) {
      const msg = "No entity with id: " + id;
      console.log(msg);
      ctx.response.body = { text: msg };
      ctx.response.status = 404;
    } else {
      let event = events[index];
      if (event.registered > 0) {
        event.registered--;
        ctx.response.body = event;
        ctx.response.status = 200;
      } else {
        const msg = "No more seats available!";
        console.log(msg);
        ctx.response.body = { text: msg };
        ctx.response.status = 404;
      }
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

router.post('/event', ctx => {
  const headers = ctx.request.body;
  const name = headers.name;
  const organizer = headers.organizer;
  const category = headers.category;
  const capacity = headers.capacity;
  const registered = headers.registered;
  if (typeof name !== 'undefined'
    && typeof organizer !== 'undefined'
    && typeof category !== 'undefined'
    && typeof capacity !== 'undefined'
    && typeof registered !== 'undefined') {
    const index = events.findIndex(event => event.name == name && event.organizer == organizer);
    if (index !== -1) {
      const msg = "The entity already exists!";
      console.log(msg);
      ctx.response.body = { text: msg };
      ctx.response.status = 404;
    } else {
      let maxId = Math.max.apply(Math, events.map(event => event.id)) + 1;
      let event = {
        id: maxId,
        name,
        organizer,
        category,
        capacity,
        registered
      };
      events.push(event);
      broadcast(event);
      ctx.response.body = event;
      ctx.response.status = 200;
    }
  } else {
    const msg = "Missing or invalid name: " + name + " organizer: " + organizer + " category: " + category
      + " capacity: " + capacity + " registered: " + registered;
    console.log(msg);
    ctx.response.body = { text: msg };
    ctx.response.status = 404;
  }



});

app.use(router.routes());
app.use(router.allowedMethods());

const port = 2429;

server.listen(port, () => {
  console.log(`🚀 Server listening on ${port} ... 🚀`);
});