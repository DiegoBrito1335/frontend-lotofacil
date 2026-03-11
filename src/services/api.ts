import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000,
  withCredentials: true,
})

// Envia JWT via Authorization header (funciona em mobile/Safari onde cookies cross-origin são bloqueados)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const requestUrl = error.config?.url || ''
      // /auth/me é usado para verificar sessão no carregamento — 401 é esperado se não autenticado
      if (!requestUrl.includes('/auth/me')) {
        localStorage.removeItem('user_name')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
