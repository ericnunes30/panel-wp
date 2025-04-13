
import axios from 'axios';

// Criar instância axios com configuração padrão
const api = axios.create({
  baseURL: 'http://localhost:3333', // Atualizado para corresponder à URL do endpoint de sessão
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true // Importante para CORS com credentials
});

// Interceptor para adicionar token de autenticação às requisições
api.interceptors.request.use(config => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    // Formato esperado pelo endpoint /session
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Interceptor para tratar erros comuns de resposta
api.interceptors.response.use(
  response => response,
  error => {
    const { status } = error.response || {};

    // Tratar erros 401 (não autorizado)
    if (status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;
