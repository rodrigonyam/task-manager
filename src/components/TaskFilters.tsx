import React from 'react';
import { Search, Filter, SortDesc, Plus } from 'lucide-react';
import { TaskFilters, TaskSort, Priority } from '../types';
import { useDebounce } from '../hooks';
import '../styles/TaskFilters.css';

interface TaskFiltersProps {
  filters: TaskFilters;
  sort: TaskSort;
  onFiltersChange: (filters: Partial<TaskFilters>) => void;
  onSortChange: (sort: TaskSort) => void;
  onAddTask: () => void;
  taskCount: number;
}

const TaskFiltersComponent: React.FC<TaskFiltersProps> = ({
  filters,
  sort,
  onFiltersChange,
  onSortChange,
  onAddTask,
  taskCount,
}) => {
  const [searchValue, setSearchValue] = React.useState(filters.search);
  const debouncedSearch = useDebounce(searchValue, 300);

  // Update filters when debounced search changes
  React.useEffect(() => {
    onFiltersChange({ search: debouncedSearch });
  }, [debouncedSearch, onFiltersChange]);

  const statusOptions = [
    { value: 'all', label: 'All Tasks' },
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' },
    { value: 'overdue', label: 'Overdue' },
  ];

  const priorityOptions: { value: Priority | ''; label: string }[] = [
    { value: '', label: 'All Priorities' },
    { value: 'urgent', label: 'Urgent' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' },
  ];

  const sortOptions = [
    { field: 'createdAt', label: 'Created Date' },
    { field: 'dueDate', label: 'Due Date' },
    { field: 'priority', label: 'Priority' },
    { field: 'title', label: 'Title' },
  ] as const;

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    { value: 'Work', label: 'Work' },
    { value: 'Personal', label: 'Personal' },
    { value: 'Shopping', label: 'Shopping' },
    { value: 'Health', label: 'Health' },
    { value: 'Learning', label: 'Learning' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Travel', label: 'Travel' },
    { value: 'Home', label: 'Home' },
    { value: 'Other', label: 'Other' },
  ];

  const handleSortFieldChange = (field: TaskSort['field']) => {
    onSortChange({
      field,
      direction: sort.field === field && sort.direction === 'desc' ? 'asc' : 'desc',
    });
  };

  const clearAllFilters = () => {
    setSearchValue('');
    onFiltersChange({
      status: 'all',
      priority: undefined,
      category: undefined,
      search: '',
    });
  };

  const hasActiveFilters = 
    filters.search ||
    filters.status !== 'all' ||
    filters.priority ||
    filters.category;

  return (
    <div className="task-filters">
      <div className="filters-header">
        <div className="filters-title">
          <h2>Tasks</h2>
          <span className="task-count">
            {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
          </span>
        </div>
        <button
          onClick={onAddTask}
          className="add-task-button"
          aria-label="Add new task"
        >
          <Plus size={20} />
          Add Task
        </button>
      </div>

      <div className="filters-content">
        <div className="search-container">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filters-row">
          <div className="filter-group">
            <label className="filter-label">Status</label>
            <select
              value={filters.status}
              onChange={(e) => onFiltersChange({ status: e.target.value as any })}
              className="filter-select"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Priority</label>
            <select
              value={filters.priority || ''}
              onChange={(e) => onFiltersChange({ 
                priority: e.target.value as Priority || undefined 
              })}
              className="filter-select"
            >
              {priorityOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Category</label>
            <select
              value={filters.category || ''}
              onChange={(e) => onFiltersChange({ 
                category: e.target.value || undefined 
              })}
              className="filter-select"
            >
              {categoryOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Sort by</label>
            <div className="sort-container">
              <select
                value={sort.field}
                onChange={(e) => handleSortFieldChange(e.target.value as TaskSort['field'])}
                className="filter-select"
              >
                {sortOptions.map(option => (
                  <option key={option.field} value={option.field}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button
                onClick={() => onSortChange({ 
                  ...sort, 
                  direction: sort.direction === 'asc' ? 'desc' : 'asc' 
                })}
                className="sort-direction-button"
                aria-label={`Sort ${sort.direction === 'asc' ? 'descending' : 'ascending'}`}
                title={`Sort ${sort.direction === 'asc' ? 'descending' : 'ascending'}`}
              >
                <SortDesc 
                  size={16} 
                  className={sort.direction === 'asc' ? 'rotated' : ''}
                />
              </button>
            </div>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="clear-filters-button"
              title="Clear all filters"
            >
              <Filter size={16} />
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskFiltersComponent;