export default (router) => {
  router
    .get('root', '/', (ctx) => {
      ctx.state.pageTitle = 'Aethra Task Manager';
      ctx.render('pages/root');
    })
    .get('about', '/about', (ctx) => {
      ctx.state.pageTitle = 'About';
      ctx.render('pages/about');
    });
};
