import React, { useState } from 'react';
import { 
  User, 
  Bell, 
  Palette, 
  Database, 
  Download, 
  Upload,
  Trash2,
  Save
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTask } from '../contexts/TaskContext';
import { Storage, TaskStorage, ProjectStorage, AuthStorage } from '../utils/storage';
import '../styles/Settings.css';

const Settings: React.FC = () => {
  const { user, logout } = useAuth();
  const { tasks, projects } = useTask();
  const [activeTab, setActiveTab] = useState('profile');
  const [notifications, setNotifications] = useState({
    taskReminders: true,
    emailDigest: false,
    dueDate: true,
  });

  const handleExportData = () => {
    const data = {
      tasks,
      projects,
      user,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `task-manager-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        if (data.tasks) {
          TaskStorage.saveTasks(data.tasks);
        }
        if (data.projects) {
          ProjectStorage.saveProjects(data.projects);
        }
        
        alert('Data imported successfully! Please refresh the page to see changes.');
      } catch (error) {
        alert('Invalid file format. Please select a valid backup file.');
      }
    };
    reader.readAsText(file);
  };

  const handleClearAllData = () => {
    const confirm = window.confirm(
      'Are you sure you want to clear all data? This action cannot be undone.'
    );
    
    if (confirm) {
      const confirmAgain = window.confirm(
        'This will permanently delete all your tasks and projects. Are you absolutely sure?'
      );
      
      if (confirmAgain) {
        Storage.clear();
        logout();
      }
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'data', label: 'Data Management', icon: Database },
  ];

  return (
    <div className="settings">
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Manage your account and application preferences</p>
      </div>

      <div className="settings-content">
        {/* Tab Navigation */}
        <div className="settings-nav">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`settings-nav-item ${activeTab === tab.id ? 'active' : ''}`}
              >
                <Icon size={20} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="settings-panel">
          {activeTab === 'profile' && (
            <div className="settings-section">
              <h2>Profile Information</h2>
              
              <div className="profile-section">
                <div className="profile-avatar">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="avatar-large" />
                  ) : (
                    <div className="avatar-placeholder">
                      <User size={48} />
                    </div>
                  )}
                </div>
                
                <div className="profile-details">
                  <div className="form-group">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={user?.name || ''}
                      readOnly
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-input"
                      value={user?.email || ''}
                      readOnly
                    />
                  </div>
                  
                  <p className="settings-note">
                    Profile information is read-only in this demo version.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="settings-section">
              <h2>Notification Preferences</h2>
              
              <div className="notification-options">
                <div className="notification-item">
                  <div className="notification-info">
                    <h3>Task Reminders</h3>
                    <p>Get reminded about upcoming task deadlines</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={notifications.taskReminders}
                      onChange={(e) => setNotifications(prev => ({
                        ...prev,
                        taskReminders: e.target.checked
                      }))}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                
                <div className="notification-item">
                  <div className="notification-info">
                    <h3>Due Date Alerts</h3>
                    <p>Receive alerts for tasks due today or overdue</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={notifications.dueDate}
                      onChange={(e) => setNotifications(prev => ({
                        ...prev,
                        dueDate: e.target.checked
                      }))}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                
                <div className="notification-item">
                  <div className="notification-info">
                    <h3>Weekly Email Digest</h3>
                    <p>Get a weekly summary of your task progress</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={notifications.emailDigest}
                      onChange={(e) => setNotifications(prev => ({
                        ...prev,
                        emailDigest: e.target.checked
                      }))}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
              
              <div className="settings-actions">
                <button className="settings-button primary">
                  <Save size={16} />
                  Save Preferences
                </button>
              </div>
              
              <p className="settings-note">
                Notification settings are saved locally in this demo version.
              </p>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="settings-section">
              <h2>Appearance</h2>
              
              <div className="appearance-options">
                <div className="theme-selector">
                  <h3>Theme</h3>
                  <div className="theme-options">
                    <div className="theme-option active">
                      <div className="theme-preview light"></div>
                      <span>Light</span>
                    </div>
                    <div className="theme-option disabled">
                      <div className="theme-preview dark"></div>
                      <span>Dark (Coming Soon)</span>
                    </div>
                  </div>
                </div>
                
                <div className="color-scheme">
                  <h3>Accent Color</h3>
                  <div className="color-options">
                    <button className="color-option active" style={{ backgroundColor: '#3b82f6' }}></button>
                    <button className="color-option" style={{ backgroundColor: '#10b981' }}></button>
                    <button className="color-option" style={{ backgroundColor: '#f59e0b' }}></button>
                    <button className="color-option" style={{ backgroundColor: '#ef4444' }}></button>
                    <button className="color-option" style={{ backgroundColor: '#8b5cf6' }}></button>
                  </div>
                </div>
              </div>
              
              <p className="settings-note">
                Appearance settings will be available in future updates.
              </p>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="settings-section">
              <h2>Data Management</h2>
              
              <div className="data-stats">
                <div className="stat-item">
                  <h3>{tasks.length}</h3>
                  <p>Total Tasks</p>
                </div>
                <div className="stat-item">
                  <h3>{projects.length}</h3>
                  <p>Projects</p>
                </div>
                <div className="stat-item">
                  <h3>{tasks.filter(t => t.completed).length}</h3>
                  <p>Completed</p>
                </div>
              </div>
              
              <div className="data-actions">
                <div className="action-group">
                  <h3>Backup & Restore</h3>
                  <p>Export your data or import from a backup file</p>
                  
                  <div className="action-buttons">
                    <button
                      onClick={handleExportData}
                      className="settings-button secondary"
                    >
                      <Download size={16} />
                      Export Data
                    </button>
                    
                    <label className="settings-button secondary file-upload">
                      <Upload size={16} />
                      Import Data
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleImportData}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>
                </div>
                
                <div className="action-group danger-zone">
                  <h3>Danger Zone</h3>
                  <p>Irreversible actions that will affect all your data</p>
                  
                  <button
                    onClick={handleClearAllData}
                    className="settings-button danger"
                  >
                    <Trash2 size={16} />
                    Clear All Data
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;