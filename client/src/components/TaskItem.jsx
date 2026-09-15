import { useState } from 'react';

export function TaskItem({ task, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? '');

  const startEditing = () => {
    setTitle(task.title);
    setDescription(task.description ?? '');
    setIsEditing(true);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    const saved = await onUpdate(task.id, { title, description });
    if (saved) setIsEditing(false);
  };

  if (isEditing) {
    return (
      <li className="card">
        <form className="task-form" onSubmit={handleSave}>
          <input
            type="text"
            value={title}
            maxLength={255}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
          <textarea
            value={description}
            maxLength={2000}
            rows={2}
            onChange={(event) => setDescription(event.target.value)}
          />
          <div className="actions">
            <button type="submit" disabled={!title.trim()}>
              Save
            </button>
            <button type="button" className="secondary" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className={`card task ${task.completed ? 'completed' : ''}`}>
      <div className="task-content">
        <h3>{task.title}</h3>
        {task.description && <p>{task.description}</p>}
        <small className="muted">{new Date(task.created_at).toLocaleString()}</small>
      </div>
      <div className="actions">
        <button type="button" onClick={() => onUpdate(task.id, { completed: !task.completed })}>
          {task.completed ? 'Uncomplete' : 'Complete'}
        </button>
        <button type="button" className="secondary" onClick={startEditing}>
          Edit
        </button>
        <button type="button" className="danger" onClick={() => onDelete(task.id)}>
          Delete
        </button>
      </div>
    </li>
  );
}
