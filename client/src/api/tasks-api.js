import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

export function getErrorMessage(error) {
  return error.response?.data?.error || error.message || 'Something went wrong';
}

export async function fetchTasks(status) {
  const { data } = await apiClient.get('/tasks', { params: { status } });
  return data;
}

export async function createTask(task) {
  const { data } = await apiClient.post('/tasks', task);
  return data;
}

export async function updateTask(id, fields) {
  const { data } = await apiClient.patch(`/tasks/${id}`, fields);
  return data;
}

export async function deleteTask(id) {
  await apiClient.delete(`/tasks/${id}`);
}
