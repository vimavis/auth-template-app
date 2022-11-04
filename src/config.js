import dotenv from 'dotenv';
dotenv.config();

export const PORT_APP = Number(process.env.PORT_APP) || 3000;
export const MONGO = {
  HOST:process.env.MONGO_HOST || 'localhost',
  PORT: Number(process.env.MONGO_PORT) || 27017,
  DB: process.env.MONGO_DB || 'database',
  USER: process.env.MONGO_USER || '',
  PASSWORD: process.env.MONGO_PASSWORD || ''
};

export const JWT_SECRET = process.env.JWT_SECRET || 'secret';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '86400';
export const ADMIN = {
  EMAIL: process.env.EMAIL_ADMIN || 'admin@app.com',
  PASSWORD: process.env.PASSWORD_ADMIN || 'Admin1234',
  NAME: process.env.NAME_ADMIN || 'Administrator'
};
