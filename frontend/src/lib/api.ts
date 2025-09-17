import axios from 'axios'

// Configuração para diferentes ambientes
const getApiBaseUrl = () => {
  // Prioridade 1: Variável de ambiente NEXT_PUBLIC_API_URL (para produção)
  if (process.env.NEXT_PUBLIC_API_URL) {
    // Garantir que a URL tenha o prefixo /api/v1
    const url = process.env.NEXT_PUBLIC_API_URL
    return url.endsWith('/api/v1') ? url : `${url}/api/v1`
  }
  
  // Prioridade 2: Desenvolvimento local
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:8000/api/v1'
  }
  
  // Fallback: URL padrão do backend em produção
  return 'https://farol-backend.onrender.com/api/v1'
}

const API_BASE_URL = getApiBaseUrl()

// Log para debug (apenas em desenvolvimento e no cliente)
if (typeof window !== 'undefined') {
  console.log('🔗 API Base URL:', API_BASE_URL)
  console.log('🔗 NODE_ENV:', process.env.NODE_ENV)
  console.log('🔗 NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL)
  console.log('🔗 RENDER:', process.env.RENDER)
  console.log('🔗 Usando URL absoluta:', process.env.NEXT_PUBLIC_API_URL ? 'Sim' : 'Não')
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 segundos de timeout
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para adicionar token de autenticação
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor para tratar erros de resposta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log detalhado para debug
    if (process.env.NODE_ENV === 'development') {
      console.error('🚨 API Error:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL
        }
      })
    }

    if (error.response?.status === 401) {
      localStorage.removeItem('authToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
