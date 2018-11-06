import {
  buildFormObj,
  buildFlashMsg,
  encrypt,
  requiredAuth,
} from '../lib';

export default (router, db) => {
  const { User } = db;

  router
    .get('profile#show', '/account', requiredAuth, async (ctx) => {
      const id = ctx.session.userId;
      const user = await User.findOne({ where: id });

      const viewArgs = {
        user,
        pageTitle: user.fullName,
      };

      ctx.render('profile/index', viewArgs);
    })
    .get('profile#edit', '/account/profile/edit', requiredAuth, async (ctx) => {
      const id = ctx.session.userId;
      const user = await User.findOne({ where: id });

      const viewArgs = {
        user,
        pageTitle: 'Profile Settings',
        formObj: buildFormObj(user),
      };

      ctx.render('profile/edit', viewArgs);
    })
    .put('profile#update', '/account/profile', requiredAuth, async (ctx) => {
      const id = ctx.session.userId;
      const user = await User.findById(id);

      const { form } = ctx.request.body;

      try {
        await user.update(form, { fields: ['email', 'firstName', 'lastName'] });
        // TODO: message
        ctx.flash.set(buildFlashMsg('Your profile has been updated', 'success'));
        ctx.redirect(router.url('profile#show'));
      } catch (err) {
        // ctx.flash.set(buildFlahMsg('there was errors', 'danger'));

        const viewArgs = {
          user,
          pageTitle: 'Profile Settings',
          formObj: buildFormObj(user, err),
        };

        ctx.render('profile/edit', viewArgs);
      }
    })
    .get('profilePassword#edit', '/account/password/edit', requiredAuth, async (ctx) => {
      const id = ctx.session.userId;
      const user = await User.findOne({ where: id });

      const viewArgs = {
        user,
        pageTitle: 'Change Password',
        formObj: buildFormObj(user),
      };

      ctx.render('profile/changePassword', viewArgs);
    })
    .put('profilePassword#update', '/account/password', requiredAuth, async (ctx) => {
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

          ctx.redirect(router.url('profile#show'));
        } catch (error) {
          // TODO: error message
          ctx.flash.set(buildFlashMsg('There was errors', 'danger'));
          ctx.redirect(router.url('profilePassword#edit'));
        }
      }
    })
    .get('profile#delete', '/account/profile/delete', requiredAuth, async (ctx) => {
      const id = ctx.session.userId;
      const user = await User.findOne({ where: id });

      const viewArgs = {
        user,
        pageTitle: 'Delete Account',
      };

      ctx.render('profile/delete', viewArgs);
    })
    .delete('profile#destroy', '/account/profile', requiredAuth, async (ctx) => {
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
