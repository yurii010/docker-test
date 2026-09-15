import { TaskItem } from './TaskItem.jsx';

export function TaskList({ tasks, onUpdate, onDelete }) {
  if (tasks.length === 0) {
    return <p className="muted">No tasks found</p>;
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onUpdate={onUpdate} onDelete={onDelete} />
      ))}
    </ul>
  );
}
