import Koa from 'koa';
import serve from 'koa-static';
import koaLogger from 'koa-logger';
import Router from 'koa-router';
import Pug from 'koa-pug';
import Rollbar from 'rollbar';

import path from 'path';
// import _ from 'lodash';

export default () => {
  const app = new Koa();

  app.use(koaLogger());
  app.use(serve(path.join(__dirname, 'public')));

  const router = new Router();
  router
    .get('/', (ctx) => {
      ctx.render('welcome/index.pug', { pageTitle: 'Aethra Task Manager' });
    })
    .get('/about', (ctx) => {
      ctx.render('about.pug', { pageTitle: 'About' });
    });
  app.use(router.routes());

  const rollbar = new Rollbar(process.env.ROLLBAR_TOKEN);
  app.on('error', (err, ctx) => {
    console.error(err);
    rollbar.log(err, ctx.request);
  });

  const pug = new Pug({
    viewPath: path.join(__dirname, 'views'),
    basedir: path.join(__dirname, 'views'),
    debug: process.env.NODE_ENV === 'development',
    noCache: process.env.NODE_ENV === 'development',
    // locals: [],
    // helperPath: [
    //   { _ },
    //   { urlFor: (...args) => router.url(...args) },
    // ],
  });

  pug.use(app);

  return app;
};
