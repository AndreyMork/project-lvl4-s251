import 'dotenv/config';
import request from 'supertest';
import app from '..';
import container from '../container';

const { db } = container;


describe('unathorized', () => {
  let server;
  let agent;
  beforeAll(async () => {
    server = app().listen();
    agent = request.agent(server);
    await db.sequelize.sync({ force: true });
  });

  afterAll((done) => {
    server.close();
    done();
  });

  it('#new task', async () => {
    await agent
      .get('/tasks/new')
      .expect(302);
  });

  it('#create task', async () => {
    await agent
      .post('/tasks')
      .expect(401);
  });

  it('#edit task', async () => {
    await agent
      .get('/tasks/1/edit')
      .expect(302);
  });

  it('#new status', async () => {
    await agent
      .get('/statuses/new')
      .expect(302);
  });

  it('#create status', async () => {
    await agent
      .post('/statuses')
      .expect(401);
  });
});
