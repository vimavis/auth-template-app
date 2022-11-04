import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import app from '../src/app.js';

const URL_BASE = '/api/auth';

describe('Auth', () => {
  let mongoServer;

  beforeEach(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  afterEach(async () => {
    await mongoServer.stop();
    await mongoose.connection.close();
  });

  describe('POST /api/auth/register', () => {
    it('should create a user', async () => {
      return await request(app)
        .post(`${URL_BASE}/register`)
        .send({
          name: 'juanito perez',
          email: 'example@domain.com',
          password: '123456Aa'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .then((res) => {
          expect(res.body).toHaveProperty('token');
        });
    });

    it('should return 400 if email is missing', async () => {
      return await request(app)
        .post(`${URL_BASE}/register`)
        .send({
          name: 'juanito perez',
          password: '12345678'
        })
        .expect(400)
        .expect('Content-Type', /json/)
        .then((res) => {
          expect(res.body).toHaveProperty('errors');
          expect(new Set(res.body.errors)).toContain("Email is required");
        });
    });

    it('should return 400 if name is missing', async () => {
      return await request(app)
        .post(`${URL_BASE}/register`)
        .send({
          email: 'example@domain.com',
          password: '12345678'
        })
        .expect(400)
        .expect('Content-Type', /json/)
        .then((res) => {
          expect(res.body).toHaveProperty('errors');
          expect(new Set(res.body.errors)).toContain("Name is required");
        });
    });

    it('should return 400 if password is missing', async () => {
      return await request(app)
        .post(`${URL_BASE}/register`)
        .send({
          name: 'juanito perez',
          email: 'example@domain.com',
        })
        .expect(400)
        .expect('Content-Type', /json/)
        .then((res) => {
          expect(res.body).toHaveProperty('errors');
          expect(new Set(res.body.errors)).toContain("Password is required");
        });
    });

    it('should return 400 if email already exists', async () => {
      await request(app)
        .post(`${URL_BASE}/register`)
        .send({
          name: 'juanito perez',
          email: 'example@domain.com',
          password: '123456Aa'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .then((res) => {
          expect(res.body).toHaveProperty('token');
        });
      return await request(app)
        .post(`${URL_BASE}/register`)
        .send({
          name: 'juanito perez',
          email: 'example@domain.com',
          password: '123456Aa'
        })
        .expect(400)
        .expect('Content-Type', /json/)
        .then((res) => {
          expect(res.body).toHaveProperty('errors');
          expect(new Set(res.body.errors)).toContain("Email already exists");
        });
    });

    it('should return 400 if email is invalid', async () => {
      return await request(app)
        .post(`${URL_BASE}/register`)
        .send({
          name: 'juanito perez',
          email: 'exampledomain.com',
          password: 'Password123'
        })
        .expect(400)
        .expect('Content-Type', /json/)
        .then((res) => {
          expect(res.body).toHaveProperty('errors');
          expect(new Set(res.body.errors)).toContain("Invalid email");
        });
    });

    it('should return 201 if email is corporate', async () => {
      return await request(app)
        .post(`${URL_BASE}/register`)
        .send({
          name: 'juanito perez',
          email: 'example@sub.domain.com',
          password: '123456Aa'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .then((res) => {
          expect(res.body).toHaveProperty('token');
        });
    });

    it('should return 400 if password is too short', async () => {
      return await request(app)
        .post(`${URL_BASE}/register`)
        .send({
          name: 'juanito perez',
          email: 'example@domain.com',
          password: '12345Aa'
        })
        .expect(400)
        .expect('Content-Type', /json/)
        .then((res) => {
          expect(res.body).toHaveProperty('errors');
          expect(new Set(res.body.errors)).toContain("The string should have a minimum length of 8 characters");
        });
    });

    it('should return 400 if password is too long', async () => {
      return await request(app)
        .post(`${URL_BASE}/register`)
        .send({
          name: 'juanito perez',
          email: 'example@domain.com',
          password: '12345Aa12345Aa12345Aa'
        })
        .expect(400)
        .expect('Content-Type', /json/)
        .then((res) => {
          expect(res.body).toHaveProperty('errors');
          expect(new Set(res.body.errors)).toContain("The string should have a maximum length of 20 characters");
        });
    });

    it('should return 400 if password is missing uppercase', async () => {
      return await request(app)
      .post(`${URL_BASE}/register`)
      .send({
        name: 'juanito perez',
        email: 'example@domain.com',
        password: '12345aa12345aa1234'
      })
      .expect(400)
      .expect('Content-Type', /json/)
      .then((res) => {
        expect(res.body).toHaveProperty('errors');
        expect(new Set(res.body.errors)).toContain("The string should have a minimum of 1 uppercase letter");
      });
    });

    it('should return 400 if password is missing lowercase', async () => {
      return await request(app)
      .post(`${URL_BASE}/register`)
      .send({
        name: 'juanito perez',
        email: 'example@domain.com',
        password: '12345AA12345AA1234'
      })
      .expect(400)
      .expect('Content-Type', /json/)
      .then((res) => {
        expect(res.body).toHaveProperty('errors');
        expect(new Set(res.body.errors)).toContain("The string should have a minimum of 1 lowercase letter");
      });
    });

  });

  describe('POST /api/auth/login', () => {
    it('should login user', async () => {
      const user = {
        name: 'Victor Vasquez',
        email: 'vvasquez@ing.ucsc.cl',
        password: 'Hola1234'
      };
      await request(app)
        .post(`${URL_BASE}/register`)
        .send(user)
        .expect(201)
        .expect('Content-Type', /json/)
        .then((res) => {
          expect(res.body).toHaveProperty('token');
        });
      return await request(app)
        .post(`${URL_BASE}/login`)
        .send(user)
        .expect(200)
        .expect('Content-Type', /json/)
        .then((res) => {
          expect(res.body).toHaveProperty('token');
        });
    });

    it('should not login user', async () => {
      const user = {
        name: 'Victor Vasquez',
        email: 'vvasquez@ing.ucsc.cl',
        password: 'Hola1234'
      };
      await request(app)
        .post(`${URL_BASE}/register`)
        .send(user)
        .expect(201)
        .expect('Content-Type', /json/)
        .then((res) => {
          expect(res.body).toHaveProperty('token');
        });
      return await request(app)
        .post(`${URL_BASE}/login`)
        .send({
          email: 'vvasquez@ing.ucsc.cl',
          password: '1234'
        })
        .expect(403)
        .expect('Content-Type', /json/)
        .then((res) => {
          expect(res.body).toHaveProperty('errors');
          expect(new Set(res.body.errors)).toContain("Wrong password");
        });
    });

    it('Missing email', async () => {
      const user = {
        password: '12345',
        email: ''
      };
      return await request(app)
        .post(`${URL_BASE}/login`)
        .send(user)
        .expect(400)
        .expect('Content-Type', /json/)
        .then((res) => {
          expect(res.body).toHaveProperty('errors');
          expect(new Set(res.body.errors)).toContain("Email is required");
      });
    });

    it('Missing password', async () => {
      const user = {
        email: 'vvasquez@ing.ucsc.cl',
        password: '',
      };
      return await request(app)
        .post(`${URL_BASE}/login`)
        .send(user)
        .expect(400)
        .expect('Content-Type', /json/)
        .then((res) => {
          expect(res.body).toHaveProperty('errors');
          expect(new Set(res.body.errors)).toContain("Password is required");
      });
    });

    it('invalid email', async () => {
      const user = {
        email: 'vvasquezing.ucsc.cl',
        password: '1234',
      };
      return await request(app)
        .post(`${URL_BASE}/login`)
        .send(user)
        .expect(400)
        .expect('Content-Type', /json/)
        .then((res) => {
          expect(res.body).toHaveProperty('errors');
          expect(new Set(res.body.errors)).toContain("Invalid email");
      });
    });

    it('user not found', async () => {
      const user = {
        email: 'vvasquez@ing.ucsc.cl',
        password: '1234',
      };
      return await request(app)
        .post(`${URL_BASE}/login`)
        .send(user)
        .expect(404)
        .expect('Content-Type', /json/)
        .then((res) => {
          expect(res.body).toHaveProperty('errors');
          expect(new Set(res.body.errors)).toContain("User not found");
      });
    });
  });

  describe('Permissions', () => {
    it('should 1 tobe 1', async () => {
      expect(1).toBe(1);
    });
  });
});

describe('Auth Errors 5XX', () => {
  it('should return 500 if an error occurs in register', async () => {
    return await request(app)
      .post(`${URL_BASE}/register`)
      .send({
        name: 'juanito perez',
        email: 'example@domain.com',
        password: '123456Aa'
      })
      .expect(500)
      .expect('Content-Type', /json/)
      .then((res) => {
        expect(res.body).toMatchObject({
          message: 'Database connection error'
        });
      });
  });

  it('should return 500 if an error occurs in login', async () => {
    return await request(app)
      .post(`${URL_BASE}/login`)
      .send({
        email: 'example@domain.com',
        password: '123456Aa'
      })
      .expect(500)
      .expect('Content-Type', /json/)
      .then((res) => {
        expect(res.body).toMatchObject({
          message: 'Database connection error'
        });
      });
  });
});
