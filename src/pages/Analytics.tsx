import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  TrendingUp,
  Calendar,
  Target
} from 'lucide-react';
import { useTask } from '../contexts/TaskContext';
import { getPriorityColor, formatDate } from '../utils/helpers';
import '../styles/Analytics.css';

const Analytics: React.FC = () => {
  const { tasks } = useTask();

  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = tasks.filter(task => !task.completed).length;
  const overdueTasks = tasks.filter(task => 
    !task.completed && task.dueDate && task.dueDate < new Date()
  ).length;

  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Priority distribution
  const priorityData = [
    { name: 'Urgent', value: tasks.filter(t => t.priority === 'urgent').length, color: '#dc2626' },
    { name: 'High', value: tasks.filter(t => t.priority === 'high').length, color: '#ef4444' },
    { name: 'Medium', value: tasks.filter(t => t.priority === 'medium').length, color: '#f59e0b' },
    { name: 'Low', value: tasks.filter(t => t.priority === 'low').length, color: '#10b981' },
  ].filter(item => item.value > 0);

  // Category distribution
  const categoryData = tasks.reduce((acc, task) => {
    const existing = acc.find(item => item.name === task.category);
    if (existing) {
      existing.total++;
      if (task.completed) existing.completed++;
    } else {
      acc.push({
        name: task.category,
        total: 1,
        completed: task.completed ? 1 : 0,
        pending: task.completed ? 0 : 1,
      });
    }
    return acc;
  }, [] as Array<{ name: string; total: number; completed: number; pending: number }>);

  // Tasks created over time (last 30 days)
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return date;
  });

  const tasksOverTime = last30Days.map(date => {
    const dateStr = formatDate(date);
    const createdCount = tasks.filter(task => 
      formatDate(task.createdAt) === dateStr
    ).length;
    const completedCount = tasks.filter(task => 
      task.completed && formatDate(task.updatedAt) === dateStr
    ).length;

    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      created: createdCount,
      completed: completedCount,
    };
  });

  const stats = [
    {
      title: 'Total Tasks',
      value: totalTasks,
      icon: Target,
      color: '#3b82f6',
      change: null,
    },
    {
      title: 'Completed',
      value: completedTasks,
      icon: CheckCircle,
      color: '#10b981',
      change: `${completionRate.toFixed(1)}%`,
    },
    {
      title: 'Pending',
      value: pendingTasks,
      icon: Clock,
      color: '#f59e0b',
      change: null,
    },
    {
      title: 'Overdue',
      value: overdueTasks,
      icon: AlertTriangle,
      color: '#ef4444',
      change: overdueTasks > 0 ? 'Needs attention' : 'All good',
    },
  ];

  return (
    <div className="analytics">
      <div className="analytics-header">
        <h1>Analytics Dashboard</h1>
        <p>Insights into your task management performance</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: stat.color }}>
                <Icon size={24} />
              </div>
              <div className="stat-content">
                <h3 className="stat-value">{stat.value}</h3>
                <p className="stat-title">{stat.title}</p>
                {stat.change && (
                  <p className="stat-change">{stat.change}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {totalTasks === 0 ? (
        <div className="analytics-empty">
          <TrendingUp size={64} className="empty-icon" />
          <h2>No Data Available</h2>
          <p>Create some tasks to see your analytics and insights.</p>
        </div>
      ) : (
        <div className="charts-grid">
          {/* Priority Distribution */}
          <div className="chart-container">
            <h3 className="chart-title">Tasks by Priority</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Category Performance */}
          <div className="chart-container">
            <h3 className="chart-title">Tasks by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="completed" stackId="a" fill="#10b981" name="Completed" />
                <Bar dataKey="pending" stackId="a" fill="#f59e0b" name="Pending" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Task Activity Over Time */}
          <div className="chart-container full-width">
            <h3 className="chart-title">Task Activity (Last 30 Days)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={tasksOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="created" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Tasks Created"
                />
                <Line 
                  type="monotone" 
                  dataKey="completed" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Tasks Completed"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Insights Section */}
      {totalTasks > 0 && (
        <div className="insights-section">
          <h3>Insights & Recommendations</h3>
          <div className="insights-grid">
            {completionRate >= 80 && (
              <div className="insight-card success">
                <CheckCircle size={20} />
                <p>Great job! You have a high completion rate of {completionRate.toFixed(1)}%.</p>
              </div>
            )}
            
            {overdueTasks > 0 && (
              <div className="insight-card warning">
                <AlertTriangle size={20} />
                <p>You have {overdueTasks} overdue tasks. Consider reviewing your priorities.</p>
              </div>
            )}
            
            {pendingTasks > completedTasks && totalTasks > 5 && (
              <div className="insight-card info">
                <Clock size={20} />
                <p>You have more pending tasks than completed ones. Try breaking down large tasks.</p>
              </div>
            )}
            
            <div className="insight-card neutral">
              <Calendar size={20} />
              <p>Most productive category: {categoryData.length > 0 ? categoryData.reduce((a, b) => a.completed > b.completed ? a : b).name : 'N/A'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;