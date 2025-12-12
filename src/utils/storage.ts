import { Task, Project, User } from '../types';

// Storage keys
export const STORAGE_KEYS = {
  TASKS: 'taskManager_tasks',
  PROJECTS: 'taskManager_projects',
  USER: 'taskManager_user',
  AUTH_TOKEN: 'taskManager_token',
} as const;

// Generic storage operations
export class Storage {
  static get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error getting item from localStorage: ${key}`, error);
      return null;
    }
  }

  static set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting item to localStorage: ${key}`, error);
    }
  }

  static remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item from localStorage: ${key}`, error);
    }
  }

  static clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage', error);
    }
  }
}

// Task-specific storage operations
export class TaskStorage {
  static getTasks(): Task[] {
    const tasks = Storage.get<Task[]>(STORAGE_KEYS.TASKS);
    return tasks ? tasks.map(task => ({
      ...task,
      createdAt: new Date(task.createdAt),
      updatedAt: new Date(task.updatedAt),
      dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
    })) : [];
  }

  static saveTasks(tasks: Task[]): void {
    Storage.set(STORAGE_KEYS.TASKS, tasks);
  }

  static addTask(task: Task): void {
    const tasks = this.getTasks();
    tasks.push(task);
    this.saveTasks(tasks);
  }

  static updateTask(updatedTask: Task): void {
    const tasks = this.getTasks();
    const index = tasks.findIndex(task => task.id === updatedTask.id);
    if (index !== -1) {
      tasks[index] = updatedTask;
      this.saveTasks(tasks);
    }
  }

  static deleteTask(taskId: string): void {
    const tasks = this.getTasks();
    const filteredTasks = tasks.filter(task => task.id !== taskId);
    this.saveTasks(filteredTasks);
  }
}

// Project-specific storage operations
export class ProjectStorage {
  static getProjects(): Project[] {
    const projects = Storage.get<Project[]>(STORAGE_KEYS.PROJECTS);
    return projects ? projects.map(project => ({
      ...project,
      createdAt: new Date(project.createdAt),
    })) : [];
  }

  static saveProjects(projects: Project[]): void {
    Storage.set(STORAGE_KEYS.PROJECTS, projects);
  }

  static addProject(project: Project): void {
    const projects = this.getProjects();
    projects.push(project);
    this.saveProjects(projects);
  }

  static updateProject(updatedProject: Project): void {
    const projects = this.getProjects();
    const index = projects.findIndex(project => project.id === updatedProject.id);
    if (index !== -1) {
      projects[index] = updatedProject;
      this.saveProjects(projects);
    }
  }

  static deleteProject(projectId: string): void {
    const projects = this.getProjects();
    const filteredProjects = projects.filter(project => project.id !== projectId);
    this.saveProjects(filteredProjects);
  }
}

// User authentication storage
export class AuthStorage {
  static getUser(): User | null {
    return Storage.get<User>(STORAGE_KEYS.USER);
  }

  static setUser(user: User): void {
    Storage.set(STORAGE_KEYS.USER, user);
  }

  static getToken(): string | null {
    return Storage.get<string>(STORAGE_KEYS.AUTH_TOKEN);
  }

  static setToken(token: string): void {
    Storage.set(STORAGE_KEYS.AUTH_TOKEN, token);
  }

  static clearAuth(): void {
    Storage.remove(STORAGE_KEYS.USER);
    Storage.remove(STORAGE_KEYS.AUTH_TOKEN);
  }
}