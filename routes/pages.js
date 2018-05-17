export default (router) => {
  router
    .get('root', '/', (ctx) => {
      ctx.render('welcome/index', { pageTitle: 'Aethra Task Manager' });
    })
    .get('about', '/about', (ctx) => {
      ctx.render('about.pug', { pageTitle: 'About' });
    });
};
