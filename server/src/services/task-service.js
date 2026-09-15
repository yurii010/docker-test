import { pool } from '../db/pool.js';

const TASK_COLUMNS = 'id, title, description, completed, created_at';

const STATUS_FILTERS = {
  all: '',
  active: 'WHERE completed = FALSE',
  completed: 'WHERE completed = TRUE',
};

export async function findTasks(status = 'all') {
  const { rows } = await pool.query(
    `SELECT ${TASK_COLUMNS} FROM tasks ${STATUS_FILTERS[status]} ORDER BY created_at DESC, id DESC`,
  );
  return rows;
}

export async function findTaskById(id) {
  const { rows } = await pool.query(`SELECT ${TASK_COLUMNS} FROM tasks WHERE id = $1`, [id]);
  return rows[0] ?? null;
}

export async function createTask({ title, description = null }) {
  const { rows } = await pool.query(
    `INSERT INTO tasks (title, description) VALUES ($1, $2) RETURNING ${TASK_COLUMNS}`,
    [title, description],
  );
  return rows[0];
}

export async function updateTask(id, fields) {
  const columns = Object.keys(fields);
  const setClause = columns.map((column, index) => `${column} = $${index + 1}`).join(', ');
  const values = columns.map((column) => fields[column]);

  const { rows } = await pool.query(
    `UPDATE tasks SET ${setClause} WHERE id = $${columns.length + 1} RETURNING ${TASK_COLUMNS}`,
    [...values, id],
  );
  return rows[0] ?? null;
}

export async function deleteTask(id) {
  const { rowCount } = await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
  return rowCount > 0;
}

export async function checkDatabase() {
  await pool.query('SELECT 1');
}
