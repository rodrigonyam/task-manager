import React, { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import { Task, TaskFormData, Priority } from '../types';
import { useFormValidation } from '../hooks';
import '../styles/TaskForm.css';

interface TaskFormProps {
  task?: Task;
  onSubmit: (data: TaskFormData) => void;
  onCancel: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onSubmit, onCancel }) => {
  const [tagInput, setTagInput] = useState('');

  const initialValues: TaskFormData = {
    title: task?.title || '',
    description: task?.description || '',
    priority: task?.priority || 'medium',
    category: task?.category || '',
    dueDate: task?.dueDate ? task.dueDate.toISOString().split('T')[0] : '',
    tags: task?.tags || [],
  };

  const validationRules = {
    title: (value: string) => {
      if (!value.trim()) return 'Title is required';
      if (value.length < 3) return 'Title must be at least 3 characters';
      if (value.length > 100) return 'Title must be less than 100 characters';
      return null;
    },
    description: (value: string) => {
      if (value.length > 500) return 'Description must be less than 500 characters';
      return null;
    },
    category: (value: string) => {
      if (!value.trim()) return 'Category is required';
      return null;
    },
    dueDate: (value: string) => {
      if (value) {
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
          return 'Due date cannot be in the past';
        }
      }
      return null;
    },
  };

  const {
    values,
    errors,
    touched,
    setValue,
    validateForm,
    resetForm,
    handleBlur,
    isValid,
  } = useFormValidation(initialValues, validationRules);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(values);
    }
  };

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !values.tags.includes(trimmedTag)) {
      setValue('tags', [...values.tags, trimmedTag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setValue('tags', values.tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const priorityOptions: { value: Priority; label: string; color: string }[] = [
    { value: 'low', label: 'Low', color: '#10b981' },
    { value: 'medium', label: 'Medium', color: '#f59e0b' },
    { value: 'high', label: 'High', color: '#ef4444' },
    { value: 'urgent', label: 'Urgent', color: '#dc2626' },
  ];

  const categoryOptions = [
    'Work',
    'Personal',
    'Shopping',
    'Health',
    'Learning',
    'Finance',
    'Travel',
    'Home',
    'Other',
  ];

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <div className="form-group">
        <label htmlFor="title" className="form-label">
          Task Title *
        </label>
        <input
          id="title"
          type="text"
          className={`form-input ${errors.title && touched.title ? 'error' : ''}`}
          value={values.title}
          onChange={(e) => setValue('title', e.target.value)}
          onBlur={() => handleBlur('title')}
          placeholder="Enter task title..."
          maxLength={100}
        />
        {errors.title && touched.title && (
          <span className="form-error">{errors.title}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="description" className="form-label">
          Description
        </label>
        <textarea
          id="description"
          className={`form-textarea ${errors.description && touched.description ? 'error' : ''}`}
          value={values.description}
          onChange={(e) => setValue('description', e.target.value)}
          onBlur={() => handleBlur('description')}
          placeholder="Enter task description..."
          rows={3}
          maxLength={500}
        />
        {errors.description && touched.description && (
          <span className="form-error">{errors.description}</span>
        )}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="priority" className="form-label">
            Priority
          </label>
          <select
            id="priority"
            className="form-select"
            value={values.priority}
            onChange={(e) => setValue('priority', e.target.value as Priority)}
          >
            {priorityOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="category" className="form-label">
            Category *
          </label>
          <select
            id="category"
            className={`form-select ${errors.category && touched.category ? 'error' : ''}`}
            value={values.category}
            onChange={(e) => setValue('category', e.target.value)}
            onBlur={() => handleBlur('category')}
          >
            <option value="">Select category</option>
            {categoryOptions.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && touched.category && (
            <span className="form-error">{errors.category}</span>
          )}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="dueDate" className="form-label">
          Due Date
        </label>
        <input
          id="dueDate"
          type="date"
          className={`form-input ${errors.dueDate && touched.dueDate ? 'error' : ''}`}
          value={values.dueDate}
          onChange={(e) => setValue('dueDate', e.target.value)}
          onBlur={() => handleBlur('dueDate')}
          min={new Date().toISOString().split('T')[0]}
        />
        {errors.dueDate && touched.dueDate && (
          <span className="form-error">{errors.dueDate}</span>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">Tags</label>
        <div className="tag-input-container">
          <input
            type="text"
            className="form-input"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add a tag and press Enter"
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="tag-add-button"
            disabled={!tagInput.trim()}
          >
            <Plus size={16} />
          </button>
        </div>
        
        {values.tags.length > 0 && (
          <div className="tags-list">
            {values.tags.map((tag, index) => (
              <span key={index} className="tag-item">
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="tag-remove"
                  aria-label={`Remove ${tag} tag`}
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="form-actions">
        <button
          type="button"
          onClick={onCancel}
          className="form-button secondary"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="form-button primary"
          disabled={!isValid}
        >
          {task ? 'Update Task' : 'Create Task'}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;