// User types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

// Task types
export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: Priority;
  category: string;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  assignedTo?: string;
  tags: string[];
}

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type TaskStatus = 'all' | 'completed' | 'pending' | 'overdue';

// Project types
export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  createdAt: Date;
  taskCount: number;
}

// Authentication types
export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

// Task filters and sorting
export interface TaskFilters {
  status: TaskStatus;
  priority?: Priority;
  category?: string;
  search: string;
}

export interface TaskSort {
  field: 'title' | 'priority' | 'dueDate' | 'createdAt';
  direction: 'asc' | 'desc';
}

// Form types
export interface TaskFormData {
  title: string;
  description: string;
  priority: Priority;
  category: string;
  dueDate?: string;
  tags: string[];
}

export interface ProjectFormData {
  name: string;
  description: string;
  color: string;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Modal types
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

// Component props
export interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export interface TaskFormProps {
  task?: Task;
  onSubmit: (data: TaskFormData) => void;
  onCancel: () => void;
}