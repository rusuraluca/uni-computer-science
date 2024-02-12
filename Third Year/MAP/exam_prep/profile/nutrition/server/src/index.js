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

const meals = [
  { id: 1, name: "Grilled chicken salad", type: "Lunch", calories: 350, date: "2023-02-19", notes: "Used homemade vinaigrette" },
  { id: 2, name: "Oatmeal with fruit", type: "Breakfast", calories: 250, date: "2023-02-18", notes: "Added sliced bananas and blueberries" },
  { id: 3, name: "Tuna sandwich", type: "Lunch", calories: 400, date: "2023-02-18", notes: "Used whole wheat bread" },
  { id: 4, name: "Yogurt with granola", type: "Breakfast", calories: 300, date: "2023-02-17", notes: "Added honey for sweetness" },
  { id: 5, name: "Turkey burger", type: "Dinner", calories: 500, date: "2023-02-17", notes: "Served with sweet potato fries" },
  { id: 6, name: "Egg and cheese sandwich", type: "Breakfast", calories: 400, date: "2023-02-16", notes: "Used cheddar cheese" },
  { id: 7, name: "Spaghetti with meat sauce", type: "Dinner", calories: 600, date: "2023-02-16", notes: "Used lean ground beef" },
  { id: 8, name: "Green smoothie", type: "Snack", calories: 150, date: "2023-02-15", notes: "Used spinach, banana, and almond milk" },
  { id: 9, name: "Grilled salmon", type: "Dinner", calories: 450, date: "2023-02-15", notes: "Served with roasted vegetables" },
  { id: 10, name: "Fruit salad", type: "Snack", calories: 200, date: "2023-02-14", notes: "Used a variety of seasonal fruits" },
  { id: 11, name: "Veggie omelette", type: "Breakfast", calories: 350, date: "2023-02-14", notes: "Used peppers, onions, and mushrooms" },
  { id: 12, name: "Chicken stir-fry", type: "Dinner", calories: 550, date: "2023-02-13", notes: "Used brown rice and a mix of veggies" },
  { id: 13, name: "Greek yogurt with honey", type: "Snack", calories: 200, date: "2023-02-13", notes: "Used plain Greek yogurt" },
  { id: 14, name: "Grilled shrimp kebab", type: "Dinner", calories: 400, date: "2023-02-12", notes: "Marinated in lemon and garlic" },
  { id: 15, name: "Protein smoothie", type: "Snack", calories: 250, date: "2023-02-12", notes: "Used whey protein powder, banana, and almond milk" }
];

const router = new Router();
router.get('/all', ctx => {
  ctx.response.body = meals;
  ctx.response.status = 200;
});

router.get('/types', ctx => {
  const types = meals.map(obj => obj.type);
  const unique = new Set(types);
  ctx.response.body = [...unique];
  ctx.response.status = 200;
});

router.get('/meals/:type', ctx => {
  // console.log("ctx: " + JSON.stringify(ctx));
  const headers = ctx.params;
  const type = headers.type;
  ctx.response.body = meals.filter(obj => obj.type == type);
  ctx.response.status = 200;
});

const broadcast = (data) =>
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });

router.post('/meal', ctx => {
  // console.log("ctx: " + JSON.stringify(ctx));
  const headers = ctx.request.body;
  // console.log("body: " + JSON.stringify(headers));
  const name = headers.name;
  const type = headers.type;
  const calories = headers.calories;
  const date = headers.date;
  const notes = headers.notes;
  if (typeof name !== 'undefined'
    && typeof type !== 'undefined'
    && typeof calories !== 'undefined'
    && typeof date !== 'undefined'
    && typeof notes !== 'undefined') {
    const index = meals.findIndex(obj => obj.name == name && obj.type == type);
    if (index !== -1) {
      const msg = "Meal already exists!";
      console.log(msg);
      ctx.response.body = { text: msg };
      ctx.response.status = 404;
    } else {
      let maxId = Math.max.apply(Math, meals.map(obj => obj.id)) + 1;
      let obj = {
        id: maxId,
        name,
        type,
        calories,
        date,
        notes
      };
      meals.push(obj);
      broadcast(obj);
      ctx.response.body = obj;
      ctx.response.status = 200;
    }
  } else {
    const msg = "Missing or invalid name: " + name + " type: " + type
      + " calories: " + calories
      + " date: " + date + " notes: " + notes;
    console.log(msg);
    ctx.response.body = { text: msg };
    ctx.response.status = 404;
  }
});

router.del('/meal/:id', ctx => {
  // console.log("ctx: " + JSON.stringify(ctx));
  const headers = ctx.params;
  // console.log("body: " + JSON.stringify(headers));
  const id = headers.id;
  if (typeof id !== 'undefined') {
    const index = meals.findIndex(obj => obj.id == id);
    if (index === -1) {
      const msg = "No property with id: " + id;
      console.log(msg);
      ctx.response.body = { text: msg };
      ctx.response.status = 404;
    } else {
      let obj = meals[index];
      meals.splice(index, 1);
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

const port = 2320;

server.listen(port, () => {
  console.log(`🚀 Server listening on ${port} ... 🚀`);
});