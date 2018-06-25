import { buildFormObj, buildFlashMsg } from '../lib';
import models from '../models';
import encrypt from '../lib/encrypt';


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
        ctx.flash.set(buildFlashMsg('User has been created', 'success'));
        ctx.session.userId = user.id;
        ctx.redirect(router.url('root'));
      } catch (err) {
        ctx.state.formObj = buildFormObj(user, err);
        ctx.state.pageTitle = 'Sign Up';
        ctx.render('users/new');
      }
    })
    .get('userPage', '/users/my', async (ctx) => {
      const id = ctx.session.userId;
      const user = await User.findOne({ where: id });

      ctx.state.user = user;
      ctx.state.isLoggedUser = true;
      ctx.state.pageTitle = user.fullName;

      ctx.render('users/user');
    })
    .get('userSettings', '/users/settings', async (ctx) => {
      const id = ctx.session.userId;
      const user = await User.findOne({ where: id });

      ctx.state.user = user;
      ctx.state.isLoggedUser = true;
      ctx.state.pageTitle = user.fullName;

      ctx.render('users/settings');
    })
    .put('userSettings', '/users/settings', async (ctx) => {
      const id = ctx.session.userId;
      const user = await User.findOne({ where: id });

      const { email, firstName, lastName } = ctx.request.body;

      try {
        await user.update({ email, firstName, lastName });
        ctx.flash.set({ text: 'your data changed', type: 'success' });

        ctx.state.pageTitle = user.fullName;
        ctx.redirect(router.url('userPage'));
      } catch (error) {
        ctx.flash.set({ text: 'there was errors', type: 'danger' });
        ctx.state.pageTitle = user.fullName;
        ctx.redirect(router.url('userSettings'));
      }
    })
    .get('changePassword', '/users/newPassword', async (ctx) => {
      const id = ctx.session.userId;
      const user = await User.findOne({ where: id });

      ctx.state.user = user;
      ctx.state.isLoggedUser = true;
      ctx.state.pageTitle = user.fullName;

      ctx.render('users/newPassword');
    })
    .put('changePassword', '/users/newPassword', async (ctx) => {
      const id = ctx.session.userId;
      const user = await User.findOne({ where: id });

      const { oldPassword, newPassword } = ctx.request.body;

      if (user.passwordDigest !== encrypt(oldPassword)) {
        ctx.flash.set({ text: 'password is wrong', type: 'danger' });
        ctx.redirect(router.url('changePassword'));
      }

      try {
        await user.update({ password: newPassword });

        ctx.flash.set({ text: 'password changed', type: 'success' });

        ctx.state.pageTitle = user.fullName;
        ctx.redirect(router.url('userPage'));
      } catch (error) {
        ctx.flash.set({ text: 'there was errors', type: 'danger' });
        ctx.state.pageTitle = user.fullName;
        ctx.redirect(router.url('changePassword'));
      }
    })
    .get('user', '/users/:id', async (ctx) => {
      const id = Number(ctx.params.id);
      const user = await User.findOne({ where: id });

      ctx.state.user = user;
      ctx.state.isLoggedUser = (user.id === ctx.session.userId);
      ctx.state.pageTitle = user.fullName;

      ctx.render('users/user');
    })
    .delete('userDelete', '/users/:id', async (ctx) => {
      const id = Number(ctx.params.id);
      const user = await User.findOne({ where: id });
      try {
        await user.destroy();
        ctx.session = {};
      } catch (err) {
        ctx.flash.set({ text: 'There were errors', type: 'danger' });
        console.log(err);
      }

      ctx.redirect(router.url('root'));
    });
};
