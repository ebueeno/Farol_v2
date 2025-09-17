'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button, Input, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import { authService } from '@/lib/auth'
import { useAuth } from '@/contexts/AuthContext'
import { PublicRoute } from '@/components/auth/ProtectedRoute'

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Limpar erro quando usuário começar a digitar
    if (error) setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      console.log('🔐 Tentando fazer login...')
      
      // O backend espera 'username' no OAuth2PasswordRequestForm
      const response = await authService.login({
        username: formData.email,
        password: formData.password
      })

      console.log('✅ Login bem-sucedido, processando token...')
      
      // Usar a função login do AuthContext que gerencia todo o fluxo
      await login(response.access_token)
      
      console.log('🎉 Redirecionamento iniciado')
    } catch (err: any) {
      console.error('❌ Erro no login:', err)
      
      // Tratar diferentes tipos de erro
      if (err.code === 'ECONNABORTED') {
        setError('Tempo limite excedido. Tente novamente.')
      } else if (err.response?.status === 401) {
        setError('Email ou senha incorretos.')
      } else if (err.response?.status === 400) {
        setError('Usuário inativo. Entre em contato com o suporte.')
      } else if (err.response?.status >= 500) {
        setError('Erro no servidor. Tente novamente em alguns minutos.')
      } else {
        setError(
          err.response?.data?.detail || 
          'Erro ao fazer login. Verifique suas credenciais.'
        )
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <PublicRoute>
      <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Logo e Header */}
          <div className="text-center">
            <div className="mx-auto h-16 w-16 mb-4">
              <Image
                src="/images/logo.png"
                alt="Farol - Plataforma de Empregabilidade Inclusiva"
                width={64}
                height={64}
                priority
                className="mx-auto"
              />
            </div>
            <h2 className="text-3xl font-bold text-foreground">
              Bem-vindo de volta
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Entre na sua conta para continuar sua jornada
            </p>
          </div>

          {/* Card de Login */}
          <Card className="shadow-xl border-border">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl text-center text-foreground">
                Fazer Login
              </CardTitle>
              <CardDescription className="text-center text-muted-foreground">
                Digite suas credenciais para acessar sua conta
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Campo Email */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-foreground">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="h-11 text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                {/* Campo Senha */}
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-foreground">
                    Senha
                  </label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    placeholder="Digite sua senha"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="h-11 text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                {/* Mensagem de Erro */}
                {error && (
                  <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-destructive" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-destructive">
                          Erro no login
                        </h3>
                        <div className="mt-1 text-sm text-destructive/80">
                          {error}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Botão de Login */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Entrando...
                    </>
                  ) : (
                    'Entrar'
                  )}
                </Button>
              </form>

              {/* Divisor */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Ou continue com
                  </span>
                </div>
              </div>

              {/* Links */}
              <div className="space-y-3">
                <div className="text-center">
                  <span className="text-sm text-muted-foreground">
                    Não tem uma conta?{' '}
                  </span>
                  <Link 
                    href="/register" 
                    className="text-sm font-medium text-primary hover:text-primary/80 hover:underline"
                  >
                    Criar conta gratuitamente
                  </Link>
                </div>
                
                <div className="text-center">
                  <Link 
                    href="/" 
                    className="text-sm text-muted-foreground hover:text-foreground hover:underline"
                  >
                    ← Voltar para a página inicial
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Ao fazer login, você concorda com nossos{' '}
              <Link href="/terms" className="text-primary hover:text-primary/80 hover:underline">
                Termos de Uso
              </Link>{' '}
              e{' '}
              <Link href="/privacy" className="text-primary hover:text-primary/80 hover:underline">
                Política de Privacidade
              </Link>
            </p>
          </div>
        </div>
      </div>
    </PublicRoute>
  )
}
