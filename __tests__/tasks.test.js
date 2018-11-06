import 'dotenv/config';
import request from 'supertest';
import app from '..';
import container from '../container';

const { db } = container;

describe('tasks', () => {
  let server;
  let agent;
  beforeAll(async () => {
    server = app().listen();
    agent = request.agent(server);
    await db.sequelize.sync({ force: true });
    const user = { email: 'test@mail.com', password: 'test' };
    await db.User.create(user);
    await db.TaskStatus.create({ name: 'new' });
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
      .get('/tasks/new')
      .expect(200);
  });

  it('#create', async () => {
    await agent
      .post('/tasks')
      .send({
        form: {
          name: 'New Task',
          description: 'Some Desc',
          assigneeId: 1,
          statusId: 1,
          tags: '',
        },
      })
      .expect('location', '/tasks');
  });

  it('#index', async () => {
    await agent
      .get('/tasks')
      .expect(200);
  });

  it('#show', async () => {
    await agent
      .get('/tasks/1')
      .expect(200);
  });


  it('#edit', async () => {
    await agent
      .get('/tasks/1/edit')
      .expect(200);
  });

  it('#update', async () => {
    await agent
      .put('/tasks/1')
      .send({
        form: {
          name: 'New Name',
          description: 'New Description',
          assigneeId: 1,
          statusId: 1,
          tags: '',
        },
      })
      .expect('location', '/tasks/1');

    const task = await db.Task.findById(1);
    expect(task.name).toBe('New Name');
    expect(task.description).toBe('New Description');
  });

  it('#delete', async () => {
    await agent
      .get('/tasks/1/delete')
      .expect(200);
  });

  it('#destroy', async () => {
    await agent
      .delete('/tasks/1')
      .expect('location', '/tasks');

    const task = await db.Task.findById(1);
    expect(task).toBeNull();
  });
});
