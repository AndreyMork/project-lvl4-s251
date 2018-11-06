import 'dotenv/config';
import request from 'supertest';
import app from '..';
import container from '../container';

const { db } = container;

describe('session', () => {
  const userData = {
    email: 'test@mail.com',
    password: 'test',
  };

  let server;
  let agent;
  beforeAll(async () => {
    server = app().listen();
    agent = request.agent(server);
    await db.sequelize.sync({ force: true });
    await db.User.create(userData);
  });

  afterAll((done) => {
    server.close();
    done();
  });

  it('#new', async () => {
    await agent
      .get('/session/new')
      .expect(200);
  });

  it('#create fail', async () => {
    await agent
      .post('/session')
      .send({ form: {} })
      .expect('location', '/session/new');
  });

  it('#create success', async () => {
    await agent
      .post('/session')
      .send({ form: userData })
      .expect('location', '/');
  });

  it('#destroy', async () => {
    await agent
      .get('/tasks/new')
      .expect(200);
    await agent
      .delete('/session')
      .expect(302);
    await agent
      .post('/tasks')
      .expect(401);
  });
});
