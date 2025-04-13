
import { createContext, useState, useEffect, useContext } from 'react';
import { loginUser, checkAuth, logoutUser, updateUser } from '../api/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        setLoading(true);
        const userData = await checkAuth();
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error("Erro de autenticação:", err);
        setError("Falha na autenticação");
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const userData = await loginUser(email, password);
      setUser(userData);
      setIsAuthenticated(true);
      return userData;
    } catch (err) {
      console.error("Erro de login:", err);
      setError(err?.message || "Falha no login");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const result = await logoutUser();
      setUser(null);
      setIsAuthenticated(false);
      return result;
    } catch (err) {
      console.error("Erro ao sair:", err);
      throw err;
    }
  };

  const update = async (userData) => {
    try {
      const updatedUser = await updateUser(userData);

      // Atualizar o estado do usuário com os novos dados
      setUser(prev => ({
        ...prev,
        ...updatedUser,
        // Se o nome foi atualizado, usar o novo nome
        name: userData.name || prev.name
      }));

      return updatedUser;
    } catch (err) {
      console.error("Erro ao atualizar perfil:", err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      loading,
      error,
      login,
      logout,
      update
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
