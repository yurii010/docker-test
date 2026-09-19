import { useCallback, useEffect, useState } from 'react';
import * as tasksApi from './api/tasks-api.js';
import { TaskForm } from './components/TaskForm.jsx';
import { TaskFilter } from './components/TaskFilter.jsx';
import { TaskList } from './components/TaskList.jsx';

export function App() {
  const [tasks, setTasks] = useState([]);
  const [status, setStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadTasks = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      setTasks(await tasksApi.fetchTasks(status));
    } catch (requestError) {
      setError(tasksApi.getErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  }, [status]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const runAction = async (action) => {
    setError('');
    try {
      await action();
      await loadTasks();
      return true;
    } catch (requestError) {
      setError(tasksApi.getErrorMessage(requestError));
      return false;
    }
  };

  const handleCreate = (task) => runAction(() => tasksApi.createTask(task));
  const handleUpdate = (id, fields) => runAction(() => tasksApi.updateTask(id, fields));
  const handleDelete = (id) => runAction(() => tasksApi.deleteTask(id));

  return (
    <main className="container">
      <h1>task manager</h1>
      <TaskForm onCreate={handleCreate} />
      <TaskFilter value={status} onChange={setStatus} />
      {error && <p className="error">{error}</p>}
      {isLoading ? (
        <p className="muted">Loading...</p>
      ) : (
        <TaskList tasks={tasks} onUpdate={handleUpdate} onDelete={handleDelete} />
      )}
    </main>
  );
}
