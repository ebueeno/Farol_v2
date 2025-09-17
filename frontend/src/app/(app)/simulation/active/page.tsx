'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Button, Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { Textarea } from '@/components/ui/Textarea'
import { interviewChatbotService, InterviewConfig, InterviewSession, ChatMessage, InterviewFeedback } from '@/lib/interviewChatbot'

function SimulationActiveContent() {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [session, setSession] = useState<InterviewSession | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [currentMessage, setCurrentMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isInterviewStarted, setIsInterviewStarted] = useState(false)
  const [isInterviewCompleted, setIsInterviewCompleted] = useState(false)
  const [feedback, setFeedback] = useState<InterviewFeedback | null>(null)
  const [error, setError] = useState('')

  // Estados para funcionalidades de voz
  const [isListening, setIsListening] = useState(false)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voiceError, setVoiceError] = useState('')
  const recognitionRef = useRef<any>(null)

  // Configuração da simulação (vem da URL ou localStorage)
  const [config, setConfig] = useState<InterviewConfig | null>(null)

  // Inicialização do reconhecimento de voz
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition()
        recognition.continuous = false
        recognition.interimResults = false
        recognition.lang = 'pt-BR'

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript
          setCurrentMessage(prev => (prev + ' ' + transcript).trim())
        }

        recognition.onerror = (event: any) => {
          setVoiceError(`Erro no reconhecimento de voz: ${event.error}`)
          setIsListening(false)
        }

        recognition.onend = () => {
          setIsListening(false)
        }

        recognitionRef.current = recognition
      }
    }
  }, [])

  // Função para falar texto (text-to-speech)
  const speakText = (text: string) => {
    if (!isAudioEnabled || !text.trim()) return

    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'pt-BR'
    utterance.rate = 0.9
    utterance.pitch = 1
    utterance.volume = 0.8

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    window.speechSynthesis.speak(utterance)
  }

  // Função para alternar gravação de voz
  const toggleVoiceRecording = () => {
    if (!recognitionRef.current) {
      setVoiceError('Reconhecimento de voz não suportado neste navegador')
      return
    }

    if (isListening) {
      recognitionRef.current.stop()
    } else {
      setVoiceError('')
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  // Ler automaticamente mensagens do entrevistador
  useEffect(() => {
    const lastMessage = messages[messages.length - 1]
    if (lastMessage && lastMessage.role === 'interviewer' && isAudioEnabled) {
      setTimeout(() => speakText(lastMessage.content), 500)
    }
  }, [messages, isAudioEnabled])

  useEffect(() => {
    // Tentar obter configuração da URL ou localStorage
    const configParam = searchParams.get('config')
    if (configParam) {
      try {
        const parsedConfig = JSON.parse(decodeURIComponent(configParam))
        setConfig(parsedConfig)
      } catch (e) {
        console.error('Erro ao parsear configuração:', e)
      }
    } else {
      // Tentar obter do localStorage
      const savedConfig = localStorage.getItem('simulationConfig')
      if (savedConfig) {
        try {
          setConfig(JSON.parse(savedConfig))
        } catch (e) {
          console.error('Erro ao parsear configuração do localStorage:', e)
        }
      }
    }
  }, [searchParams])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const startInterview = async () => {
    if (!config) {
      setError('Configuração da simulação não encontrada. Por favor, configure uma nova simulação.')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const sessionData = await interviewChatbotService.startInterview(config)
      setSession(sessionData)
      setIsInterviewStarted(true)
      
      // Adicionar primeira pergunta do entrevistador
      const firstMessage: ChatMessage = {
        role: 'interviewer',
        content: sessionData.first_question,
        timestamp: new Date().toISOString()
      }
      setMessages([firstMessage])
    } catch (err: any) {
      console.error('Erro ao iniciar entrevista:', err)
      setError(err.message || 'Erro ao iniciar entrevista. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!currentMessage.trim() || !session || isLoading) return

    // Parar qualquer atividade de voz
    window.speechSynthesis.cancel()
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    }

    const userMessage: ChatMessage = {
      role: 'candidate',
      content: currentMessage.trim(),
      timestamp: new Date().toISOString()
    }

    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setCurrentMessage('')
    setIsLoading(true)

    try {
      const response = await interviewChatbotService.sendMessage(
        session.session_id,
        currentMessage.trim(),
        config!,
        newMessages
      )

      const interviewerMessage: ChatMessage = {
        role: 'interviewer',
        content: response.interviewer_response,
        timestamp: response.timestamp,
        message_id: response.message_id
      }

      setMessages([...newMessages, interviewerMessage])
    } catch (err: any) {
      console.error('Erro ao enviar mensagem:', err)
      setError(err.message || 'Erro ao enviar mensagem. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const endInterview = async () => {
    if (!session || !config) return

    // Parar atividades de voz
    window.speechSynthesis.cancel()
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    }

    setIsLoading(true)
    setError('')

    try {
      const feedbackData = await interviewChatbotService.endInterview(
        session.session_id,
        config,
        messages
      )
      
      setFeedback(feedbackData)
      setIsInterviewCompleted(true)
    } catch (err: any) {
      console.error('Erro ao finalizar entrevista:', err)
      setError(err.message || 'Erro ao finalizar entrevista. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!config) {
    return (
      <ProtectedRoute allowedUserTypes={['candidate']}>
        <div className="p-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              Configuração Não Encontrada
            </h1>
            <p className="text-muted-foreground mb-8">
              Não foi possível encontrar a configuração da simulação. Por favor, configure uma nova simulação.
            </p>
            <Button
              onClick={() => router.push('/simulation/start')}
              className="px-6 py-2 border-[#061531] bg-[#f9f7f2] text-[#061531] hover:bg-[#061531] hover:text-[#f9f7f2]"
            >
              Configurar Nova Simulação
            </Button>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (isInterviewCompleted && feedback) {
    return (
      <ProtectedRoute allowedUserTypes={['candidate']}>
        <div className="p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Entrevista Concluída!
              </h1>
              <p className="text-muted-foreground">
                Aqui está o feedback detalhado da sua simulação de entrevista
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Feedback da Entrevista
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {feedback.feedback}
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Tipo de Entrevista:</span> {feedback.interview_type}
                    </div>
                    <div>
                      <span className="font-medium">Nível:</span> {feedback.difficulty_level}
                    </div>
                    <div>
                      <span className="font-medium">Total de Mensagens:</span> {feedback.total_messages}
                    </div>
                    <div>
                      <span className="font-medium">Concluída em:</span> {formatTime(feedback.completed_at)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mt-8 flex justify-between">
              <Button
                variant="outline"
                onClick={() => router.push('/simulation')}
                className="px-6 py-2"
              >
                Ver Histórico
              </Button>
              <Button
                onClick={() => router.push('/simulation/start')}
                className="px-6 py-2 border-[#061531] bg-[#f9f7f2] text-[#061531] hover:bg-[#061531] hover:text-[#f9f7f2]"
              >
                Nova Simulação
              </Button>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute allowedUserTypes={['candidate']}>
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Simulação de Entrevista Ativa
            </h1>
            <p className="text-muted-foreground">
              {isInterviewStarted 
                ? 'Converse com o entrevistador de IA e pratique suas habilidades'
                : 'Configure e inicie sua simulação de entrevista personalizada'
              }
            </p>
          </div>

          {/* Controles de Voz - NOVO */}
          {isInterviewStarted && (
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                      className={`${isAudioEnabled ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`}
                    >
                      {isAudioEnabled ? (
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M6.343 6.343A8.96 8.96 0 003 12a8.96 8.96 0 003.343 5.657M9 9l6 6m0-6l-6 6" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
                        </svg>
                      )}
                      <span>{isAudioEnabled ? 'Áudio Ativo' : 'Áudio Desativado'}</span>
                    </Button>

                    {isSpeaking && (
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.speechSynthesis.cancel()}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 4h4v16H6V4zM14 4h4v16h-4V4z" />
                          </svg>
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    {recognitionRef.current && (
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm ${isListening ? 'text-red-600' : 'text-gray-600'}`}>
                          {isListening ? 'Ouvindo...' : 'Entrada por Voz'}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={toggleVoiceRecording}
                          disabled={isLoading}
                          className={`${isListening ? 'bg-red-50 border-red-200 text-red-700' : ''}`}
                        >
                          {isListening ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                            </svg>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {voiceError && (
                  <div className="mt-2 text-sm text-red-600">
                    {voiceError}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Erro</h3>
                  <div className="mt-2 text-sm text-red-700">{error}</div>
                </div>
              </div>
            </div>
          )}

          {!isInterviewStarted ? (
            <Card>
              <CardHeader>
                <CardTitle>Configuração da Simulação</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Tipo:</span> {config.interview_type}
                    </div>
                    <div>
                      <span className="font-medium">Nível:</span> {config.difficulty_level}
                    </div>
                    <div>
                      <span className="font-medium">Duração:</span> {config.duration} minutos
                    </div>
                    <div>
                      <span className="font-medium">Modo:</span> {config.interaction_mode}
                    </div>
                  </div>
                  
                  {config.focus_areas.length > 0 && (
                    <div>
                      <span className="font-medium">Áreas de Foco:</span>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {config.focus_areas.map((area) => (
                          <span
                            key={area}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6">
                  <Button
                    onClick={startInterview}
                    disabled={isLoading}
                    className="w-full px-6 py-2 border-[#061531] bg-[#f9f7f2] text-[#061531] hover:bg-[#061531] hover:text-[#f9f7f2]"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Iniciando...
                      </>
                    ) : (
                      'Iniciar Entrevista'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Chat Messages */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Conversa com o Entrevistador</span>
                    <div className="text-sm text-gray-500">
                      {messages.length} mensagens
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-96 overflow-y-auto space-y-4 mb-4">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${message.role === 'candidate' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.role === 'candidate'
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <div className="text-sm">{message.content}</div>
                          <div className={`text-xs mt-1 flex items-center justify-between ${
                            message.role === 'candidate' ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            <span>{formatTime(message.timestamp)}</span>
                            {/* Botão para repetir fala - NOVO */}
                            {message.role === 'interviewer' && (
                              <button
                                onClick={() => speakText(message.content)}
                                className="ml-2 hover:opacity-70"
                                disabled={isSpeaking}
                                title="Repetir mensagem"
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728" />
                                </svg>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Entrevistador está digitando...</span>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="space-y-4">
                    <div className="relative">
                      <Textarea
                        value={currentMessage}
                        onChange={(e) => setCurrentMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={isListening 
                          ? "Ouvindo... fale agora ou digite sua resposta..." 
                          : "Digite ou fale sua resposta aqui..."
                        }
                        className={`min-h-[100px] resize-none pr-12 ${
                          isListening ? 'border-red-300 bg-red-50' : ''
                        }`}
                        disabled={isLoading}
                      />
                      {/* Botão de microfone no campo - NOVO */}
                      {recognitionRef.current && (
                        <button
                          onClick={toggleVoiceRecording}
                          disabled={isLoading}
                          className={`absolute right-3 top-3 p-2 rounded-md transition-colors ${
                            isListening 
                              ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                          title={isListening ? "Parar gravação" : "Começar gravação"}
                        >
                          {isListening ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                            </svg>
                          )}
                        </button>
                      )}
                    </div>
                    
                    <div className="flex justify-between">
                      <Button
                        variant="outline"
                        onClick={() => router.push('/simulation')}
                        disabled={isLoading}
                      >
                        Cancelar
                      </Button>
                      
                      <div className="space-x-2">
                        <Button
                          onClick={sendMessage}
                          disabled={!currentMessage.trim() || isLoading}
                          className="px-6 py-2 border-[#061531] bg-[#f9f7f2] text-[#061531] hover:bg-[#061531] hover:text-[#f9f7f2]"
                        >
                          Enviar
                        </Button>
                        
                        <Button
                          onClick={endInterview}
                          disabled={isLoading}
                          variant="outline"
                          className="px-6 py-2"
                        >
                          Finalizar Entrevista
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}

function LoadingFallback() {
  return (
    <ProtectedRoute allowedUserTypes={['candidate']}>
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Carregando Simulação...
            </h1>
            <p className="text-muted-foreground">
              Preparando sua simulação de entrevista
            </p>
          </div>
          
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#061531]"></div>
                <span className="ml-3 text-gray-600">Carregando...</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default function SimulationActivePage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SimulationActiveContent />
    </Suspense>
  )
}
