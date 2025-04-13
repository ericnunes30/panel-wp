
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Dashboard from './Dashboard';
import { useAuth } from '../context/AuthContext';

const Index = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If not authenticated and not loading, redirect to login
    if (!isAuthenticated && !loading) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  // When loading, show a loading indicator
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="inline-block w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <span className="ml-2 text-gray-300">Loading...</span>
      </div>
    );
  }

  // When authenticated, show dashboard
  if (isAuthenticated) {
    return <Dashboard />;
  }

  // Fallback while redirect happens
  return null;
};

export default Index;
