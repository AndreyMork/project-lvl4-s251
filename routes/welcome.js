export default (router) => {
  router.get('root', '/', (ctx) => {
    ctx.render('welcome/index', { pageTitle: 'Aethra Task Manager' });
  });
};
