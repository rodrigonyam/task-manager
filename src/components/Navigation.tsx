import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  CheckSquare, 
  BarChart3, 
  Settings, 
  User, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTask } from '../contexts/TaskContext';
import '../styles/Navigation.css';

interface NavigationProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ isOpen, onToggle }) => {
  const { user, logout } = useAuth();
  const { tasks } = useTask();
  const location = useLocation();

  const pendingTasksCount = tasks.filter(task => !task.completed).length;
  const overdueTasksCount = tasks.filter(task => 
    !task.completed && task.dueDate && task.dueDate < new Date()
  ).length;

  const navigationItems = [
    {
      to: '/dashboard',
      icon: CheckSquare,
      label: 'Tasks',
      count: pendingTasksCount,
      countLabel: 'pending tasks'
    },
    {
      to: '/analytics',
      icon: BarChart3,
      label: 'Analytics',
      count: overdueTasksCount > 0 ? overdueTasksCount : undefined,
      countLabel: 'overdue tasks'
    },
    {
      to: '/settings',
      icon: Settings,
      label: 'Settings'
    }
  ];

  const handleLogout = () => {
    logout();
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path || 
           (path === '/dashboard' && location.pathname === '/');
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="nav-overlay" onClick={onToggle} />
      )}

      {/* Navigation sidebar */}
      <nav className={`navigation ${isOpen ? 'open' : ''}`}>
        <div className="nav-header">
          <div className="nav-brand">
            <CheckSquare size={24} className="brand-icon" />
            <span className="brand-text">TaskManager</span>
          </div>
          <button
            className="nav-toggle mobile-only"
            onClick={onToggle}
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>
        </div>

        <div className="nav-content">
          <div className="nav-section">
            <ul className="nav-menu">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActiveRoute(item.to);
                
                return (
                  <li key={item.to} className="nav-item">
                    <Link
                      to={item.to}
                      className={`nav-link ${isActive ? 'active' : ''}`}
                      onClick={onToggle}
                    >
                      <div className="nav-link-content">
                        <Icon size={20} className="nav-icon" />
                        <span className="nav-label">{item.label}</span>
                        {item.count !== undefined && item.count > 0 && (
                          <span 
                            className={`nav-count ${item.label === 'Analytics' && overdueTasksCount > 0 ? 'warning' : ''}`}
                            aria-label={`${item.count} ${item.countLabel}`}
                          >
                            {item.count}
                          </span>
                        )}
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* User section */}
          <div className="nav-section user-section">
            <div className="user-info">
              <div className="user-avatar">
                {user?.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="avatar-image"
                  />
                ) : (
                  <User size={20} />
                )}
              </div>
              <div className="user-details">
                <span className="user-name">{user?.name}</span>
                <span className="user-email">{user?.email}</span>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="logout-button"
              title="Sign out"
              aria-label="Sign out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

// Mobile navigation toggle button
export const NavigationToggle: React.FC<{ onToggle: () => void }> = ({ onToggle }) => {
  return (
    <button
      className="nav-toggle desktop-hidden"
      onClick={onToggle}
      aria-label="Open navigation"
    >
      <Menu size={24} />
    </button>
  );
};

export default Navigation;