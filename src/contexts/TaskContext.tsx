import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Task, Project, TaskFilters, TaskSort, TaskFormData, ProjectFormData } from '../types';
import { TaskStorage, ProjectStorage } from '../utils/storage';
import { generateId } from '../utils/helpers';

// Action types
type TaskAction = 
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'TOGGLE_TASK'; payload: string }
  | { type: 'SET_PROJECTS'; payload: Project[] }
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'UPDATE_PROJECT'; payload: Project }
  | { type: 'DELETE_PROJECT'; payload: string }
  | { type: 'SET_FILTERS'; payload: Partial<TaskFilters> }
  | { type: 'SET_SORT'; payload: TaskSort }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

// State interface
interface TaskState {
  tasks: Task[];
  projects: Project[];
  filters: TaskFilters;
  sort: TaskSort;
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: TaskState = {
  tasks: [],
  projects: [],
  filters: {
    status: 'all',
    search: '',
  },
  sort: {
    field: 'createdAt',
    direction: 'desc',
  },
  isLoading: false,
  error: null,
};

// Reducer
const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  switch (action.type) {
    case 'SET_TASKS':
      return { ...state, tasks: action.payload };
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? action.payload : task
        ),
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
      };
    case 'TOGGLE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload
            ? { ...task, completed: !task.completed, updatedAt: new Date() }
            : task
        ),
      };
    case 'SET_PROJECTS':
      return { ...state, projects: action.payload };
    case 'ADD_PROJECT':
      return { ...state, projects: [...state.projects, action.payload] };
    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map(project =>
          project.id === action.payload.id ? action.payload : project
        ),
      };
    case 'DELETE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter(project => project.id !== action.payload),
      };
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'SET_SORT':
      return { ...state, sort: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

// Context type
interface TaskContextType extends TaskState {
  // Task operations
  addTask: (data: TaskFormData) => void;
  updateTask: (id: string, data: TaskFormData) => void;
  deleteTask: (id: string) => void;
  toggleTaskComplete: (id: string) => void;
  
  // Project operations
  addProject: (data: ProjectFormData) => void;
  updateProject: (id: string, data: ProjectFormData) => void;
  deleteProject: (id: string) => void;
  
  // Filter and sort operations
  setFilters: (filters: Partial<TaskFilters>) => void;
  setSort: (sort: TaskSort) => void;
  
  // Computed values
  filteredTasks: Task[];
  getTasksByProject: (projectId: string) => Task[];
  getProjectStats: (projectId: string) => { total: number; completed: number; };
  
  // Utility
  clearError: () => void;
}

// Create context
const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Provider component
interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      try {
        // Initialize sample data if no tasks exist
        const { initializeSampleData } = await import('../utils/sampleData');
        initializeSampleData();
        
        const tasks = TaskStorage.getTasks();
        const projects = ProjectStorage.getProjects();
        
        dispatch({ type: 'SET_TASKS', payload: tasks });
        dispatch({ type: 'SET_PROJECTS', payload: projects });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load data' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadData();
  }, []);

  // Task operations
  const addTask = (data: TaskFormData): void => {
    const newTask: Task = {
      id: generateId(),
      title: data.title,
      description: data.description,
      completed: false,
      priority: data.priority,
      category: data.category,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: data.tags,
    };

    TaskStorage.addTask(newTask);
    dispatch({ type: 'ADD_TASK', payload: newTask });
  };

  const updateTask = (id: string, data: TaskFormData): void => {
    const existingTask = state.tasks.find(task => task.id === id);
    if (!existingTask) return;

    const updatedTask: Task = {
      ...existingTask,
      title: data.title,
      description: data.description,
      priority: data.priority,
      category: data.category,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      tags: data.tags,
      updatedAt: new Date(),
    };

    TaskStorage.updateTask(updatedTask);
    dispatch({ type: 'UPDATE_TASK', payload: updatedTask });
  };

  const deleteTask = (id: string): void => {
    TaskStorage.deleteTask(id);
    dispatch({ type: 'DELETE_TASK', payload: id });
  };

  const toggleTaskComplete = (id: string): void => {
    const task = state.tasks.find(t => t.id === id);
    if (task) {
      const updatedTask = { ...task, completed: !task.completed, updatedAt: new Date() };
      TaskStorage.updateTask(updatedTask);
      dispatch({ type: 'TOGGLE_TASK', payload: id });
    }
  };

  // Project operations
  const addProject = (data: ProjectFormData): void => {
    const newProject: Project = {
      id: generateId(),
      name: data.name,
      description: data.description,
      color: data.color,
      createdAt: new Date(),
      taskCount: 0,
    };

    ProjectStorage.addProject(newProject);
    dispatch({ type: 'ADD_PROJECT', payload: newProject });
  };

  const updateProject = (id: string, data: ProjectFormData): void => {
    const existingProject = state.projects.find(project => project.id === id);
    if (!existingProject) return;

    const updatedProject: Project = {
      ...existingProject,
      name: data.name,
      description: data.description,
      color: data.color,
    };

    ProjectStorage.updateProject(updatedProject);
    dispatch({ type: 'UPDATE_PROJECT', payload: updatedProject });
  };

  const deleteProject = (id: string): void => {
    ProjectStorage.deleteProject(id);
    dispatch({ type: 'DELETE_PROJECT', payload: id });
  };

  // Filter and sort operations
  const setFilters = (filters: Partial<TaskFilters>): void => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  };

  const setSort = (sort: TaskSort): void => {
    dispatch({ type: 'SET_SORT', payload: sort });
  };

  // Computed values
  const filteredTasks = React.useMemo(() => {
    let filtered = [...state.tasks];

    // Apply status filter
    switch (state.filters.status) {
      case 'completed':
        filtered = filtered.filter(task => task.completed);
        break;
      case 'pending':
        filtered = filtered.filter(task => !task.completed);
        break;
      case 'overdue':
        filtered = filtered.filter(task => 
          !task.completed && 
          task.dueDate && 
          task.dueDate < new Date()
        );
        break;
    }

    // Apply priority filter
    if (state.filters.priority) {
      filtered = filtered.filter(task => task.priority === state.filters.priority);
    }

    // Apply category filter
    if (state.filters.category) {
      filtered = filtered.filter(task => task.category === state.filters.category);
    }

    // Apply search filter
    if (state.filters.search) {
      const search = state.filters.search.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(search) ||
        task.description.toLowerCase().includes(search) ||
        task.tags.some(tag => tag.toLowerCase().includes(search))
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const { field, direction } = state.sort;
      let aValue: any, bValue: any;

      switch (field) {
        case 'title':
          aValue = a.title;
          bValue = b.title;
          break;
        case 'priority':
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          aValue = priorityOrder[a.priority];
          bValue = priorityOrder[b.priority];
          break;
        case 'dueDate':
          aValue = a.dueDate?.getTime() || 0;
          bValue = b.dueDate?.getTime() || 0;
          break;
        case 'createdAt':
        default:
          aValue = a.createdAt.getTime();
          bValue = b.createdAt.getTime();
          break;
      }

      if (direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [state.tasks, state.filters, state.sort]);

  const getTasksByProject = (projectId: string): Task[] => {
    return state.tasks.filter(task => task.category === projectId);
  };

  const getProjectStats = (projectId: string) => {
    const projectTasks = getTasksByProject(projectId);
    return {
      total: projectTasks.length,
      completed: projectTasks.filter(task => task.completed).length,
    };
  };

  const clearError = (): void => {
    dispatch({ type: 'SET_ERROR', payload: null });
  };

  const value: TaskContextType = {
    ...state,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    addProject,
    updateProject,
    deleteProject,
    setFilters,
    setSort,
    filteredTasks,
    getTasksByProject,
    getProjectStats,
    clearError,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

// Custom hook to use task context
export const useTask = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};