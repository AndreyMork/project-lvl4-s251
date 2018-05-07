// import 'babel-polyfill';

import Koa from 'koa';
import serve from 'koa-static';
import koaLogger from 'koa-logger';
import Router from 'koa-router';
import Pug from 'koa-pug';
import Rollbar from 'rollbar';

import path from 'path';
import dotenv from 'dotenv';


dotenv.load();
const app = new Koa();

app.use(serve(path.join(__dirname, 'public')));
app.use(koaLogger());

const router = new Router();
router
  .get('/', (ctx) => {
    ctx.render('index.pug');
  });
app.use(router.routes());

const rollbar = new Rollbar(process.env.ROLLBAR);
app.on('error', (err, ctx) => {
  rollbar.log(err.message, ctx.request);
});

const pug = new Pug({
  viewPath: path.join(__dirname, 'views'),
  // noCache: process.env.NODE_ENV === 'development',
  // debug: true,
  // pretty: true,
  // compileDebug: true,
  // locals: [],
  // basedir: path.join(__dirname, 'views'),
  // helperPath: [
  //   { _ },
  //   { urlFor: (...args) => router.url(...args) },
  // ],
});
pug.use(app);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
