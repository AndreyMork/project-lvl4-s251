import container from '../container';

const { db } = container;

export default (router) => {
  router
    .get('newSession', '/sessions/new', (ctx) => {
      ctx.state.pageTitle = 'Sign In';
      ctx.render('sessions/new');
    })
    .post('session', '/session', async (ctx) => {
      const { email, password } = ctx.request.body;
      const user = await db.findUser(email.toLowerCase());

      if (user && user.password === password) {
        ctx.session.userId = user.id;
        ctx.redirect(router.url('root'));
        return;
      }

      ctx.flash.set({ type: 'danger', text: 'email or password were wrong' });
      ctx.redirect(router.url('newSession'));
    })
    .delete('session', '/session', (ctx) => {
      ctx.session = {};
      ctx.redirect(router.url('root'));
    });
};
