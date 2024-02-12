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

const pets = [
  { id: 1, name: "Max", breed: "Labrador", age: 3, weight: 45, owner: "John Doe", location: "New York", description: "Friendly and energetic dog" },
  { id: 2, name: "Daisy", breed: "Poodle", age: 1, weight: 20, owner: "Jane Doe", location: "Los Angeles", description: "Cute and playful puppy" },
  { id: 3, name: "Buddy", breed: "Golden Retriever", age: 5, weight: 50, owner: "Jim Smith", location: "Chicago", description: "Loyal and affectionate dog" },
  { id: 4, name: "Sasha", breed: "German Shepherd", age: 2, weight: 45, owner: "Emily Johnson", location: "Dallas", description: "Intelligent and protective dog" },
  { id: 5, name: "Charlie", breed: "Beagle", age: 4, weight: 25, owner: "David Brown", location: "Miami", description: "Friendly and energetic dog" },
  { id: 6, name: "Lucy", breed: "Bulldog", age: 3, weight: 40, owner: "Sarah Wilson", location: "Houston", description: "Loyal and playful dog" },
  { id: 7, name: "Rocky", breed: "Boxer", age: 5, weight: 50, owner: "Michael Davis", location: "Philadelphia", description: "Strong and energetic dog" },
  { id: 8, name: "Molly", breed: "Cocker Spaniel", age: 2, weight: 25, owner: "Emily Smith", location: "San Francisco", description: "Friendly and cheerful dog" },
  { id: 9, name: "Toby", breed: "Dachshund", age: 4, weight: 15, owner: "John Johnson", location: "Washington DC", description: "Loyal and affectionate dog" },
  { id: 10, name: "Bella", breed: "Shih Tzu", age: 3, weight: 20, owner: "Jane Wilson", location: "Seattle", description: "Friendly and cheerful dog" },
  { id: 11, name: "Rufus", breed: "Dalmatian", age: 5, weight: 45, owner: "Jim Davis", location: "Boston", description: "Friendly and energetic dog" },
  { id: 12, name: "Max", breed: "Labrador", age: 4, weight: 55, owner: "John Doe", location: "New York", description: "Friendly and energetic" },
  { id: 13, name: "Buddy", breed: "Golden Retriever", age: 2, weight: 45, owner: "Jane Doe", location: "California", description: "Loyal and playful" },
  { id: 14, name: "Charlie", breed: "Poodle", age: 5, weight: 25, owner: "Jim Smith", location: "Texas", description: "Intelligent and elegant" },
  { id: 15, name: "Rocky", breed: "Bulldog", age: 3, weight: 35, owner: "Sara Johnson", location: "Florida", description: "Stubborn but loving" }
];

const router = new Router();
router.get('/pets', ctx => {
  ctx.response.body = pets.map(obj => { return { id: obj.id, name: obj.name } });
  ctx.response.status = 200;
});

router.get('/pet/:id', ctx => {
  // console.log("ctx: " + JSON.stringify(ctx));
  const headers = ctx.params;
  const id = headers.id;
  // console.log("category: " + JSON.stringify(category));
  const index = pets.findIndex(obj => obj.id == id);
  if (index === -1) {
    const msg = "No pet with id: " + id;
    console.log(msg);
    ctx.response.body = { text: msg };
    ctx.response.status = 404;
  } else {
    let obj = pets[index];
    ctx.response.body = obj;
    ctx.response.status = 200;
  }
});

router.get('/search', ctx => {
  ctx.response.body = pets;
  ctx.response.status = 200;
});

const broadcast = (data) =>
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });

router.post('/pet', ctx => {
  // console.log("ctx: " + JSON.stringify(ctx));
  const headers = ctx.request.body;
  // console.log("body: " + JSON.stringify(headers));
  const name = headers.name;
  const breed = headers.breed;
  const age = headers.age;
  const weight = headers.weight;
  const owner = headers.owner;
  const location = headers.location;
  const description = headers.description;
  if (typeof name !== 'undefined'
    && typeof breed !== 'undefined'
    && typeof age !== 'undefined'
    && typeof weight !== 'undefined'
    && typeof owner !== 'undefined'
    && typeof location !== 'undefined'
    && typeof description !== 'undefined') {
    const index = pets.findIndex(obj => obj.name == name && obj.breed == breed);
    if (index !== -1) {
      const msg = "Pet already exists!";
      console.log(msg);
      ctx.response.body = { text: msg };
      ctx.response.status = 404;
    } else {
      let maxId = Math.max.apply(Math, pets.map(obj => obj.id)) + 1;
      let obj = {
        id: maxId,
        name,
        breed,
        age,
        weight,
        owner,
        location,
        description
      };
      pets.push(obj);
      broadcast(obj);
      ctx.response.body = obj;
      ctx.response.status = 200;
    }
  } else {
    const msg = "Missing or invalid name: " + name + " breed: " + breed
      + " age: " + age + " weight: " + weight
      + " owner: " + owner + " location: " + location
      + " area: " + area + " description: " + description;
    console.log(msg);
    ctx.response.body = { text: msg };
    ctx.response.status = 404;
  }
});

router.del('/pet/:id', ctx => {
  // console.log("ctx: " + JSON.stringify(ctx));
  const headers = ctx.params;
  // console.log("body: " + JSON.stringify(headers));
  const id = headers.id;
  if (typeof id !== 'undefined') {
    const index = pets.findIndex(obj => obj.id == id);
    if (index === -1) {
      const msg = "No property with id: " + id;
      console.log(msg);
      ctx.response.body = { text: msg };
      ctx.response.status = 404;
    } else {
      let obj = pets[index];
      pets.splice(index, 1);
      ctx.response.body = obj;
      ctx.response.status = 200;
    }
  } else {
    ctx.response.body = { text: 'Id missing or invalid' };
    ctx.response.status = 404;
  }
});

app.use(router.routes());
app.use(router.allowedMethods());

const port = 2309;

server.listen(port, () => {
  console.log(`🚀 Server listening on ${port} ... 🚀`);
});