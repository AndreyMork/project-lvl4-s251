export default (router) => {
  router
    .get('/about', (ctx) => {
      ctx.render('about.pug', { pageTitle: 'About' });
    })
    .get('*', (ctx) => {
      ctx.status = 404;
      ctx.render('404.pug', { pageTitle: 'Not Found' });
    });
};
