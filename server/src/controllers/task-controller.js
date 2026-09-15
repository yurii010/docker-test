import * as taskService from '../services/task-service.js';
import { HttpError } from '../middleware/http-error.js';
import {
  parseStatus,
  parseTaskId,
  validateCreateTask,
  validateUpdateTask,
} from '../validators/task-validator.js';

export async function getTasks(req, res) {
  const status = parseStatus(req.query.status);
  const tasks = await taskService.findTasks(status);
  res.json(tasks);
}

export async function getTaskById(req, res) {
  const id = parseTaskId(req.params.id);
  const task = await taskService.findTaskById(id);
  if (!task) {
    throw new HttpError(404, `Task with id ${id} not found`);
  }
  res.json(task);
}

export async function createTask(req, res) {
  const data = validateCreateTask(req.body);
  const task = await taskService.createTask(data);
  res.status(201).json(task);
}

export async function updateTask(req, res) {
  const id = parseTaskId(req.params.id);
  const fields = validateUpdateTask(req.body);
  const task = await taskService.updateTask(id, fields);
  if (!task) {
    throw new HttpError(404, `Task with id ${id} not found`);
  }
  res.json(task);
}

export async function deleteTask(req, res) {
  const id = parseTaskId(req.params.id);
  const deleted = await taskService.deleteTask(id);
  if (!deleted) {
    throw new HttpError(404, `Task with id ${id} not found`);
  }
  res.status(204).end();
}
