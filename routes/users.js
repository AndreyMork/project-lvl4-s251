// import buildFormObj from '../lib/formObjectBuilder';
import container from '../container';

const { User, validate } = container;

export default (router) => {
  router
    // .get('users', '/users', async (ctx) => {
    //   const users = await User.findAll();
    //   ctx.render('users', { users });
    // })
    .get('newUser', '/users/new', (ctx) => {
      ctx.flash.set('test message');

      // const user = User.build();
      // ctx.render('users/new', { f: buildFormObj(user) });
      ctx.render('users/new', { pageTitel: 'Sign Up', flash: ctx.session.flash });
    })
    // .post('users', '/users', async (ctx) => {
    //   const form = ctx.request.body.form;
    //   const user = User.build(form);
    //   try {
    //     await user.save();
    //     ctx.flash.set('User has been created');
    //     ctx.redirect(router.url('root'));
    //   } catch (e) {
    //     ctx.render('users/new', { f: buildFormObj(user, e) });
    //   }
    // })
    .post('users', '/users', (ctx) => {
      const {
        email,
        password,
        firstName,
        lastName,
      } = ctx.request.body;

      const user = new User(email, password, firstName, lastName);
      const errors = validate(user);
      if (errors) {
        ctx.redirect(ctx.router.url('newUser'));
      } else {
        ctx.redirect(ctx.router.url('root'));
      }
    });
};
