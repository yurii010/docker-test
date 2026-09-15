import { Router } from 'express';
import {
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateTask,
} from '../controllers/task-controller.js';

export const taskRouter = Router();

taskRouter.get('/', getTasks);
taskRouter.get('/:id', getTaskById);
taskRouter.post('/', createTask);
taskRouter.patch('/:id', updateTask);
taskRouter.delete('/:id', deleteTask);
