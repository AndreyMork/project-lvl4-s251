import pages from './pages';
import user from './user';
import users from './users';
import sessions from './sessions';
import tasks from './tasks';
import statuses from './statuses';
import notFound from './notFound';

const controllers = [pages, user, users, sessions, tasks, statuses, notFound];

export default (router, { db }) => (
  controllers.forEach(controller => controller(router, db))
);
