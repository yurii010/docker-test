import express from 'express';
import cors from 'cors';
import { taskRouter } from './routes/task-routes.js';
import { healthRouter } from './routes/health-routes.js';
import { notFoundHandler } from './middleware/not-found-handler.js';
import { errorHandler } from './middleware/error-handler.js';

export const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  }),
);
app.use(express.json());

app.use('/api/health', healthRouter);
app.use('/api/tasks', taskRouter);

app.use(notFoundHandler);
app.use(errorHandler);
