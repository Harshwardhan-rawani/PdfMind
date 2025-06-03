import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '@/config/api';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const location = useLocation();

  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get(`${API_URL}/auth/verify`, {
          withCredentials: true
        });
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 