// import buildFormObj from '../lib/formObjectBuilder';
import { buildFlashMsg } from '../lib';
import User from '../entities/User';
import container from '../container';

const { db, validate } = container;

export default (router) => {
  router
    .get('users', '/users', async (ctx) => {
      // const users = await User.findAll();
      const users = await db.getUsers();

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
      const {
        email,
        password,
        firstName,
        lastName,
      } = ctx.request.body;

      const user = new User(email, password, firstName, lastName);
      const errors = validate(user);
      if (errors) {
        ctx.flash.set(buildFlashMsg(Object.values(errors)[0], 'danger'));
        ctx.redirect(ctx.router.url('newUser'));
      } else {
        await db.insertUser(user);
        ctx.flash.set(buildFlashMsg('User has been created', 'success'));
        ctx.redirect(ctx.router.url('root'));
      }
    });
};
