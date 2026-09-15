import { readFile } from 'node:fs/promises';
import { pool } from './pool.js';

const SQL_FILES = ['schema.sql', 'seed.sql'];

async function runSqlFile(fileName) {
  const sql = await readFile(new URL(fileName, import.meta.url), 'utf8');
  await pool.query(sql);
  console.log(`Executed ${fileName}`);
}

async function init() {
  try {
    for (const fileName of SQL_FILES) {
      await runSqlFile(fileName);
    }
    console.log('Database initialized');
  } catch (error) {
    console.error('Database initialization failed:', error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

init();
