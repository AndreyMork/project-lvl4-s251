export default (router) => {
  router
    .get('root', '/', (ctx) => {
      ctx.render('pages/root', { pageTitle: 'Aethra Task Manger' });
    })
    .get('about', '/about', (ctx) => {
      ctx.render('pages/about', { pageTitle: 'About' });
    });
};
