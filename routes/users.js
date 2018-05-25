// import buildFormObj from '../lib/formObjectBuilder';
import lib from '../lib';
import models from '../models';

const { User } = models;

export default (router) => {
  router
    .get('users', '/users', async (ctx) => {
      const users = await User.findAll();

      ctx.state.users = users;
      ctx.state.pageTitle = 'Users';

      ctx.render('users');
    })
    .get('newUser', '/users/new', (ctx) => {
      // const user = User.build();
      ctx.state.pageTitle = 'Sign Up';
      ctx.render('users/new');
    })
    .post('users', '/users', async (ctx) => {
      // const {
      //   email,
      //   password,
      //   firstName,
      //   lastName,
      // } = ctx.request.body;
      const form = ctx.request.body;
      const user = User.build(form);

      try {
        await user.save();
        ctx.flash.set(lib.buildFlashMsg('User has been created', 'success'));
        ctx.session.userId = user.id;
        ctx.redirect(ctx.router.url('root'));
      } catch (err) {
        console.error(err);
        ctx.flash.set(lib.buildFlashMsg('some errors', 'danger'));
        ctx.redirect(ctx.router.url('newUser'));
      }
    });
};
