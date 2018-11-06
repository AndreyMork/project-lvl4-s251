import 'dotenv/config';
import request from 'supertest';
import app from '..';


describe('simple pages', () => {
  let server;
  beforeAll(async () => {
    server = app().listen();
  });

  afterAll((done) => {
    server.close();
    done();
  });

  it('root', async () => {
    await request.agent(server)
      .get('/')
      .expect(200);
  });

  it('about', async () => {
    await request.agent(server)
      .get('/about')
      .expect(200);
  });

  it('not found', async () => {
    await request.agent(server)
      .get('/notFound')
      .expect(404);
  });
});
