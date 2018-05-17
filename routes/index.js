import welcome from './welcome';
import users from './users';
import sessions from './sessions';
import pages from './pages';

const controllers = [welcome, users, sessions, pages];

export default (router, container) => controllers.forEach(func => func(router, container));

