const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
];

export function TaskFilter({ value, onChange }) {
  return (
    <div className="filter">
      {FILTERS.map((filter) => (
        <button
          key={filter.value}
          type="button"
          className={filter.value === value ? 'active' : 'secondary'}
          onClick={() => onChange(filter.value)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
