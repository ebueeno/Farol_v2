'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { authService, User } from '@/lib/auth'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (token: string) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [lastFetchTime, setLastFetchTime] = useState<number>(0)
  const router = useRouter()
  const pathname = usePathname()

  // Cálculo simples e direto: se user não for null, está autenticado
  const isAuthenticated = !!user

  // Função para buscar dados do usuário atual com cache
  const fetchUserProfile = useCallback(async (forceRefresh = false): Promise<User | null> => {
    try {
      const token = authService.getToken()
      if (!token) {
        console.log('🔑 Nenhum token encontrado')
        return null
      }

      // Cache de 30 segundos para evitar chamadas desnecessárias
      const now = Date.now()
      const cacheTime = 30000 // 30 segundos
      
      if (!forceRefresh && user && (now - lastFetchTime) < cacheTime) {
        console.log('📦 Usando dados em cache')
        return user
      }

      console.log('🔍 Buscando dados do usuário...')
      const userData = await authService.getCurrentUser()
      console.log('✅ Dados do usuário obtidos:', userData)
      
      setLastFetchTime(now)
      
      // IMPORTANTE: Retornar os dados do usuário mesmo que campos estejam vazios
      // O importante é que o objeto user existe, não o conteúdo dos campos
      return userData
    } catch (error) {
      console.error('❌ Erro ao buscar dados do usuário:', error)
      // Se houver erro (token inválido), limpar o localStorage
      authService.logout()
      return null
    }
  }, [user, lastFetchTime])

  // Função de login que salva o token e busca os dados do usuário
  const login = useCallback(async (token: string): Promise<void> => {
    try {
      console.log('🚀 Iniciando processo de login...')
      setIsLoading(true)
      
      // Salvar token no localStorage
      authService.setToken(token)
      console.log('💾 Token salvo no localStorage')
      
      // Buscar dados do usuário
      const userData = await fetchUserProfile()
      
      if (userData) {
        setUser(userData)
        console.log('✅ Login realizado com sucesso')
        
        // Redirecionar imediatamente sem delay
        console.log('🔄 Redirecionando para dashboard...')
        router.push('/dashboard')
      } else {
        throw new Error('Falha ao carregar dados do usuário')
      }
    } catch (error) {
      console.error('❌ Erro no login:', error)
      // Limpar token em caso de erro
      authService.logout()
      setUser(null)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [fetchUserProfile, router])

  // Função de logout
  const logout = useCallback((): void => {
    console.log('🚪 Fazendo logout...')
    setUser(null)
    authService.logout()
    
    // Redirecionar imediatamente sem delay
    console.log('🔄 Redirecionando para login...')
    router.push('/login')
  }, [router])

  // Função para atualizar dados do usuário
  const refreshUser = useCallback(async (): Promise<void> => {
    try {
      const userData = await fetchUserProfile(true) // Force refresh
      setUser(userData)
    } catch (error) {
      console.error('❌ Erro ao atualizar dados do usuário:', error)
      logout()
    }
  }, [fetchUserProfile, logout])

  // useEffect para verificar autenticação ao carregar a aplicação
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('🔄 Inicializando autenticação...')
        setIsLoading(true)
        
        const token = authService.getToken()
        if (token) {
          console.log('🔑 Token encontrado, buscando dados do usuário...')
          // Se há token, tentar buscar dados do usuário
          const userData = await fetchUserProfile()
          setUser(userData)
        } else {
          console.log('🔑 Nenhum token encontrado')
          // Se não há token, definir usuário como null imediatamente
          setUser(null)
        }
      } catch (error) {
        console.error('❌ Erro ao inicializar autenticação:', error)
        // Em caso de erro, garantir que o estado esteja limpo
        setUser(null)
      } finally {
        // SEMPRE definir isLoading como false, independente do resultado
        console.log('✅ Inicialização de autenticação concluída')
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [fetchUserProfile])

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook personalizado para usar o AuthContext
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}

// Hook para verificar se o usuário tem permissão específica
export function useUserType() {
  const { user } = useAuth()
  return user?.user_type || null
}

// Hook para verificar se o usuário está ativo
export function useIsActive() {
  const { user } = useAuth()
  return user?.is_active || false
}
