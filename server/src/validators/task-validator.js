import { HttpError } from '../middleware/http-error.js';

const TITLE_MAX_LENGTH = 255;
const DESCRIPTION_MAX_LENGTH = 2000;
const ALLOWED_STATUSES = ['all', 'active', 'completed'];
const UPDATABLE_FIELDS = ['title', 'description', 'completed'];

function validateTitle(title) {
  if (typeof title !== 'string' || title.trim().length === 0) {
    throw new HttpError(400, 'Title is required and must be a non-empty string');
  }
  if (title.trim().length > TITLE_MAX_LENGTH) {
    throw new HttpError(400, `Title must be at most ${TITLE_MAX_LENGTH} characters`);
  }
  return title.trim();
}

function validateDescription(description) {
  if (description === undefined || description === null) {
    return null;
  }
  if (typeof description !== 'string') {
    throw new HttpError(400, 'Description must be a string or null');
  }
  if (description.length > DESCRIPTION_MAX_LENGTH) {
    throw new HttpError(400, `Description must be at most ${DESCRIPTION_MAX_LENGTH} characters`);
  }
  return description.trim() || null;
}

function validateCompleted(completed) {
  if (typeof completed !== 'boolean') {
    throw new HttpError(400, 'Completed must be a boolean');
  }
  return completed;
}

function ensureObjectBody(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new HttpError(400, 'Request body must be a JSON object');
  }
}

export function parseTaskId(rawId) {
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) {
    throw new HttpError(400, 'Task id must be a positive integer');
  }
  return id;
}

export function parseStatus(rawStatus) {
  if (rawStatus === undefined) {
    return 'all';
  }
  if (!ALLOWED_STATUSES.includes(rawStatus)) {
    throw new HttpError(400, `Status must be one of: ${ALLOWED_STATUSES.join(', ')}`);
  }
  return rawStatus;
}

export function validateCreateTask(body) {
  ensureObjectBody(body);
  return {
    title: validateTitle(body.title),
    description: validateDescription(body.description),
  };
}

export function validateUpdateTask(body) {
  ensureObjectBody(body);

  const unknownFields = Object.keys(body).filter((field) => !UPDATABLE_FIELDS.includes(field));
  if (unknownFields.length > 0) {
    throw new HttpError(400, `Unknown fields: ${unknownFields.join(', ')}`);
  }

  const fields = {};
  if (body.title !== undefined) fields.title = validateTitle(body.title);
  if (body.description !== undefined) fields.description = validateDescription(body.description);
  if (body.completed !== undefined) fields.completed = validateCompleted(body.completed);

  if (Object.keys(fields).length === 0) {
    throw new HttpError(400, `Provide at least one field to update: ${UPDATABLE_FIELDS.join(', ')}`);
  }
  return fields;
}
