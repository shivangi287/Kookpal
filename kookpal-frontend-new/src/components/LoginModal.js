// src/components/LoginModal.js
import React, { useState } from 'react';
import { X, Eye, EyeOff, Mail, Lock, User } from 'lucide-react';

const LoginModal = ({ onClose, onLogin }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (isSignup) {
      if (!formData.name) {
        newErrors.name = 'Name is required';
      }
      
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (isSignup) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userExists = users.some(user => user.email === formData.email);
        
        if (userExists) {
          setAuthError('An account with this email already exists');
          setIsLoading(false);
          return;
        }

        const newUser = {
          email: formData.email,
          password: formData.password,
          name: formData.name
        };
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        onLogin(newUser);
      } else {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === formData.email);

        if (!user) {
          setAuthError('No account found with this email. Please sign up.');
          setIsLoading(false);
          return;
        }

        if (user.password !== formData.password) {
          setAuthError('Incorrect password');
          setIsLoading(false);
          return;
        }

        onLogin(user);
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setAuthError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    setAuthError('');
  };

  return (
    <div className="fixed inset-0 bg-secondary bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-text-light hover:text-text"
        >
          <X size={24} />
        </button>
        
        <h2 className="text-2xl font-bold mb-6 text-secondary">
          {isSignup ? 'Create Account' : 'Welcome Back'}
        </h2>

        {authError && (
          <div className="mb-4 p-3 bg-primary-50 border border-primary-100 text-primary rounded-lg">
            {authError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <div>
              <label className="block text-sm font-medium text-text mb-1">
                Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-text-lighter" size={18} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg bg-white
                    focus:ring-2 focus:ring-primary focus:border-transparent
                    ${errors.name ? 'border-primary' : 'border-background-dark'}`}
                  placeholder="Enter your name"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-primary">{errors.name}</p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-text mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-text-lighter" size={18} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg bg-white
                  focus:ring-2 focus:ring-primary focus:border-transparent
                  ${errors.email ? 'border-primary' : 'border-background-dark'}`}
                placeholder="Enter your email"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-primary">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-text-lighter" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-10 py-2 border rounded-lg bg-white
                  focus:ring-2 focus:ring-primary focus:border-transparent
                  ${errors.password ? 'border-primary' : 'border-background-dark'}`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-text-lighter hover:text-text"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-primary">{errors.password}</p>
            )}
          </div>

          {isSignup && (
            <div>
              <label className="block text-sm font-medium text-text mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-text-lighter" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg bg-white
                    focus:ring-2 focus:ring-primary focus:border-transparent
                    ${errors.confirmPassword ? 'border-primary' : 'border-background-dark'}`}
                  placeholder="Confirm your password"
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-primary">{errors.confirmPassword}</p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-primary text-white p-2 rounded-lg
              hover:bg-primary-600 transition-colors font-medium
              ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Please wait...' : (isSignup ? 'Sign Up' : 'Log In')}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-text-light">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => {
              setIsSignup(!isSignup);
              setErrors({});
              setAuthError('');
              setFormData({
                email: '',
                password: '',
                name: '',
                confirmPassword: ''
              });
            }}
            className="text-accent hover:text-accent-600 font-medium"
          >
            {isSignup ? 'Log In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginModal;