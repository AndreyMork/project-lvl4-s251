import 'dotenv/config';
import request from 'supertest';
import faker from 'faker';
import app from '..';
import container from '../container';

const { db } = container;

describe('users', () => {
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

  it('#new', async () => {
    await agent
      .get('/users/new')
      .expect(200);
  });

  it('#create fail', async () => {
    await agent
      .post('/users')
      .send({
        form: {
          email: faker.internet.email(),
          password: faker.internet.password(2),
        },
      })
      .expect(200);

    const { count } = await db.User.findAndCount();
    expect(count).toBe(0);
  });

  const password = faker.internet.password();
  it('#create success', async () => {
    await agent
      .post('/users')
      .send({
        form: {
          password,
          email: faker.internet.email(),
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
        },
      })
      .expect(302);

    const { count } = await db.User.findAndCount();
    expect(count).toBe(1);
    await agent
      .delete('/session');
  });

  it('#index', async () => {
    await agent
      .get('/users')
      .expect(200);
  });

  it('#show', async () => {
    await agent
      .get('/users/1')
      .expect(200);
  });
});
