import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
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
} from 'lucide-react'
import { useState } from 'react'

export default function LandingPage() {
  const { isAuthenticated } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen">
      {/* ===== HEADER / NAVBAR ===== */}
      <header className="absolute top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl no-underline text-white">
            <Clover className="w-7 h-7" />
            <span>Bolão Lotofácil</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#como-funciona" className="text-white/80 hover:text-white text-sm font-medium no-underline transition-colors">
              Como Funciona
            </a>
            <a href="#vantagens" className="text-white/80 hover:text-white text-sm font-medium no-underline transition-colors">
              Vantagens
            </a>
            <Link to="/boloes" className="flex items-center gap-1.5 text-white/80 hover:text-white text-sm font-medium no-underline transition-colors">
              <Ticket className="w-4 h-4" />
              Bolões
            </Link>
          </nav>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                to="/boloes"
                className="flex items-center gap-2 bg-yellow-400 text-green-900 font-bold text-sm px-5 py-2.5 rounded-lg no-underline hover:bg-yellow-300 transition-all shadow-[0_0_15px_rgba(250,204,21,0.2)]"
              >
                <Ticket className="w-4 h-4" />
                Meus Bolões
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 text-white/80 hover:text-white text-sm font-medium no-underline transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  Entrar
                </Link>
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 bg-yellow-400 text-green-900 font-bold text-sm px-5 py-2.5 rounded-lg no-underline hover:bg-yellow-300 transition-all shadow-[0_0_15px_rgba(250,204,21,0.2)]"
                >
                  Criar Conta
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden bg-transparent border-0 text-white cursor-pointer p-1"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {menuOpen && (
          <div className="md:hidden bg-[#022c22]/97 backdrop-blur-md border-t border-white/10 px-4 py-4 space-y-2">
            <a href="#como-funciona" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-white/80 hover:text-white text-sm no-underline rounded-lg hover:bg-white/10">
              Como Funciona
            </a>
            <a href="#vantagens" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-white/80 hover:text-white text-sm no-underline rounded-lg hover:bg-white/10">
              Vantagens
            </a>
            <Link to="/boloes" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-white/80 hover:text-white text-sm no-underline rounded-lg hover:bg-white/10">
              Bolões
            </Link>
            <div className="border-t border-white/10 pt-2 mt-2 space-y-2">
              <Link to="/login" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-white text-sm no-underline rounded-lg hover:bg-white/10">
                Entrar
              </Link>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="block px-3 py-2.5 text-center text-green-900 bg-yellow-400 font-bold text-sm no-underline rounded-lg hover:bg-yellow-300 transition-colors">
                Criar Conta Grátis
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ===== HERO SECTION ===== */}
      <section className="relative bg-linear-to-br from-green-800 via-green-700 to-primary text-white overflow-hidden">
        {/* Background circles */}
        <div className="absolute inset-0 opacity-[0.07]">
          <div className="absolute top-20 left-[10%] w-40 h-40 border-2 border-white rounded-full" />
          <div className="absolute top-32 right-[15%] w-28 h-28 border-2 border-white rounded-full" />
          <div className="absolute bottom-32 left-[30%] w-20 h-20 border-2 border-white rounded-full" />
          <div className="absolute bottom-16 right-[25%] w-48 h-48 border-2 border-white rounded-full" />
          <div className="absolute top-1/2 left-[5%] w-12 h-12 border-2 border-white rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-4 pt-32 pb-28 md:pt-40 md:pb-36 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full mb-8">
              <Star className="w-4 h-4 text-yellow-300" />
              <span className="text-sm font-medium">Plataforma 100% Segura e Transparente</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-[1.1]">
              Multiplique suas chances de{' '}
              <span className="text-yellow-300">ganhar na Lotofácil</span>
            </h1>

            <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
              Participe de bolões compartilhados com dezenas selecionadas.
              Aposte menos, ganhe mais!
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to={isAuthenticated ? '/boloes' : '/login'}
                className="flex items-center gap-2 bg-yellow-400 text-green-900 font-bold text-lg px-8 py-4 rounded-xl no-underline hover:bg-yellow-300 transition-all shadow-lg hover:shadow-xl"
              >
                <Ticket className="w-5 h-5" />
                {isAuthenticated ? 'Ver Bolões Disponíveis' : 'Começar Agora'}
                <ArrowRight className="w-5 h-5" />
              </Link>
              {!isAuthenticated && (
                <Link
                  to="/boloes"
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white font-semibold text-lg px-8 py-4 rounded-xl no-underline hover:bg-white/20 transition-all border border-white/25"
                >
                  Ver Bolões
                </Link>
              )}
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 mt-14 text-white/70 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-300" />
                <span>100% Transparente</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-300" />
                <span>Pagamento via Pix</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-300" />
                <span>Compra Instantânea</span>
              </div>
            </div>
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 50L60 45C120 40 240 30 360 35C480 40 600 60 720 65C840 70 960 60 1080 50C1200 40 1320 30 1380 25L1440 20V100H1380C1320 100 1200 100 1080 100C960 100 840 100 720 100C600 100 480 100 360 100C240 100 120 100 60 100H0V50Z" fill="#f0fdf4"/>
          </svg>
        </div>
      </section>

      {/* ===== COMO FUNCIONA ===== */}
      <section id="como-funciona" className="py-20 bg-bg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold text-text mb-3">Como Funciona?</h2>
            <p className="text-text-muted text-lg max-w-xl mx-auto">Em apenas 3 passos simples você já está participando</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: '1',
                icon: Wallet,
                title: 'Deposite seu saldo',
                desc: 'Adicione créditos à sua carteira via Pix de forma rápida e segura. O saldo é creditado instantaneamente.',
                color: 'bg-blue-500/10 text-blue-400',
              },
              {
                step: '2',
                icon: Ticket,
                title: 'Escolha seu bolão',
                desc: 'Navegue pelos bolões disponíveis, veja os jogos e escolha quantas cotas quiser comprar.',
                color: 'bg-green-500/10 text-green-400',
              },
              {
                step: '3',
                icon: TrendingUp,
                title: 'Acompanhe e ganhe',
                desc: 'Acompanhe seus bolões, confira os resultados e receba seus prêmios diretamente na carteira.',
                color: 'bg-yellow-500/10 text-yellow-400',
              },
            ].map((item) => (
              <div key={item.step} className="relative bg-card border border-border p-8 text-center card-hover">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm shadow">
                  {item.step}
                </div>
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${item.color} mb-5 mt-2`}>
                  <item.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-text mb-2">{item.title}</h3>
                <p className="text-text-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== VANTAGENS ===== */}
      <section id="vantagens" className="py-20 bg-card border-t border-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold text-text mb-3">Por que usar nossa plataforma?</h2>
            <p className="text-text-muted text-lg max-w-xl mx-auto">Tudo o que você precisa para jogar na Lotofácil em grupo</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Shield,
                title: 'Segurança Total',
                desc: 'Seus dados e transações protegidos. Infraestrutura robusta no Supabase.',
                color: 'text-blue-400 bg-blue-500/10',
              },
              {
                icon: QrCode,
                title: 'Pix Instantâneo',
                desc: 'Deposite e receba via Pix integrado ao Mercado Pago. Rápido e sem taxas.',
                color: 'text-green-400 bg-green-500/10',
              },
              {
                icon: Users,
                title: 'Jogue em Grupo',
                desc: 'Aumente suas chances jogando em grupo com mais dezenas por menos.',
                color: 'text-purple-400 bg-purple-500/10',
              },
              {
                icon: TrendingUp,
                title: 'Transparência Total',
                desc: 'Veja todos os jogos, dezenas e acompanhe cada centavo em tempo real.',
                color: 'text-yellow-400 bg-yellow-500/10',
              },
            ].map((feat) => (
              <div key={feat.title} className="bg-card border border-border p-6 card-hover">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${feat.color} mb-4`}>
                  <feat.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-text mb-1">{feat.title}</h3>
                <p className="text-text-muted text-sm leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA FINAL ===== */}
      <section className="py-20 bg-linear-to-r from-green-800 to-primary text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Clover className="w-14 h-14 mx-auto mb-5 text-yellow-300" />
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            Pronto para tentar a sorte?
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-lg mx-auto">
            Entre agora e participe dos melhores bolões da Lotofácil.
            Sua próxima grande vitória pode estar a um clique de distância!
          </p>
          <Link
            to={isAuthenticated ? '/boloes' : '/login'}
            className="inline-flex items-center gap-2 bg-yellow-400 text-green-900 font-bold text-lg px-8 py-4 rounded-xl no-underline hover:bg-yellow-300 transition-all shadow-lg hover:shadow-xl"
          >
            {isAuthenticated ? 'Ver Bolões' : 'Criar Conta Grátis'}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-gray-900 text-white/60 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 text-white font-bold text-lg mb-3">
                <Clover className="w-6 h-6 text-green-400" />
                Bolão Lotofácil
              </div>
              <p className="text-sm leading-relaxed">
                A melhor plataforma para participar de bolões da Lotofácil.
                Jogue em grupo e aumente suas chances!
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Links Rápidos</h4>
              <div className="space-y-2 text-sm">
                <Link to="/boloes" className="block text-white/60 hover:text-white no-underline transition-colors">Bolões Disponíveis</Link>
                <Link to="/login" className="block text-white/60 hover:text-white no-underline transition-colors">Entrar / Cadastrar</Link>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Informações</h4>
              <div className="space-y-2 text-sm">
                <p>Pagamentos via Pix (Mercado Pago)</p>
                <p>Suporte por e-mail</p>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 text-center text-sm">
            Bolão Lotofácil &copy; {new Date().getFullYear()} &mdash; Jogue com responsabilidade.
          </div>
        </div>
      </footer>
    </div>
  )
}
