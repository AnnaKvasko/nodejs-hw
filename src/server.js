import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errors } from 'celebrate';

import { connectMongoDB } from './db/connectMongoDB.js';

import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';

import notesRoutes from './routes/notesRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();

app.use(logger);
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);

app.use('/auth', authRoutes);
app.use('/notes', notesRoutes);
app.use('/users', userRoutes);

app.use(errors());
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connectMongoDB();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port: ${PORT}`);
  });
};

startServer();
