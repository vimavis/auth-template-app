import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

import { PORT_APP } from './config.js';
app.set('port', PORT_APP);

import dbMiddleware from './middlewares/database.js';

// routes

import utilsRoutes from './routes/utils.routes.js';
app.use('/api/utils', dbMiddleware, utilsRoutes);

import authRoutes from './routes/auth.routes.js';
app.use('/api/auth', dbMiddleware, authRoutes);

export default app;
