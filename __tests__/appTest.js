import request from 'supertest';
import dotenv from 'dotenv';
import app from '..';

const routes = {
  root: {
    url: '/',
    status: 200,
  },
  about: {
    url: '/about',
    status: 200,
  },
  newUser: {
    url: '/users/new',
    status: 200,
  },
  notFound: {
    url: '/wrong-path',
    status: 404,
  },
};

dotenv.load();

describe('requests', () => {
  let server;

  beforeEach(() => {
    server = app().listen();
  });

  it('routes', async () => {
    await Promise.all(Object.values(routes).map(route => (
      request.agent(server)
        .get(route.url)
        .expect(route.status)
    )));
  });

  afterEach((done) => {
    server.close();
    done();
  });
});
