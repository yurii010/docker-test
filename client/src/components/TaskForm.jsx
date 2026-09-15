import { useState } from 'react';

export function TaskForm({ onCreate }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    const created = await onCreate({ title, description });
    setIsSubmitting(false);

    if (created) {
      setTitle('');
      setDescription('');
    }
  };

  return (
    <form className="card task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Task title"
        value={title}
        maxLength={255}
        onChange={(event) => setTitle(event.target.value)}
        required
      />
      <textarea
        placeholder="Description (optional)"
        value={description}
        maxLength={2000}
        rows={2}
        onChange={(event) => setDescription(event.target.value)}
      />
      <button type="submit" disabled={isSubmitting || !title.trim()}>
        {isSubmitting ? 'Adding...' : 'Add task'}
      </button>
    </form>
  );
}
