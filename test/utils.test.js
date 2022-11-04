import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { StatusCodes as HTTP_CODE } from 'http-status-codes';

import app from '../src/app.js';
import { createUser } from '../src/controllers/user.controller.js';
const URL_BASE = '/api/utils';

describe('Utils', () => {
  let mongoServer;
  const user = {
    name: 'Test',
    email: 'test@test.cl',
    password: 'User1234',
  };

  const admin = {
    name: 'Admin',
    email: 'admin@test.cl',
    password: 'Admin123',
    isAdmin: true,
  };

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
    await createUser(user);
    await createUser(admin);
    await request(app)
      .post('/api/auth/login')
      .send(user)
      .then((res) => {
        user.token = res.body.token;
      });
    await request(app)
      .post('/api/auth/login')
      .send(admin)
      .then((res) => {
        admin.token = res.body.token;
      });
  });

  afterAll(async () => {
    await mongoServer.stop();
    await mongoose.connection.close();
  });

  it('should return pong', async () => {
    const response = await request(app).get(`${URL_BASE}/ping`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('pong');
  });

  it('should return FORBIDDEN status', async () => {
    const response = await request(app).get(`${URL_BASE}/private/ping`);
    expect(response.status).toBe(HTTP_CODE.FORBIDDEN);
    expect(response.body.message).toBe('Forbidden');
  });

  it('should return UNAUTHORIZED status', async () => {
    const response = await request(app)
      .get(`${URL_BASE}/private/ping`)
      .send({ token: 'invalid-token' });
    expect(response.status).toBe(HTTP_CODE.UNAUTHORIZED);
    expect(response.body.message).toBe('Unauthorized');
  });

  it('should return OK status on login', async () => {
    const response = await request(app)
      .get(`${URL_BASE}/private/ping`)
      .send({ token: user.token });
    expect(response.status).toBe(HTTP_CODE.OK);
    expect(response.body.message).toBe('pong');
  });

  it('should return FORBIDDEN status on admin', async () => {
    const response = await request(app)
      .get(`${URL_BASE}/admin/ping`)
      .send({ token: user.token });
    expect(response.status).toBe(HTTP_CODE.FORBIDDEN);
    expect(response.body.message).toBe('Forbidden');
  });

  it('should return OK status on admin', async () => {
    const response = await request(app)
      .get(`${URL_BASE}/admin/ping`)
      .send({ token: admin.token });
    expect(response.status).toBe(HTTP_CODE.OK);
    expect(response.body.message).toBe('pong');
  });
});