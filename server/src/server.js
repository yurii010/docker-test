import { app } from './app.js';
import { pool } from './db/pool.js';

const PORT = Number(process.env.PORT) || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

async function shutdown(signal) {
  console.log(`${signal} received, shutting down...`);
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
