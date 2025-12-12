import { Task, Priority } from '../types';
import { generateId } from './helpers';

export const sampleTasks: Task[] = [
  {
    id: generateId(),
    title: 'Complete React Project Documentation',
    description: 'Write comprehensive documentation for the task management application including setup instructions, API documentation, and user guide.',
    completed: false,
    priority: 'high' as Priority,
    category: 'Work',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    tags: ['documentation', 'react', 'typescript']
  },
  {
    id: generateId(),
    title: 'Review Code PRs',
    description: 'Review pending pull requests from team members and provide feedback on code quality and implementation.',
    completed: true,
    priority: 'medium' as Priority,
    category: 'Work',
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    tags: ['code-review', 'teamwork']
  },
  {
    id: generateId(),
    title: 'Buy Groceries',
    description: 'Weekly grocery shopping: milk, bread, eggs, fruits, vegetables, and cleaning supplies.',
    completed: false,
    priority: 'low' as Priority,
    category: 'Personal',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    tags: ['shopping', 'weekly']
  },
  {
    id: generateId(),
    title: 'Plan Team Meeting Agenda',
    description: 'Prepare agenda items for the upcoming sprint planning meeting including backlog review, capacity planning, and retrospective items.',
    completed: false,
    priority: 'urgent' as Priority,
    category: 'Work',
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago (overdue)
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    tags: ['meeting', 'planning', 'sprint']
  },
  {
    id: generateId(),
    title: 'Exercise - Morning Run',
    description: '30-minute morning run in the park. Goal: maintain steady pace and improve endurance.',
    completed: true,
    priority: 'medium' as Priority,
    category: 'Health',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    tags: ['exercise', 'running', 'health']
  },
  {
    id: generateId(),
    title: 'Read "Clean Code" Chapter 5',
    description: 'Continue reading Robert Martin\'s Clean Code book. Focus on formatting and commenting best practices.',
    completed: false,
    priority: 'low' as Priority,
    category: 'Learning',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    tags: ['reading', 'programming', 'self-improvement']
  },
  {
    id: generateId(),
    title: 'Update Portfolio Website',
    description: 'Add recent projects to portfolio, update skills section, and optimize for better performance.',
    completed: false,
    priority: 'medium' as Priority,
    category: 'Personal',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
    updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    tags: ['portfolio', 'web-development', 'personal-branding']
  },
  {
    id: generateId(),
    title: 'Call Mom',
    description: 'Weekly catch-up call with mom. Ask about her health and share updates about work and life.',
    completed: true,
    priority: 'high' as Priority,
    category: 'Personal',
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
    updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
    tags: ['family', 'communication']
  }
];

// Function to initialize sample data if localStorage is empty
export const initializeSampleData = (): void => {
  const existingTasks = localStorage.getItem('taskManager_tasks');
  if (!existingTasks) {
    localStorage.setItem('taskManager_tasks', JSON.stringify(sampleTasks));
  }
};