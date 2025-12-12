import React from 'react';
import { CheckSquare, AlertCircle } from 'lucide-react';
import TaskItem from './TaskItem';
import { Task } from '../types';
import '../styles/TaskList.css';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  isLoading?: boolean;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onToggleComplete,
  onEditTask,
  onDeleteTask,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="task-list-loading">
        <div className="loading-spinner"></div>
        <p>Loading tasks...</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="task-list-empty">
        <CheckSquare size={48} className="empty-icon" />
        <h3>No tasks found</h3>
        <p>Create your first task to get started organizing your work!</p>
      </div>
    );
  }

  const completedTasks = tasks.filter(task => task.completed);
  const pendingTasks = tasks.filter(task => !task.completed);
  const overdueTasks = pendingTasks.filter(task => 
    task.dueDate && task.dueDate < new Date()
  );

  return (
    <div className="task-list">
      {overdueTasks.length > 0 && (
        <div className="task-section overdue">
          <div className="section-header">
            <AlertCircle size={20} className="section-icon" />
            <h3 className="section-title">
              Overdue ({overdueTasks.length})
            </h3>
          </div>
          <div className="task-grid">
            {overdueTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onToggleComplete={onToggleComplete}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
              />
            ))}
          </div>
        </div>
      )}

      {pendingTasks.filter(task => !task.dueDate || task.dueDate >= new Date()).length > 0 && (
        <div className="task-section pending">
          <div className="section-header">
            <CheckSquare size={20} className="section-icon" />
            <h3 className="section-title">
              Pending ({pendingTasks.filter(task => !task.dueDate || task.dueDate >= new Date()).length})
            </h3>
          </div>
          <div className="task-grid">
            {pendingTasks
              .filter(task => !task.dueDate || task.dueDate >= new Date())
              .map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggleComplete={onToggleComplete}
                  onEdit={onEditTask}
                  onDelete={onDeleteTask}
                />
              ))}
          </div>
        </div>
      )}

      {completedTasks.length > 0 && (
        <div className="task-section completed">
          <div className="section-header">
            <CheckSquare size={20} className="section-icon completed" />
            <h3 className="section-title">
              Completed ({completedTasks.length})
            </h3>
          </div>
          <div className="task-grid">
            {completedTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onToggleComplete={onToggleComplete}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;