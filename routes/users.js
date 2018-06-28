import { buildFormObj, buildFlashMsg } from '../lib';
import { User } from '../models';

export default (router) => {
  router
    .get('users', '/users', async (ctx) => {
      const users = await User.findAll();

      ctx.state.users = users;
      ctx.state.pageTitle = 'Users';

      ctx.render('users');
    })
    .get('newUser', '/users/new', (ctx) => {
      const user = User.build();

      ctx.state.formObj = buildFormObj(user);
      ctx.state.pageTitle = 'Sign Up';

      ctx.render('users/new');
    })
    .post('users', '/users', async (ctx) => {
      const { form } = ctx.request.body;
      const user = User.build(form);

      try {
        await user.save();
        ctx.flash.set(buildFlashMsg('Your profile has been created', 'success'));
        ctx.session.userId = user.id;
        ctx.redirect(router.url('root'));
      } catch (err) {
        // TODO: error message
        ctx.state.formObj = buildFormObj(user, err);
        ctx.state.pageTitle = 'Sign Up';
        ctx.render('users/new');
      }
    })
    .get('user', '/users/:id', async (ctx) => {
      const id = Number(ctx.params.id);
      const user = await User.findOne({ where: id });

      ctx.state.user = user;
      ctx.state.isLoggedUser = (user.id === ctx.session.userId);
      ctx.state.pageTitle = user.fullName;

      ctx.render('users/user');
    });
};
