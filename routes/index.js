import pages from './pages';
import user from './user';
import users from './users';
import sessions from './sessions';
import tasks from './tasks';
import notFound from './notFound';

const controllers = [pages, user, users, sessions, tasks, notFound];

export default (router, container) => (
  controllers.forEach(controller => controller(router, container))
);
