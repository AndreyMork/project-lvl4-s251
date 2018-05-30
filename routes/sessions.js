import models from '../models';
import { buildFormObj } from '../lib';
import encrypt from '../lib/encrypt';

const { User } = models;
export default (router) => {
  router
    .get('newSession', '/sessions/new', (ctx) => {
      const { email } = ctx.session;
      delete ctx.session.email;
      ctx.state.formObj = buildFormObj({ email });

      ctx.state.pageTitle = 'Sign In';
      ctx.render('sessions/new');
    })
    .post('session', '/session', async (ctx) => {
      const { email, password } = ctx.request.body.form;
      const user = await User.findOne({
        where: {
          email,
        },
      });

      if (user && user.passwordDigest === encrypt(password)) {
        ctx.session.userId = user.id;
        ctx.redirect(router.url('root'));
        return;
      }

      ctx.flash.set({ type: 'danger', text: 'email or password were wrong' });
      ctx.session.email = email;
      ctx.redirect(router.url('newSession'));
    })
    .delete('session', '/session', (ctx) => {
      ctx.session = {};
      ctx.redirect(router.url('root'));
    });
};
