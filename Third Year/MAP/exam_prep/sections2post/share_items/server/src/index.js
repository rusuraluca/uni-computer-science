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
    console.log(`${start.toLocaleTimeString()} ${ctx.response.status}  ${ctx.request.method} ${ctx.request.url} - ${ms}ms`);
  });
}

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};

// generate double random number in range [min, max)
const getRandomDouble = (min, max) => {
  return Math.random() * (max - min) + min;
};

const itemNames = [
  'Jet Ski',
  'Bubble Wrap',
  'Onesies',
  'Jacuzzi',
  'Breathalyzer',
  'Zamboni'];
const descriptionNames = [
  'very good',
  'healthy',
  'lite',
  'tasty',
  'good'];
const imageNames = [
  'image1',
  'image2',
  'image3',
  'image4',
  'image5'];
const categories = [
  'clothes',
  'electronics',
  'books',
  'toys'];
const items = [];
for (let i = 0; i < 20; i++) {
  items.push({
    id: i + 1,
    name: itemNames[getRandomInt(0, itemNames.length)],
    description: descriptionNames[getRandomInt(0, descriptionNames.length)],
    image: imageNames[getRandomInt(0, imageNames.length)],
    category: categories[getRandomInt(0, categories.length)],
    units: getRandomInt(1, 100),
    price: getRandomDouble(1, 100)
  });
}

const router = new Router();
router.get('/categories', ctx => {
  ctx.response.body = categories;
  ctx.response.status = 200;
});

router.get('/items/:category', ctx => {
  // console.log("ctx: " + JSON.stringify(ctx));
  const headers = ctx.params;
  const category = headers.category;
  // console.log("category: " + JSON.stringify(category));
  ctx.response.body = items.filter(item => item.category == category);
  // console.log("body: " + JSON.stringify(ctx.response.body));
  ctx.response.status = 200;
});

router.get('/discounted', ctx => {
  ctx.response.body = items;
  ctx.response.status = 200;
});

router.post('/price', ctx => {
  // console.log("ctx: " + JSON.stringify(ctx));
  const headers = ctx.request.body;
  // console.log("body: " + JSON.stringify(headers));
  const id = headers.id;
  const newPrice = headers.price;
  if (typeof id !== 'undefined' && typeof newPrice !== 'undefined') {
    const index = items.findIndex(item => item.id == id);
    if (index === -1) {
      console.log("Item not available!");
      ctx.response.body = { text: 'Item not available!' };
      ctx.response.status = 404;
    } else {
      let item = items[index];
      item.price = newPrice;
      ctx.response.body = item;
      ctx.response.status = 200;
    }
  } else {
    console.log("Missing or invalid: id or price!");
    ctx.response.body = { text: 'Missing or invalid: id or price!' };
    ctx.response.status = 404;
  }
});

const broadcast = (data) =>
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });

router.post('/item', ctx => {
  // console.log("ctx: " + JSON.stringify(ctx));
  const headers = ctx.request.body;
  // console.log("body: " + JSON.stringify(headers));
  const name = headers.name;
  const description = headers.description;
  const image = headers.image;
  const category = headers.category;
  const units = headers.units;
  const price = headers.price;
  if (typeof name !== 'undefined'
    && typeof description !== 'undefined'
    && typeof image !== 'undefined'
    && typeof units !== 'undefined'
    && typeof category !== 'undefined'
    && typeof price !== 'undefined') {
    const index = items.findIndex(item => item.name == name);
    if (index !== -1) {
      console.log("Item already exists!");
      ctx.response.body = { text: 'Item already exists!' };
      ctx.response.status = 404;
    } else {
      let maxId = Math.max.apply(Math, items.map(function (item) {
        return item.id;
      })) + 1;
      let item = {
        id: maxId,
        name,
        description,
        image,
        units,
        category,
        price
      };
      items.push(item);
      broadcast(item);
      ctx.response.body = item;
      ctx.response.status = 200;
    }
  } else {
    const message = "Missing or invalid: name, description, image, category, units or price!";
    console.log(message);
    ctx.response.body = { text: message };
    ctx.response.status = 404;
  }
});

router.del('/item/:id', ctx => {
  // console.log("ctx: " + JSON.stringify(ctx));
  const headers = ctx.params;
  // console.log("body: " + JSON.stringify(headers));
  const id = headers.id;
  if (typeof id !== 'undefined') {
    const index = items.findIndex(item => item.id == id);
    if (index === -1) {
      console.log("No item with id: " + id);
      ctx.response.body = { text: 'Invalid item id' };
      ctx.response.status = 404;
    } else {
      let item = items[index];
      items.splice(index, 1);
      ctx.response.body = item;
      ctx.response.status = 200;
    }
  } else {
    ctx.response.body = { text: 'Id missing or invalid' };
    ctx.response.status = 404;
  }
});

app.use(router.routes());
app.use(router.allowedMethods());

const port = 2325;

server.listen(port, () => {
  console.log(`🚀 Server listening on ${port} ... 🚀`);
});
