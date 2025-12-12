import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useFormValidation } from '../hooks';
import '../styles/Auth.css';

type AuthMode = 'login' | 'register';

const AuthPage: React.FC = () => {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const { login, register, isLoading, error, clearError } = useAuth();

  const initialValues = {
    name: '',
    email: '',
    password: '',
  };

  const validationRules = {
    name: (value: string) => {
      if (authMode === 'register' && value.trim().length < 2) {
        return 'Name must be at least 2 characters';
      }
      return null;
    },
    email: (value: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Please enter a valid email address';
      }
      return null;
    },
    password: (value: string) => {
      if (value.length < 6) {
        return 'Password must be at least 6 characters';
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
  } = useFormValidation(initialValues, validationRules);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      if (authMode === 'login') {
        await login(values.email, values.password);
      } else {
        await register(values.name, values.email, values.password);
      }
    } catch (err) {
      // Error is handled by the auth context
    }
  };

  const switchAuthMode = () => {
    setAuthMode(authMode === 'login' ? 'register' : 'login');
    resetForm();
    clearError();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1 className="auth-title">
            {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="auth-subtitle">
            {authMode === 'login' 
              ? 'Sign in to manage your tasks' 
              : 'Get started with your task management'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="auth-error" role="alert">
              {error}
            </div>
          )}

          {authMode === 'register' && (
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                className={`form-input ${errors.name && touched.name ? 'error' : ''}`}
                value={values.name}
                onChange={(e) => setValue('name', e.target.value)}
                onBlur={() => handleBlur('name')}
                placeholder="Enter your full name"
                disabled={isLoading}
              />
              {errors.name && touched.name && (
                <span className="form-error">{errors.name}</span>
              )}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className={`form-input ${errors.email && touched.email ? 'error' : ''}`}
              value={values.email}
              onChange={(e) => setValue('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              placeholder="Enter your email"
              disabled={isLoading}
              autoComplete="email"
            />
            {errors.email && touched.email && (
              <span className="form-error">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="password-input-container">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className={`form-input ${errors.password && touched.password ? 'error' : ''}`}
                value={values.password}
                onChange={(e) => setValue('password', e.target.value)}
                onBlur={() => handleBlur('password')}
                placeholder="Enter your password"
                disabled={isLoading}
                autoComplete={authMode === 'login' ? 'current-password' : 'new-password'}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="password-toggle"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && touched.password && (
              <span className="form-error">{errors.password}</span>
            )}
          </div>

          <button
            type="submit"
            className="auth-submit-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="loading-spinner small" />
            ) : (
              authMode === 'login' ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

        <div className="auth-switch">
          <p>
            {authMode === 'login' 
              ? "Don't have an account? " 
              : "Already have an account? "
            }
            <button
              type="button"
              onClick={switchAuthMode}
              className="auth-switch-button"
              disabled={isLoading}
            >
              {authMode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>

        <div className="auth-demo">
          <p className="demo-text">
            Demo credentials: Use any email and password (min 6 characters)
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;