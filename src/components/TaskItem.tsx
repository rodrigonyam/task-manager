import React from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Calendar, 
  Flag, 
  Edit, 
  Trash2, 
  Clock,
  AlertCircle 
} from 'lucide-react';
import { Task } from '../types';
import { formatDate, getPriorityColor, isOverdue, getDaysUntilDue } from '../utils/helpers';
import '../styles/TaskItem.css';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
}) => {
  const isDue = task.dueDate && isOverdue(task.dueDate);
  const daysUntilDue = task.dueDate ? getDaysUntilDue(task.dueDate) : null;

  const handleToggleComplete = () => {
    onToggleComplete(task.id);
  };

  const handleEdit = () => {
    onEdit(task);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDelete(task.id);
    }
  };

  const getPriorityLabel = () => {
    return task.priority.charAt(0).toUpperCase() + task.priority.slice(1);
  };

  const getDueDateStatus = () => {
    if (!task.dueDate) return null;
    
    if (task.completed) {
      return { text: 'Completed', className: 'completed' };
    }
    
    if (isDue) {
      return { text: 'Overdue', className: 'overdue' };
    }
    
    if (daysUntilDue === 0) {
      return { text: 'Due today', className: 'due-today' };
    }
    
    if (daysUntilDue === 1) {
      return { text: 'Due tomorrow', className: 'due-soon' };
    }
    
    if (daysUntilDue && daysUntilDue > 0 && daysUntilDue <= 7) {
      return { text: `Due in ${daysUntilDue} days`, className: 'due-soon' };
    }
    
    return { text: formatDate(task.dueDate), className: 'due-later' };
  };

  const dueDateStatus = getDueDateStatus();

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <div className="task-main">
        <button
          className="task-toggle"
          onClick={handleToggleComplete}
          aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {task.completed ? (
            <CheckCircle2 size={20} className="check-icon completed" />
          ) : (
            <Circle size={20} className="check-icon" />
          )}
        </button>

        <div className="task-content">
          <div className="task-header">
            <h3 className="task-title">{task.title}</h3>
            <div className="task-meta">
              <span 
                className="task-priority" 
                style={{ backgroundColor: getPriorityColor(task.priority) }}
              >
                <Flag size={12} />
                {getPriorityLabel()}
              </span>
              {task.category && (
                <span className="task-category">{task.category}</span>
              )}
            </div>
          </div>

          {task.description && (
            <p className="task-description">{task.description}</p>
          )}

          <div className="task-footer">
            <div className="task-details">
              {task.dueDate && dueDateStatus && (
                <div className={`task-due-date ${dueDateStatus.className}`}>
                  {isDue && !task.completed ? (
                    <AlertCircle size={14} />
                  ) : (
                    <Calendar size={14} />
                  )}
                  <span>{dueDateStatus.text}</span>
                </div>
              )}
              
              {task.tags.length > 0 && (
                <div className="task-tags">
                  {task.tags.map((tag, index) => (
                    <span key={index} className="task-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="task-actions">
              <button
                className="task-action-button edit"
                onClick={handleEdit}
                aria-label="Edit task"
                title="Edit task"
              >
                <Edit size={16} />
              </button>
              <button
                className="task-action-button delete"
                onClick={handleDelete}
                aria-label="Delete task"
                title="Delete task"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="task-timestamp">
        <Clock size={12} />
        <span>Created {formatDate(task.createdAt)}</span>
        {task.updatedAt > task.createdAt && (
          <span>• Updated {formatDate(task.updatedAt)}</span>
        )}
      </div>
    </div>
  );
};

export default TaskItem;