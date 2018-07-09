import { buildFormObj, buildFlashMsg, encrypt } from '../lib';
import { User } from '../models';

export default (router) => {
  router
    // .get('userPage', '/users/my', async (ctx) => {
    //   const id = ctx.session.userId;
    //   const user = await User.findOne({ where: id });
    //
    //   ctx.state.user = user;
    //   ctx.state.isLoggedUser = true;
    //   ctx.state.pageTitle = user.fullName;
    //
    //   ctx.render('users/user');
    // })
    .get('profileEdit', '/account/profile/edit', async (ctx) => {
      const id = ctx.session.userId;
      const user = await User.findOne({ where: id });

      ctx.state.user = user;
      ctx.state.pageTitle = user.fullName;
      ctx.state.formObj = buildFormObj(user);

      ctx.render('users/profile');
    })
    .put('profileEdit', '/account/profile/edit', async (ctx) => {
      const id = ctx.session.userId;
      const user = await User.findOne({ where: id });

      const { form } = ctx.request.body;
      const { email, firstName, lastName } = form;

      try {
        await user.update({ email, firstName, lastName });
        // TODO: message
        ctx.flash.set(buildFlashMsg('Your profile has been updated', 'success'));

        ctx.state.pageTitle = user.fullName;
        ctx.redirect(router.url('user', user.id));
      } catch (err) {
        ctx.state.formObj = buildFormObj(user, err);
        // ctx.flash.set(buildFlahMsg('there was errors', 'danger'));
        ctx.state.user = user;
        ctx.state.pageTitle = user.fullName;
        ctx.render('users/profile');
      }
    })
    .get('changePassword', '/account/password/edit', async (ctx) => {
      const id = ctx.session.userId;
      const user = await User.findOne({ where: id });

      ctx.state.user = user;
      ctx.state.formObj = buildFormObj(user);
      ctx.state.pageTitle = user.fullName;

      ctx.render('users/changePassword');
    })
    .put('changePassword', '/account/password/edit', async (ctx) => {
      const id = ctx.session.userId;
      const user = await User.findOne({ where: id });

      const { form } = ctx.request.body;
      const { oldPassword, newPassword, confirmedNewPassword } = form;

      if (user.passwordDigest !== encrypt(oldPassword)) {
        ctx.flash.set(buildFlashMsg('Password is wrong', 'danger'));
        ctx.redirect(router.url('changePassword'));
      } else if (newPassword !== confirmedNewPassword) {
        ctx.flash.set(buildFlashMsg("Password confirmation doesn't match the password", 'danger'));
        ctx.redirect(router.url('changePassword'));
      } else {
        try {
          await user.update({ password: newPassword });

          ctx.flash.set(buildFlashMsg('Your password was successfully changed', 'success'));

          ctx.state.pageTitle = user.fullName;
          ctx.redirect(router.url('user', user.id));
        } catch (error) {
          // TODO: error message
          ctx.flash.set(buildFlashMsg('There was errors', 'danger'));
          ctx.redirect(router.url('changePassword'));
        }
      }
    })
    .get('userDelete', '/account/profile/delete', async (ctx) => {
      const id = ctx.session.userId;
      const user = await User.findOne({ where: id });

      ctx.state.user = user;
      ctx.state.pageTitle = user.fullName;

      ctx.render('users/delete');
    })
    .delete('userDelete', '/account/profile/delete', async (ctx) => {
      const id = ctx.session.userId;
      const user = await User.findOne({ where: id });

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
