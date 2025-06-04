import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { API_URL } from '@/config/api';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Check authentication status from backend using cookies
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${API_URL}/auth/verify`, { withCredentials: true });
        if (res.data && res.data.user) {
          setUser(res.data.user);
          setToken('cookie'); // Just a placeholder to indicate authenticated
        } else {
          setUser(null);
          setToken(null);
        }
      } catch {
        setUser(null);
        setToken(null);
      }
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      }, { withCredentials: true });
      if (response.data && response.data.user) {
        setUser(response.data.user);
        setToken('cookie');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/signup`, {
        email,
        password,
        name,
      }, { withCredentials: true });
      if (response.data && response.data.user) {
        setUser(response.data.user);
        setToken('cookie');
      }
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    // No need to clear localStorage, cookies are managed by backend
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        signup,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};