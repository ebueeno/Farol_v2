import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Seção 1: Hero - Tema Escuro para Impacto Visual */}
      <section className="relative overflow-hidden bg-primary">
        <div className="max-w-7xl mx-auto px-6 py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            {/* Logo */}
            <div className="mb-12">
              <Image
                src="/images/logo.png"
                alt="Farol - Plataforma de Empregabilidade Inclusiva"
                width={200}
                height={80}
                priority
                className="mx-auto"
              />
            </div>
            
            {/* Título e Subtítulo */}
            <h1 className="text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-8">
              Iluminando Carreiras,{' '}
              <span className="text-primary-foreground/80">Removendo Barreiras.</span>
            </h1>
            
            <p className="text-xl text-primary-foreground/90 leading-relaxed max-w-3xl mx-auto mb-12">
              A primeira plataforma de empregabilidade 100% acessível do Brasil, que utiliza 
              Inteligência Artificial para conectar talentos com deficiência (PCD) às melhores 
              oportunidades de trabalho.
            </p>
            
            {/* Botões */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link href="/register">
                <Button className="text-lg px-8 py-6">
                  Criar Conta Gratuitamente
                </Button>
              </Link>
              <Link href="/login">
                <Button className="text-lg px-8 py-6">
                  Já tenho conta
                </Button>
              </Link>
            </div>
            
            {/* Elementos Flutuantes */}
            <div className="relative">
              <div className="flex flex-wrap justify-center gap-4">
                {/* Card 1 - Busca Inteligente */}
                <div className="bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 rounded-2xl p-4 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-success/20 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-primary-foreground">Busca Inteligente</p>
                      <p className="text-xs text-primary-foreground/70">Compatibilidade IA</p>
                    </div>
                  </div>
                </div>
                
                {/* Card 2 - IA por Voz */}
                <div className="bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 rounded-2xl p-4 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-info/20 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-primary-foreground">IA por Voz</p>
                      <p className="text-xs text-primary-foreground/70">Navegação acessível</p>
                    </div>
                  </div>
                </div>
                
                {/* Card 3 - Inclusivo */}
                <div className="bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 rounded-2xl p-4 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-warning/20 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-primary-foreground">Inclusivo</p>
                      <p className="text-xs text-primary-foreground/70">Para todos</p>
                    </div>
                  </div>
                </div>
                
                {/* Card 4 - IA + Acessibilidade */}
                <div className="bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 rounded-2xl p-4 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-primary-foreground">IA + Acessibilidade</p>
                      <p className="text-xs text-primary-foreground/70">Tecnologia inclusiva</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção 2: Nossa Solução */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Nossa Solução: Um Ecossistema Completo e Inteligente
            </h2>
            <p className="text-xl text-foreground max-w-3xl mx-auto">
              Combinamos tecnologia de ponta com design acessível para criar uma experiência 
              única e inclusiva para todos os usuários.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <Card className="p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
              <CardHeader className="text-center pb-6">
                <div className="w-20 h-20 bg-primary/10 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <CardTitle className="text-2xl text-foreground">Onboarding por Voz</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-foreground leading-relaxed text-center">
                  Esqueça formulários longos. Cadastre seu perfil de forma conversacional e 
                  acessível, guiado por nossa IA.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
              <CardHeader className="text-center pb-6">
                <div className="w-20 h-20 bg-primary/10 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <CardTitle className="text-2xl text-foreground">Busca Proativa com IA</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-foreground leading-relaxed text-center">
                  Vá além dos filtros. Nossa IA calcula um 'Índice de Compatibilidade' entre 
                  seu perfil e a cultura inclusiva da empresa.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
              <CardHeader className="text-center pb-6">
                <div className="w-20 h-20 bg-primary/10 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <CardTitle className="text-2xl text-foreground">Hub de Desenvolvimento</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-foreground leading-relaxed text-center">
                  Receba trilhas de aprendizagem personalizadas para desenvolver as 
                  competências que o mercado procura.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
              <CardHeader className="text-center pb-6">
                <div className="w-20 h-20 bg-primary/10 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 1v6m0 0l-3-3m3 3l3-3" />
                  </svg>
                </div>
                <CardTitle className="text-2xl text-foreground">Assistente Nativo "Farol"</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-foreground leading-relaxed text-center">
                  Navegue, descreva a tela e interaja com toda a plataforma usando apenas 
                  comandos de voz.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Seção 3: Planos */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Um Plano para Cada Etapa da Sua Carreira
            </h2>
            <p className="text-xl text-foreground max-w-3xl mx-auto">
              Comece gratuitamente e evolua conforme suas necessidades crescem. 
              Sem compromissos, sem pegadinhas.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {/* Plano Gratuito */}
            <Card className="p-10 border-2 hover:shadow-lg transition-all duration-300">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-3xl text-foreground">Gratuito</CardTitle>
                <div className="text-5xl font-bold text-primary mt-6">R$ 0,00</div>
                <p className="text-foreground text-lg">para sempre</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <svg className="w-6 h-6 text-success" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-foreground">Cadastro de perfil completo</span>
                </div>
                <div className="flex items-center space-x-4">
                  <svg className="w-6 h-6 text-success" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-foreground">Busca de vagas ilimitada</span>
                </div>
                <div className="flex items-center space-x-4">
                  <svg className="w-6 h-6 text-success" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-foreground">Até 5 candidaturas por mês</span>
                </div>
                <div className="flex items-center space-x-4">
                  <svg className="w-6 h-6 text-success" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-foreground">Análise inicial de currículo com IA</span>
                </div>
                <div className="flex items-center space-x-4">
                  <svg className="w-6 h-6 text-success" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-foreground">1 simulação de entrevista por mês</span>
                </div>
                <div className="pt-8">
                  <Link href="/register">
                    <Button className="w-full text-foreground">
                      Comece Agora
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
            
            {/* Plano Premium - Destaque */}
            <Card className="p-10 border-2 border-primary shadow-2xl relative hover:shadow-3xl transition-all duration-300 transform scale-105">
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary text-primary-foreground px-6 py-3 rounded-full text-lg font-medium shadow-lg">
                  Mais Popular
                </span>
              </div>
              <CardHeader className="text-center pb-8 pt-4">
                <CardTitle className="text-3xl text-foreground">Premium</CardTitle>
                <div className="text-5xl font-bold text-primary mt-6">R$ 29,90</div>
                <p className="text-foreground text-lg">por mês</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <svg className="w-6 h-6 text-success" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-foreground">Tudo do plano Gratuito, e mais:</span>
                </div>
                <div className="flex items-center space-x-4">
                  <svg className="w-6 h-6 text-success" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-foreground">Candidaturas ilimitadas</span>
                </div>
                <div className="flex items-center space-x-4">
                  <svg className="w-6 h-6 text-success" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-foreground">Análise de currículo contínua e aprofundada</span>
                </div>
                <div className="flex items-center space-x-4">
                  <svg className="w-6 h-6 text-success" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-foreground">Simulações de entrevista ilimitadas</span>
                </div>
                <div className="flex items-center space-x-4">
                  <svg className="w-6 h-6 text-success" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-foreground">Acesso completo ao Hub de Desenvolvimento</span>
                </div>
                <div className="flex items-center space-x-4">
                  <svg className="w-6 h-6 text-success" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-foreground">Perfil com destaque para recrutadores</span>
                </div>
                <div className="pt-8">
                  <Link href="/register">
                    <Button className="w-full">
                      Seja Premium
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
            
            {/* Plano para Empresas */}
            <Card className="p-10 border-2 hover:shadow-lg transition-all duration-300">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-3xl text-foreground">Para Empresas</CardTitle>
                <div className="text-5xl font-bold text-primary mt-6">Sob Consulta</div>
                <p className="text-foreground text-lg">planos customizados</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-foreground leading-relaxed text-center">
                  Temos planos customizados para publicação de vagas, acesso ao nosso banco de 
                  talentos e ferramentas de analytics para fortalecer sua marca empregadora inclusiva.
                </p>
                <div className="pt-8">
                  <Button className="w-full text-foreground">
                    Solicitar Contato
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Seção 4: CTA Final */}
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-primary-foreground mb-8">
            Junte-se a Nós na Construção de um Futuro Mais Inclusivo
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-12 leading-relaxed">
            Cada perfil criado, cada vaga preenchida, cada carreira transformada é um passo 
            em direção a um mercado de trabalho verdadeiramente inclusivo. Seja parte dessa mudança.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button className="text-lg px-8 py-6">
                Comece Gratuitamente Agora
              </Button>
            </Link>
            <Link href="/login">
              <Button className="text-lg px-8 py-6">
                Já tenho conta
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
