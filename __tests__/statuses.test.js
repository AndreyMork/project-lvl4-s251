import 'dotenv/config';
import request from 'supertest';
import app from '..';
import container from '../container';

const { db } = container;


describe('statuses', () => {
  let server;
  let agent;
  beforeAll(async () => {
    server = app().listen();
    agent = request.agent(server);
    await db.sequelize.sync({ force: true });
    const user = { email: 'test@mail.com', password: 'test' };
    await db.User.create(user);
    await agent
      .post('/session')
      .send({ form: user });
  });

  afterAll((done) => {
    server.close();
    done();
  });

  it('#new', async () => {
    await agent
      .get('/statuses/new')
      .expect(200);
  });

  it('#create', async () => {
    await agent
      .post('/statuses')
      .send({
        form: { name: 'new' },
      })
      .expect('location', '/statuses');
  });

  it('#index', async () => {
    await agent
      .get('/statuses')
      .expect(200);
  });

  it('#edit', async () => {
    await agent
      .get('/statuses/1/edit')
      .expect(200);
  });

  it('#update', async () => {
    await agent
      .put('/statuses/1')
      .send({
        form: { name: 'newName' },
      })
      .expect('location', '/statuses');

    const status = await db.TaskStatus.findById(1);
    expect(status.name).toBe('newName');
  });

  it('#delete', async () => {
    await agent
      .get('/statuses/1/delete')
      .expect(200);
  });

  it('#destroy', async () => {
    await agent
      .delete('/statuses/1')
      .expect('location', '/statuses');

    const status = await db.TaskStatus.findById(1);
    expect(status).toBeNull();
  });
});
