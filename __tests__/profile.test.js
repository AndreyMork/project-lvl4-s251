import 'dotenv/config';
import request from 'supertest';
import faker from 'faker';
import app from '..';
import container from '../container';

const { db } = container;

describe('profile', () => {
  const password = faker.internet.password();
  const email = faker.internet.email();

  let server;
  let agent;
  beforeAll(async () => {
    server = app().listen();
    agent = request.agent(server);
    await db.sequelize.sync({ force: true });
    const userData = { email, password };
    await db.User.create(userData);
    await agent
      .post('/session')
      .send({ form: userData });
  });

  afterAll((done) => {
    server.close();
    done();
  });

  it('#show', async () => {
    await agent
      .get('/account')
      .expect(200);
  });

  it('#edit', async () => {
    await agent
      .get('/account/profile/edit')
      .expect(200);
  });

  it('#update fail', async () => {
    await db.User.create({
      email: 'test@mail.com',
      password: 'aaaa',
    });
    await agent
      .put('/account/profile/')
      .send({
        form: {
          email: 'test@mail.com',
        },
      })
      .expect(200);

    const user = await db.User.findById(1);
    expect(user.email).not.toBe('test@mail.com');
  });

  it('#update success', async () => {
    await agent
      .put('/account/profile/')
      .send({
        form: {
          firstName: 'New',
          lastName: 'Name',
        },
      })
      .expect(302);

    const user = await db.User.findById(1);
    expect(user.fullName).toBe('New Name');
  });

  it('#editPassword', async () => {
    await agent
      .get('/account/password/edit')
      .expect(200);
  });
  //
  it('#updatePassword confirmed fail', async () => {
    await agent
      .put('/account/password')
      .send({
        form: {
          oldPassword: password,
          newPassword: 'newPassword',
          confirmedNewPassword: 'newPassword2',
        },
      })
      .expect('location', '/account/password/edit');
  });

  it('#updatePassword wrong password fail', async () => {
    await agent
      .put('/account/password')
      .send({
        form: {
          oldPassword: `wrong${password}`,
          newPassword: 'newPassword',
          confirmedNewPassword: 'newPassword2',
        },
      })
      .expect('location', '/account/password/edit');
  });

  it('#updatePassword short password fail', async () => {
    await agent
      .put('/account/password')
      .send({
        form: {
          oldPassword: password,
          newPassword: '12',
          confirmedNewPassword: '12',
        },
      })
      .expect('location', '/account/password/edit');
  });

  it('#updatePassword success', async () => {
    await agent
      .put('/account/password')
      .send({
        form: {
          oldPassword: password,
          newPassword: 'newPassword',
          confirmedNewPassword: 'newPassword',
        },
      })
      .expect('location', '/account');
  });

  it('#delete', async () => {
    await agent
      .get('/account/profile/delete')
      .expect(200);
  });

  it('#destroy', async () => {
    await agent
      .delete('/account/profile')
      .expect('location', '/');

    const user = await db.User.findById(1);
    expect(user).toBeNull();
  });
});
