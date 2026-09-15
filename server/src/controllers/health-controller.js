import { checkDatabase } from '../services/task-service.js';

export async function getHealth(req, res) {
  try {
    await checkDatabase();
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    console.error('Health check failed:', error.message);
    res.status(503).json({ status: 'error', database: 'disconnected' });
  }
}
