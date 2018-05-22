export default (router) => {
  router
    .all('notFound', '*', (ctx) => {
      ctx.status = 404;
      ctx.state.pageTitle = 'Not Found';
      ctx.render('pages/notFound');
    });
};
