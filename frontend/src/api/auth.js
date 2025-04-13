
import api from './axios';

export const loginUser = async (email, password) => {
  try {
    // Make a POST request to the /session endpoint
    const response = await api.post('/session', {
      email,
      password
    });

    // Process the response that contains the bearer token
    const authData = response.data;

    // Save token, user email, user ID and name to localStorage
    localStorage.setItem('auth_token', authData.token);
    localStorage.setItem('user_email', email);
    localStorage.setItem('user_id', authData.user_id);

    // Save user name if available
    if (authData.name) {
      localStorage.setItem('user_name', authData.name);
    }

    // Create a user object from the response
    const user = {
      email: email,
      token: authData.token,
      tokenType: 'bearer',
      id: authData.user_id,
      name: authData.name || ''
    };

    return user;
  } catch (error) {
    console.error("Erro de login:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Falha ao fazer login');
  }
};

export const logoutUser = async () => {
  try {
    // Faz uma requisição DELETE para o endpoint /session para invalidar o token no backend
    await api.delete('/session');
    // Remove os dados de autenticação do localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_name');
    return true;
  } catch (error) {
    console.error("Erro ao sair:", error);
    // Mesmo com erro, remove os dados locais para garantir o logout no frontend
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_name');
    return false;
  }
};

export const checkAuth = async () => {
  const token = localStorage.getItem('auth_token');

  if (!token) {
    return null;
  }

  try {
    // Como não temos um endpoint específico para verificar a autenticação,
    // vamos apenas verificar se o token existe e retornar um objeto de usuário básico
    // Em um ambiente de produção, você faria uma chamada para verificar o token
    return {
      email: localStorage.getItem('user_email') || 'user@example.com',
      token: token,
      tokenType: 'bearer',
      id: localStorage.getItem('user_id'),
      name: localStorage.getItem('user_name') || ''
    };
  } catch (error) {
    console.error("Erro ao verificar autenticação:", error);
    localStorage.removeItem('auth_token');
    return null;
  }
};

export const updateUser = async (userData) => {
  try {
    // Obter o ID do usuário do localStorage
    const userId = localStorage.getItem('user_id');

    if (!userId) {
      throw new Error('ID do usuário não encontrado. Faça login novamente.');
    }

    console.log('Updating user with ID:', userId);
    // Usando PATCH em vez de PUT para atualizações parciais
    const response = await api.patch(`/user/${userId}`, userData);

    console.log('Update response:', response.data);

    // Se o nome foi atualizado, podemos atualizar no localStorage
    if (userData.name) {
      localStorage.setItem('user_name', userData.name);
    }

    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    console.error("Detalhes do erro:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers
    });
    throw new Error(error.response?.data?.error || error.message || 'Falha ao atualizar perfil');
  }
};
