import { HttpError } from './http-error.js';

export function errorHandler(error, req, res, next) {
  if (error instanceof HttpError) {
    return res.status(error.status).json({ error: error.message });
  }

  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON in request body' });
  }

  console.error(`${req.method} ${req.originalUrl} failed:`, error.message);
  return res.status(500).json({ error: 'Internal server error' });
}
