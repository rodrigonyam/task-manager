import { Task, Priority } from '../types';

// Date utilities
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export const formatDateTime = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const isOverdue = (date: Date): boolean => {
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return date < today;
};

export const getDaysUntilDue = (date: Date): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(date);
  dueDate.setHours(0, 0, 0, 0);
  
  const diffTime = dueDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Task utilities
export const getPriorityColor = (priority: Priority): string => {
  const colors = {
    low: '#10b981',
    medium: '#f59e0b',
    high: '#ef4444',
    urgent: '#dc2626',
  };
  return colors[priority];
};

export const getPriorityOrder = (priority: Priority): number => {
  const order = { urgent: 4, high: 3, medium: 2, low: 1 };
  return order[priority];
};

export const sortTasksByPriority = (tasks: Task[]): Task[] => {
  return [...tasks].sort((a, b) => 
    getPriorityOrder(b.priority) - getPriorityOrder(a.priority)
  );
};

export const sortTasksByDate = (tasks: Task[], field: 'createdAt' | 'dueDate' = 'createdAt'): Task[] => {
  return [...tasks].sort((a, b) => {
    const dateA = field === 'dueDate' ? a.dueDate : a.createdAt;
    const dateB = field === 'dueDate' ? b.dueDate : b.createdAt;
    
    if (!dateA && !dateB) return 0;
    if (!dateA) return 1;
    if (!dateB) return -1;
    
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });
};

// String utilities
export const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

// Search and filter utilities
export const searchTasks = (tasks: Task[], query: string): Task[] => {
  if (!query.trim()) return tasks;
  
  const lowercaseQuery = query.toLowerCase();
  return tasks.filter(task =>
    task.title.toLowerCase().includes(lowercaseQuery) ||
    task.description.toLowerCase().includes(lowercaseQuery) ||
    task.category.toLowerCase().includes(lowercaseQuery) ||
    task.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

export const filterTasksByStatus = (tasks: Task[], status: string): Task[] => {
  switch (status) {
    case 'completed':
      return tasks.filter(task => task.completed);
    case 'pending':
      return tasks.filter(task => !task.completed);
    case 'overdue':
      return tasks.filter(task => 
        !task.completed && 
        task.dueDate && 
        isOverdue(task.dueDate)
      );
    default:
      return tasks;
  }
};

// Validation utilities
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

// Color utilities
export const generateRandomColor = (): string => {
  const colors = [
    '#ef4444', '#f97316', '#f59e0b', '#eab308',
    '#84cc16', '#22c55e', '#10b981', '#14b8a6',
    '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
    '#8b5cf6', '#a855f7', '#d946ef', '#ec4899',
    '#f43f5e'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Debounce utility for search
export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Generate unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};