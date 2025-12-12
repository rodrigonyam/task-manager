import React, { useState } from 'react';
import { useTask } from '../contexts/TaskContext';
import { useModal } from '../hooks';
import TaskFilters from '../components/TaskFilters';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import Modal from '../components/Modal';
import { Task, TaskFormData } from '../types';
import '../styles/Dashboard.css';

const Dashboard: React.FC = () => {
  const {
    filteredTasks,
    filters,
    sort,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    setFilters,
    setSort,
    isLoading,
  } = useTask();

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const addTaskModal = useModal();
  const editTaskModal = useModal();

  const handleAddTask = () => {
    setEditingTask(null);
    addTaskModal.openModal();
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    editTaskModal.openModal();
  };

  const handleSubmitTask = (data: TaskFormData) => {
    if (editingTask) {
      updateTask(editingTask.id, data);
      editTaskModal.closeModal();
    } else {
      addTask(data);
      addTaskModal.closeModal();
    }
    setEditingTask(null);
  };

  const handleCancelTask = () => {
    setEditingTask(null);
    addTaskModal.closeModal();
    editTaskModal.closeModal();
  };

  return (
    <div className="dashboard">
      <div className="dashboard-content">
        <TaskFilters
          filters={filters}
          sort={sort}
          onFiltersChange={setFilters}
          onSortChange={setSort}
          onAddTask={handleAddTask}
          taskCount={filteredTasks.length}
        />

        <TaskList
          tasks={filteredTasks}
          onToggleComplete={toggleTaskComplete}
          onEditTask={handleEditTask}
          onDeleteTask={deleteTask}
          isLoading={isLoading}
        />
      </div>

      {/* Add Task Modal */}
      <Modal
        isOpen={addTaskModal.isOpen}
        onClose={handleCancelTask}
        title="Create New Task"
        size="md"
      >
        <TaskForm
          onSubmit={handleSubmitTask}
          onCancel={handleCancelTask}
        />
      </Modal>

      {/* Edit Task Modal */}
      <Modal
        isOpen={editTaskModal.isOpen}
        onClose={handleCancelTask}
        title="Edit Task"
        size="md"
      >
        <TaskForm
          task={editingTask || undefined}
          onSubmit={handleSubmitTask}
          onCancel={handleCancelTask}
        />
      </Modal>
    </div>
  );
};

export default Dashboard;