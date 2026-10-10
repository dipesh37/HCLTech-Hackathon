import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginApi, registerApi } from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from sessionStorage on mount
  useEffect(() => {
    try {
      const savedToken = sessionStorage.getItem('shopsmart_token');
      const savedUser = sessionStorage.getItem('shopsmart_user');
      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.error('Failed to restore auth session:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save session state to sessionStorage
  const saveSession = (authToken, userData) => {
    try {
      sessionStorage.setItem('shopsmart_token', authToken);
      sessionStorage.setItem('shopsmart_user', JSON.stringify(userData));
    } catch (e) {
      console.error('Failed to save auth session:', e);
    }
    setToken(authToken);
    setUser(userData);
  };

  // Clear session state from sessionStorage
  const clearSession = () => {
    try {
      sessionStorage.removeItem('shopsmart_token');
      sessionStorage.removeItem('shopsmart_user');
    } catch (e) {
      console.error('Failed to clear auth session:', e);
    }
    setToken(null);
    setUser(null);
  };

  const login = async (email, password) => {
    const data = await loginApi(email, password);
    if (data && data.token && data.user) {
      saveSession(data.token, data.user);
      return data.user;
    }
  };

  const register = async (name, email, password) => {
    const data = await registerApi(name, email, password);
    if (data && data.token && data.user) {
      saveSession(data.token, data.user);
      return data.user;
    }
  };

  const logout = () => {
    clearSession();
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    loading,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
