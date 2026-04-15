import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import CookieBanner from '@/components/CookieBanner'
import { useEffect, useState, useRef } from 'react'
import { bolaoService } from '@/services/bolaoService'
import type { Bolao } from '@/types'
import {
  Clover,
  Ticket,
  Users,
  Wallet,
  QrCode,
  Shield,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  Star,
  LogIn,
  Menu,
  X,
  Database,
  CreditCard,
} from 'lucide-react'

import FAQItem from '@/components/ui/FAQItem'

function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const stats = [
    { icon: Users, value: '10k+', label: 'Jogadores Ativos' },
    { icon: Wallet, value: 'R$ 2M+', label: 'Prêmios Pagos' },
    { icon: Ticket, value: '500+', label: 'Bolões Vencedores' },
    { icon: Shield, value: '100%', label: 'Garantia de Divisão' },
  ]

  return (
    <section ref={sectionRef} className="bg-[#f8fafc] pb-20 pt-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`flex flex-col items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow ${
                visible ? `float-up float-up-delay-${i}` : 'opacity-0'
              }`}
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-green-50 mb-3 text-green-600">
                <stat.icon className="w-7 h-7" />
              </div>
              <p className={`text-3xl font-black text-gray-900 ${visible ? 'counter-reveal' : 'opacity-0'}`}
                 style={{ animationDelay: `${0.2 + i * 0.15}s` }}>
                {stat.value}
              </p>
              <p className="text-sm font-semibold text-gray-500 mt-1 uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function LiveBolaoShowcase() {
  const [boloes, setBoloes] = useState<Bolao[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    bolaoService.listar(true).then(data => {
      setBoloes(data.slice(0, 3)) // Mostra os 3 primeiros
    }).catch(() => {
      // Falha silenciosa na landing page
    }).finally(() => {
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 w-full max-w-5xl mx-auto">
        {[1, 2, 3].map(i => (
          <div key={i} className="glass-panel p-6 rounded-2xl h-48 animate-pulse flex flex-col justify-between">
            <div className="h-6 bg-white/20 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-white/20 rounded w-1/2 mb-2"></div>
            <div className="h-10 bg-white/30 rounded-lg w-full mt-auto"></div>
          </div>
        ))}
      </div>
    )
  }

  if (boloes.length === 0) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 w-full max-w-6xl mx-auto px-4 z-20 relative">
      <div className="md:col-span-3 text-center mb-2">
        <h3 className="text-white/90 font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2">
          <span className="w-2 h-2 bg-green-400 rounded-full live-pulse"></span>
          Bolões Disponíveis Agora
        </h3>
      </div>
      {boloes.map((bolao) => (
        <div key={bolao.id} className="glass-card hover:-translate-y-2 transition-all duration-300 rounded-[24px] p-6 text-left relative overflow-hidden group border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
          <div className="absolute top-0 right-0 bg-yellow-400 text-green-900 text-xs font-bold px-3 py-1 rounded-bl-lg">
            Concurso {bolao.concurso_numero}
          </div>
          <h4 className="font-bold text-gray-900 text-xl mb-1 pr-16">{bolao.nome}</h4>
          <p className="text-gray-600 text-sm mb-4 line-clamp-1">{bolao.descricao || "Bolão oficial da plataforma"}</p>
          
          <div className="flex items-end justify-between mb-2">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Valor da Cota</p>
              <p className="text-2xl font-extrabold text-green-700">R$ {Number(bolao.valor_cota).toFixed(2)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 font-medium">Restam</p>
              <p className="font-bold text-gray-800">{bolao.cotas_disponiveis} cotas</p>
            </div>
          </div>
          
          <Link 
            to={`/bolao/${bolao.id}`}
            className="mt-4 w-full block text-center bg-gray-900 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            Garantir Minha Cota
          </Link>
        </div>
      ))}
    </div>
  )
}

export default function LandingPage() {
  const { isAuthenticated } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen font-sans">
      {/* ===== HEADER / NAVBAR ===== */}
      <header className="absolute top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-black text-2xl no-underline text-white drop-shadow-md">
            <Clover className="w-8 h-8 text-yellow-300" />
            <span>Bolão Lotofácil</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20">
            <a href="#como-funciona" className="text-white hover:text-yellow-300 text-sm font-semibold no-underline transition-colors">
              Como Funciona
            </a>
            <a href="#vantagens" className="text-white hover:text-yellow-300 text-sm font-semibold no-underline transition-colors">
              Vantagens
            </a>
            <a href="#faq" className="text-white hover:text-yellow-300 text-sm font-semibold no-underline transition-colors">
              Dúvidas
            </a>
          </nav>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <Link
                to="/boloes"
                className="flex items-center gap-2 bg-yellow-400 text-green-900 font-bold text-sm px-6 py-3 rounded-xl no-underline hover:bg-yellow-300 transition-all glow-accent"
              >
                <Ticket className="w-4 h-4" />
                Meus Bolões
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 text-white hover:text-yellow-300 text-sm font-bold no-underline transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  Entrar
                </Link>
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 bg-yellow-400 text-green-900 font-bold text-sm px-6 py-3 rounded-xl no-underline hover:bg-yellow-300 hover:scale-105 transition-all glow-accent"
                >
                  Criar Conta
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-lg p-2"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {menuOpen && (
          <div className="md:hidden bg-green-900/95 backdrop-blur-xl border-b border-white/10 px-4 py-6 shadow-2xl absolute w-full">
            <div className="flex flex-col space-y-4">
              <a href="#como-funciona" onClick={() => setMenuOpen(false)} className="text-white font-medium text-lg border-b border-white/10 pb-2">Como Funciona</a>
              <a href="#vantagens" onClick={() => setMenuOpen(false)} className="text-white font-medium text-lg border-b border-white/10 pb-2">Vantagens</a>
              <a href="#faq" onClick={() => setMenuOpen(false)} className="text-white font-medium text-lg border-b border-white/10 pb-2">FAQ</a>
              
              <div className="pt-4 flex flex-col gap-3">
                {isAuthenticated ? (
                  <Link to="/boloes" className="w-full text-center bg-yellow-400 text-green-900 font-bold py-4 rounded-xl">Meus Bolões</Link>
                ) : (
                  <>
                    <Link to="/login" className="w-full text-center text-white border border-white/30 font-bold py-4 rounded-xl">Fazer Login</Link>
                    <Link to="/login" className="w-full text-center bg-yellow-400 text-green-900 font-bold py-4 rounded-xl">Criar Conta Grátis</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ===== HERO SECTION ===== */}
      <section className="relative bg-[#0f3b21] min-h-screen flex flex-col py-32 overflow-hidden">
        {/* Background Gradients & Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-green-500/20 blur-[120px]"></div>
          <div className="absolute top-[30%] -right-[15%] w-[40%] h-[60%] rounded-full bg-emerald-400/20 blur-[100px]"></div>
          <div className="absolute bottom-[10%] left-[20%] w-[30%] h-[40%] rounded-full bg-yellow-400/10 blur-[90px]"></div>
        </div>

        <div className="flex-grow flex flex-col items-center justify-center max-w-7xl mx-auto px-4 relative z-10 w-full text-center pt-8">
          <div className="inline-flex items-center gap-2 glass-panel px-5 py-2.5 rounded-full mb-8 shadow-lg border border-white/20 hover:bg-white/10 transition-colors cursor-default">
            <Star className="w-4 h-4 text-yellow-300" />
            <span className="text-sm font-semibold text-white tracking-wide">A Plataforma de Bolões que mais cresce</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white mb-6 leading-[1.05] tracking-tight">
            Pare de jogar <br className="hidden md:block"/> dinheiro fora. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">
              Jogue em Grupo!
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-green-50 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
            Compre cotas dos bolões mais bem elaborados. Pague com Pix, acompanhe ao vivo e receba seu prêmio instantâneo na carteira.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <Link
              to={isAuthenticated ? '/boloes' : '/login'}
              className="cta-shimmer w-full sm:w-auto flex items-center justify-center gap-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-green-950 font-black text-lg px-10 py-5 rounded-2xl no-underline hover:scale-105 transition-all shadow-[0_0_40px_rgba(250,204,21,0.4)]"
            >
              <Ticket className="w-6 h-6" />
              {isAuthenticated ? 'Ver Bolões Disponíveis' : 'Quero Participar Agora'}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-6 md:gap-10 mt-12 text-green-100/80 font-medium">
            <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-400" /> 100% Seguro</div>
            <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-400" /> Pagamento Instantâneo via Pix</div>
            <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-400" /> Divisão Automática de Prêmios</div>
          </div>
          
          {/* SHOWCASE AO VIVO! */}
          <LiveBolaoShowcase />
        </div>
        
        {/* Curva divisória suave inferior */}
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 md:h-24" fill="#f8fafc">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" fill="#f8fafc"></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,12.24,87.75,11.41C1115.11,92.51,1162.77,77.58,1200,52.47V0Z" opacity=".5" fill="#f8fafc"></path>
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="#f8fafc"></path>
          </svg>
        </div>
      </section>

      {/* ===== SOCIAL PROOF / STATS ===== */}
      <StatsSection />

      {/* ===== COMO FUNCIONA (Redesign Premium) ===== */}
      <section id="como-funciona" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">O Fim das Filas de Lotérica</h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">Um modelo testado para multiplicar chances investindo de forma inteligente.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto relative">
            {/* Timeline Line */}
            <div className="hidden md:block absolute top-[60px] left-[15%] right-[15%] h-1 bg-gradient-to-r from-green-100 via-green-300 to-yellow-100 z-0"></div>

            {[
              {
                step: '1',
                icon: Wallet,
                title: 'Abasteça',
                desc: 'Coloque saldo via Pix. É instantâneo, seguro, sem taxas e fica vinculado 100% ao seu CPF.',
                bgColor: 'bg-emerald-50',
                iconColor: 'text-emerald-500'
              },
              {
                step: '2',
                icon: Users,
                title: 'Junte-se à Tropa',
                desc: 'Adquira cotas dos nossos super bolões. Jogamos com muitas dezenas cercadas matematicamente.',
                bgColor: 'bg-green-50',
                iconColor: 'text-green-500'
              },
              {
                step: '3',
                icon: TrendingUp,
                title: 'Comemore!',
                desc: 'O rateio é automático. Caiu o prêmio, seu saldo infla na hora, pronto para novo saque Pix.',
                bgColor: 'bg-yellow-50',
                iconColor: 'text-yellow-500'
              },
            ].map((item) => (
              <div key={item.step} className="bg-white border text-center border-gray-100 p-8 rounded-[32px] shadow-xl shadow-green-900/5 relative z-10 hover:-translate-y-2 transition-transform duration-300">
                <div className={`w-20 h-20 mx-auto rounded-full ${item.bgColor} ${item.iconColor} flex items-center justify-center mb-6 shadow-sm border border-white`}>
                  <item.icon className="w-10 h-10" />
                </div>
                <div className="absolute top-0 right-8 -translate-y-1/2 w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center font-black text-xl shadow-lg border-4 border-white">
                  {item.step}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-500 text-lg leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== VANTAGENS ===== */}
      <section id="vantagens" className="py-24 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1">
              <h2 className="text-4xl font-black text-gray-900 mb-6 leading-tight">Engenharia reversa na Sorte.</h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Nós criamos o sistema perfeito para você nunca mais jogar um bilhete de 15 dezenas simples sozinho.
              </p>
              
              <div className="space-y-6">
                {[
                  { icon: QrCode, title: 'Carteira Pix 24/7', desc: 'Aporte de saldo e Saque integral dos lucros 24h por dia na velocidade do Pix Mercado Pago.' },
                  { icon: Shield, title: 'Blindagem de Informações', desc: 'Ninguem acessa ou visualiza seus dados. Sombreamento via SSL e banco Supabase V2.' },
                  { icon: Database, title: 'Transparência Auditável', desc: 'Antes mesmo do sorteio você tem comprovante digital de todos os cartões cadastrados e suas dezenas.' },
                ].map((feat) => (
                  <div key={feat.title} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white transition-colors border border-transparent hover:border-gray-200 hover:shadow-sm">
                    <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center shrink-0">
                      <feat.icon className="w-7 h-7 text-green-700" />
                    </div>
                    <div className="pt-1">
                      <h3 className="font-bold text-xl text-gray-900 mb-1">{feat.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{feat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 w-full max-w-lg relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-green-400 to-yellow-300 transform rotate-6 rounded-[40px] opacity-20 blur-xl"></div>
              <div className="relative glass-wallet p-8 border-[8px] border-white/10 skew-y-2">
                <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                  <div className="text-white">
                    <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-1">Saldo Disponível</p>
                    <p className="text-3xl font-black">R$ <span className="text-green-400">14.050,00</span></p>
                  </div>
                  <Clover className="w-10 h-10 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" />
                </div>
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-2xl p-4 flex justify-between items-center relative overflow-hidden group border border-green-500/10">
                    <div className="absolute inset-0 bg-green-400/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                    <div className="relative z-10 w-full">
                      <p className="text-white font-bold">Prêmio: Bolão Lotofácil 3004</p>
                      <p className="text-green-400 font-semibold text-sm">+ R$ 4.250,00</p>
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-4 flex justify-between items-center relative overflow-hidden group border border-green-500/10">
                    <div className="absolute inset-0 bg-green-400/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                    <div className="relative z-10 w-full">
                      <p className="text-white font-bold">Prêmio: Lotofácil da Independência</p>
                      <p className="text-green-400 font-semibold text-sm">+ R$ 9.800,00</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FAQ SECTION ===== */}
      <section id="faq" className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-4">Dúvidas Frequentes</h2>
            <p className="text-xl text-gray-500">Respondemos o essencial para você jogar com confiança.</p>
          </div>

          <div className="bg-gray-50 rounded-3xl p-8 md:p-12 border border-gray-200">
            <FAQItem 
              question="Minhas cotas e prêmios são garantidos?" 
              answer="100%. Quando o bolão atinge a meta e é registrado na CEF, enviamos o bilhete digitalizado do jogo. Se o nosso bolão ganhar, o rateio do prêmio (dividido pelo número total de cotas) entra instantaneamente como saldo líquido na sua carteira da plataforma para saque via Pix."
            />
            <FAQItem 
              question="Como eu recebo meu dinheiro?" 
              answer="Basta ir no menu Carteira, solicitar 'Sacar' e inserir a sua chave Pix. O pagamento será processado em minutos para a chave cadastrada."
            />
            <FAQItem 
              question="Existe taxa de administração ou imposto embutido?" 
              answer="O valor da cota mostrado no sistema já contém todos os custos previstos e embutidos. O lucro que você ganha na premiação é seu lucro limpo e não cobraremos nenhuma comissão sobre o saque dele."
            />
            <FAQItem 
              question="O que acontece se o Bolão não atingir o 100% de venda?" 
              answer="Depende do grupo! Se não fechar, devolveremos o valor total das cotas convertidos em saldo na sua carteira antes do sorteio. Porém nós assumimos até 10% dos bolões que não fecham para que não haja cancelamento desnecessário."
            />
          </div>
        </div>
      </section>

      {/* ===== CTA FINAL ===== */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-green-900"></div>
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-green-600 rounded-full blur-[100px] opacity-60"></div>
        <div className="absolute -left-20 -top-20 w-96 h-96 bg-yellow-500 rounded-full blur-[100px] opacity-30"></div>
        
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <Clover className="w-20 h-20 mx-auto mb-6 text-yellow-400 drop-shadow-xl" />
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            A Sorte Favorece a Tática
          </h2>
          <p className="text-xl md:text-2xl text-green-100 mb-10 max-w-2xl mx-auto font-light">
            O próximo sorteio pode ser histórico. Junte-se agora sem taxas absurdas, pague no PIX e aumente suas chances em até 40x.
          </p>
          <Link
            to={isAuthenticated ? '/boloes' : '/login'}
            className="inline-flex items-center gap-3 bg-yellow-400 text-green-950 font-black text-xl px-12 py-5 rounded-2xl no-underline hover:scale-105 transition-all shadow-[0_0_50px_rgba(250,204,21,0.5)]"
          >
            {isAuthenticated ? 'Abrir Painel' : 'Quero Abrir Minha Conta e Jogar'}
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-gray-950 text-gray-400 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 text-white font-black text-2xl mb-4">
                <Clover className="w-8 h-8 text-green-500" />
                Bolão Lotofácil
              </div>
              <p className="text-base leading-relaxed max-w-md">
                A infraestrutura mais robusta e segura do mercado para você jogar na loteria de forma estratégica e colaborativa.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold text-lg mb-4">Acesso Rápido</h4>
              <div className="space-y-3 font-medium">
                <Link to="/boloes" className="block hover:text-white transition-colors">Bolões Oficiais</Link>
                <Link to="/login" className="block hover:text-white transition-colors">Entrar ou Cadastrar</Link>
                <a href="#faq" className="block hover:text-white transition-colors">Perguntas Frequentes</a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold text-lg mb-4">Transparência</h4>
              <div className="space-y-3 font-medium">
                <p className="flex items-center gap-2"><CreditCard className="w-4 h-4"/> Mercado Pago</p>
                <Link to="/politica-de-privacidade" className="block hover:text-white transition-colors">Política de Privacidade</Link>
                <Link to="/termos-de-uso" className="block hover:text-white transition-colors">Termos de Uso</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm">Bolão Lotofácil &copy; {new Date().getFullYear()}. Todos os direitos reservados.</p>
            <p className="text-sm font-semibold text-gray-500">Jogue com absoluta responsabilidade. Para maiores de 18 anos.</p>
          </div>
        </div>
      </footer>

      <CookieBanner />
    </div>
  )
}
