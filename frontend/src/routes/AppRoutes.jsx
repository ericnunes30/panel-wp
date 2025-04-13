import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Páginas
import Login from '../pages/Login';
import Index from '../pages/Index';
import Dashboard from '../pages/Dashboard';
import Settings from '../pages/Settings';
import Profile from '../pages/Profile';
import NotFound from '../pages/NotFound';

/**
 * Componente para proteger rotas que requerem autenticação
 * Redireciona para a página de login se o usuário não estiver autenticado
 */
const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();

  // Se ainda estiver carregando, mostra um indicador de carregamento
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
          <p className="text-foreground">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Se o usuário não estiver autenticado, redireciona para a página de login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Se o usuário estiver autenticado, renderiza o conteúdo da rota
  return children;
};

/**
 * Componente para rotas públicas
 * Redireciona para a página inicial se o usuário já estiver autenticado
 */
const PublicRoute = ({ children }) => {
  const { user, isLoading } = useAuth();

  // Se ainda estiver carregando, mostra um indicador de carregamento
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
          <p className="text-foreground">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Se o usuário já estiver autenticado, redireciona para a página inicial
  if (user) {
    return <Navigate to="/" replace />;
  }

  // Se o usuário não estiver autenticado, renderiza o conteúdo da rota
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Rotas públicas */}
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } 
      />

      {/* Rotas protegidas */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Index />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } 
      />

      {/* Rota para página não encontrada */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
