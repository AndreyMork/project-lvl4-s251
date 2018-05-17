export default (router) => {
  router
    .get('root', '/', (ctx) => {
      ctx.render('pages/welcome', { pageTitle: 'Aethra Task Manager' });
    })
    .get('about', '/about', (ctx) => {
      ctx.render('pages/about', { pageTitle: 'About' });
    });
};
