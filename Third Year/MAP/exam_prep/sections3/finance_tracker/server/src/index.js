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

const transactions = [
  {id: 1, date: "2023-01-25", type: "Expense", amount: 50, category: "Food", description: "Breakfast at café" },
  {id: 2, date: "2023-01-25", type: "Expense", amount: 75, category: "Transportation", description: "Train tickets" },
  {id: 3, date: "2023-01-26", type: "Expense", amount: 200, category: "Shopping", description: "Gift for a friend" },
  {id: 4, date: "2023-01-27", type: "Income", amount: 500, category: "Freelance work", description: "Web development project" },
  {id: 5, date: "2023-01-28", type: "Expense", amount: 100, category: "Food", description: "Dinner at restaurant" },
  {id: 6, date: "2023-01-29", type: "Expense", amount: 150, category: "Transportation", description: "Taxi ride" },
  {id: 7, date: "2023-01-30", type: "Income", amount: 1000, category: "Salary", description: "Monthly salary" },
  {id: 8, date: "2023-02-01", type: "Expense", amount: 200, category: "Food", description: "Lunch with colleagues" },
  {id: 9, date: "2023-02-02", type: "Expense", amount: 75, category: "Entertainment", description: "Movie tickets" },
  {id: 10, date: "2023-02-03", type: "Income", amount: 1500, category: "Freelance work", description: "Graphic design project" },
  {id: 11, date: "2023-02-03", type: "Expense", amount: 50, category: "Shopping", description: "Clothing" },
  {id: 12, date: "2023-02-04", type: "Expense", amount: 100, category: "Transportation", description: "Gas for the car" },
  {id: 13, date: "2023-02-05", type: "Expense", amount: 50, category: "Food", description: "Breakfast at café" },
  {id: 14, date: "2023-02-06", type: "Expense", amount: 75, category: "Entertainment", description: "Concert tickets" }
];

const router = new Router();
router.get('/days', ctx => {
  const dates = transactions.map(transaction => transaction.date);
  const uniqueDates = new Set(dates);
  ctx.response.body = [...uniqueDates];
  ctx.response.status = 200;
});

router.get('/transactions/:date', ctx => {
  // console.log("ctx: " + JSON.stringify(ctx));
  const headers = ctx.params;
  const date = headers.date;
  // console.log("category: " + JSON.stringify(category));
  ctx.response.body = transactions.filter(transaction => transaction.date == date);
  // console.log("body: " + JSON.stringify(ctx.response.body));
  ctx.response.status = 200;
});

router.get('/entries', ctx => {
  ctx.response.body = transactions;
  ctx.response.status = 200;
});

const broadcast = (data) =>
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });

router.post('/transaction', ctx => {
  // console.log("ctx: " + JSON.stringify(ctx));
  const headers = ctx.request.body;
  // console.log("body: " + JSON.stringify(headers));
  const date = headers.date;
  const type = headers.type;
  const amount = headers.amount;
  const category = headers.category;
  const description = headers.description;
  if (typeof date !== 'undefined'
    && typeof type !== 'undefined'
    && typeof amount !== 'undefined'
    && typeof category !== 'undefined'
    && typeof description !== 'undefined') {
    const index = transactions.findIndex(transaction => transaction.date == date && transaction.type == type);
    if (index !== -1) {
      const msg = "Transaction already exists!";
      console.log(msg);
      ctx.response.body = { text: msg };
      ctx.response.status = 404;
    } else {
      let maxId = Math.max.apply(Math, transactions.map(transaction => transaction.id)) + 1;
      let transaction = {
        id: maxId,
        date,
        type,
        category,
        description,
        amount
      };
      transactions.push(transaction);
      broadcast(transaction);
      ctx.response.body = transaction;
      ctx.response.status = 200;
    }
  } else {
    const msg = "Missing or invalid date: " + date + " type: " + type
      + " amount: " + amount + " category: " + category + " description: " + description;
    console.log(msg);
    ctx.response.body = { text: msg };
    ctx.response.status = 404;
  }
});

router.del('/transaction/:id', ctx => {
  // console.log("ctx: " + JSON.stringify(ctx));
  const headers = ctx.params;
  // console.log("body: " + JSON.stringify(headers));
  const id = headers.id;
  if (typeof id !== 'undefined') {
    const index = transactions.findIndex(transaction => transaction.id == id);
    if (index === -1) {
      const msg = "No transaction with id: " + id;
      console.log(msg);
      ctx.response.body = { text: msg };
      ctx.response.status = 404;
    } else {
      let transaction = transactions[index];
      transactions.splice(index, 1);
      ctx.response.body = transaction;
      ctx.response.status = 200;
    }
  } else {
    ctx.response.body = { text: 'Id missing or invalid' };
    ctx.response.status = 404;
  }
});

app.use(router.routes());
app.use(router.allowedMethods());

const port = 2307;

server.listen(port, () => {
  console.log(`🚀 Server listening on ${port} ... 🚀`);
});