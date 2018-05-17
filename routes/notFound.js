export default (router) => {
  router
    .all('notFound', '*', (ctx) => {
      ctx.status = 404;
      ctx.render('404.pug', { pageTitle: 'Not Found' });
    });
};
