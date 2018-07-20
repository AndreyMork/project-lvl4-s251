import { buildFormObj, buildFlashMsg, encrypt } from '../lib';
import { User } from '../models';

export default (router) => {
  router
    .get('profile#edit', '/account/profile/edit', async (ctx) => {
      if (!ctx.state.isSignedIn()) {
        ctx.redirect(router.url('session#new'));
        return;
      }

      const id = ctx.session.userId;
      const user = await User.findOne({ where: id });

      const viewArgs = {
        user,
        pageTitle: 'Profile Settings',
        formObj: buildFormObj(user),
      };

      ctx.render('users/profile', viewArgs);
    })
    .put('profile#update', '/account/profile/edit', async (ctx) => {
      if (!ctx.state.isSignedIn()) {
        ctx.throw(401);
        return;
      }

      const id = ctx.session.userId;
      const user = await User.findById(id);

      const { form } = ctx.request.body;
      const { email, firstName, lastName } = form;

      try {
        await user.update({ email, firstName, lastName });
        // TODO: message
        ctx.flash.set(buildFlashMsg('Your profile has been updated', 'success'));
        ctx.redirect(router.url('users#show', user.id));
      } catch (err) {
        // ctx.flash.set(buildFlahMsg('there was errors', 'danger'));

        const viewArgs = {
          user,
          pageTitle: 'Profile Settings',
          formObj: buildFormObj(user, err),
        };

        ctx.render('users/profile', viewArgs);
      }
    })
    .get('profilePassword#edit', '/account/password/edit', async (ctx) => {
      if (!ctx.state.isSignedIn()) {
        ctx.redirect(router.url('session#new'));
        return;
      }

      const id = ctx.session.userId;
      const user = await User.findOne({ where: id });

      const viewArgs = {
        user,
        pageTitle: 'Change Password',
        formObj: buildFormObj(user),
      };

      ctx.render('users/changePassword', viewArgs);
    })
    .put('profilePassword#update', '/account/password', async (ctx) => {
      if (!ctx.state.isSignedIn()) {
        ctx.throw(401);
        return;
      }

      const id = ctx.session.userId;
      const user = await User.findOne({ where: id });

      const { form } = ctx.request.body;
      const { oldPassword, newPassword, confirmedNewPassword } = form;

      if (user.passwordDigest !== encrypt(oldPassword)) {
        ctx.flash.set(buildFlashMsg('Password is wrong', 'danger'));
        ctx.redirect(router.url('profilePassword#edit'));
      } else if (newPassword !== confirmedNewPassword) {
        ctx.flash.set(buildFlashMsg("Password confirmation doesn't match the password", 'danger'));
        ctx.redirect(router.url('profilePassword#edit'));
      } else {
        try {
          await user.update({ password: newPassword });

          ctx.flash.set(buildFlashMsg('Your password was successfully changed', 'success'));

          ctx.redirect(router.url('users#show', user.id));
        } catch (error) {
          // TODO: error message
          ctx.flash.set(buildFlashMsg('There was errors', 'danger'));
          ctx.redirect(router.url('profilePassword#edit'));
        }
      }
    })
    .get('profile#delete', '/account/profile/delete', async (ctx) => {
      if (!ctx.state.isSignedIn()) {
        ctx.redirect(router.url('session#new'));
        return;
      }

      const id = ctx.session.userId;
      const user = await User.findOne({ where: id });

      const viewArgs = {
        user,
        pageTitle: 'Delete Account',
      };

      ctx.render('users/delete', viewArgs);
    })
    .delete('profile#destroy', '/account/profile', async (ctx) => {
      if (!ctx.state.isSignedIn()) {
        ctx.throw(401);
        return;
      }

      const id = ctx.session.userId;
      const user = await User.findById(id);

      try {
        await user.destroy();
        ctx.flash.set(buildFlashMsg('Your profile was deleted', 'info'));
        delete ctx.session.userId;
      } catch (err) {
        // TODO: error message
        ctx.flash.set(buildFlashMsg('There were errors', 'danger'));
        console.error(err);
      }

      ctx.redirect(router.url('root'));
    });
};
