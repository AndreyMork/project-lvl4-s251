export default (router) => {
  router
    .get('root', '/', (ctx) => {
      ctx.render('pages/root', { pageTitle: 'Aethra Task Manager' });
    })
    .get('about', '/about', (ctx) => {
      ctx.render('pages/about', { pageTitle: 'About' });
    });
};
