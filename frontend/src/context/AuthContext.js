import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const token = authService.getToken();
    if (token) {
      // You might want to add a function to verify the token with the backend
      setUser({ token });
    }
    setLoading(false);
  }, []);

  const signup = async (userData) => {
    try {
      setError(null);
      const response = await authService.signup(userData);
      setUser(response);
      return response;
    } catch (err) {
      setError(err.message || 'Signup failed');
      throw err;
    }
  };

  const login = async (credentials) => {
    try {
      setError(null);
      const response = await authService.login(credentials);
      setUser(response);
      return response;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        signup,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 