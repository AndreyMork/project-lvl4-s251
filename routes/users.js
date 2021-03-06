import { buildFormObj, buildFlashMsg, validateIdInUrl } from '../lib';

export default (router, db) => {
  const { User } = db;

  router
    .get('users#index', '/users', async (ctx) => {
      const users = await User.scope('sorted').findAll();

      const viewArgs = {
        users,
        pageTitle: 'Users',
      };

      ctx.render('users', viewArgs);
    })
    .post('users#create', '/users', async (ctx) => {
      const { form } = ctx.request.body;
      const user = User.build(form);

      try {
        await user.save();
        ctx.flash.set(buildFlashMsg('Your profile has been created', 'success'));
        ctx.session.userId = user.id;
        ctx.redirect(router.url('root'));
      } catch (err) {
        // TODO: error message
        const viewArgs = {
          formObj: buildFormObj(user, err),
          pageTitle: 'Sign Up',
        };

        ctx.render('users/new', viewArgs);
      }
    })
    .get('users#new', '/users/new', (ctx) => {
      const user = User.build();

      const viewArgs = {
        formObj: buildFormObj(user),
        pageTitle: 'Sign Up',
      };

      ctx.render('users/new', viewArgs);
    })
    .get('users#show', '/users/:id', validateIdInUrl, async (ctx) => {
      const id = Number(ctx.params.id);

      const user = await User.findById(id);
      if (!user) {
        ctx.flash.set(buildFlashMsg(`User with id = ${id} doesn't exist`, 'warning'));
        ctx.redirect(router.url('users#index'));
        return;
      }

      if (id === ctx.session.userId) {
        ctx.redirect(router.url('profile#show'));
        return;
      }

      const viewArgs = {
        user,
        pageTitle: user.fullName,
      };

      ctx.render('users/user', viewArgs);
    });
};
