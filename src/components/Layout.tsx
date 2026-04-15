import { Link, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import {
  Home,
  Ticket,
  Wallet,
  QrCode,
  Shield,
  LogIn,
  LogOut,
  Clover,
  Menu,
  X,
  User,
  Trophy,
  BookOpen,
  FileText,
  Sun,
  Moon,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useTheme } from '@/context/ThemeContext'
import { carteiraService } from '@/services/carteiraService'
import CookieBanner from '@/components/CookieBanner'
import InstallPWA from '@/components/ui/InstallPWA'

const publicNav = [
  { to: '/boloes', label: 'Bolões', icon: Ticket },
  { to: '/como-jogar', label: 'Como Jogar', icon: BookOpen },
  { to: '/regras', label: 'Regras', icon: FileText },
]

const authNav = [
  { to: '/boloes', label: 'Bolões', icon: Home },
  { to: '/minhas-cotas', label: 'Minhas Cotas', icon: Ticket },
  { to: '/resultados', label: 'Resultados', icon: Trophy },
  { to: '/carteira', label: 'Carteira', icon: Wallet },
  { to: '/depositar', label: 'Depositar', icon: QrCode },
  { to: '/como-jogar', label: 'Como Jogar', icon: BookOpen },
  { to: '/regras', label: 'Regras', icon: FileText },
]

const bottomTabs = [
  { to: '/boloes', label: 'Início', icon: Home },
  { to: '/minhas-cotas', label: 'Cotas', icon: Ticket },
  { to: '/resultados', label: 'Resultados', icon: Trophy },
  { to: '/carteira', label: 'Carteira', icon: Wallet },
]

const adminNav = { to: '/admin', label: 'Admin', icon: Shield }

export default function Layout() {
  const { isAuthenticated, isAdmin, userName, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [saldo, setSaldo] = useState<number>(0)

  useEffect(() => {
    if (isAuthenticated) {
      carteiraService.getSaldo().then((data) => {
        setSaldo(Number(data.saldo_disponivel) || 0)
      }).catch(() => {
        setSaldo(0)
      })
    }
  }, [isAuthenticated, location.pathname])
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = isAuthenticated
    ? (isAdmin ? [...authNav, adminNav] : authNav)
    : publicNav

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className={`sticky top-0 z-40 glass-header ${scrolled ? 'glass-header-scrolled' : ''}`}>
        <div className={`max-w-7xl mx-auto px-4 flex items-center justify-between transition-all duration-300 ${scrolled ? 'py-2' : 'py-4'}`}>
          <Link to="/" className="flex items-center gap-2 font-bold text-xl no-underline text-text group">
            <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-xl group-hover:bg-green-200 transition-colors">
              <Clover className="w-7 h-7 text-primary" />
            </div>
            <span className="tracking-tight text-text">Bolão <span className="text-primary">Lotofácil</span></span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium no-underline transition-colors ${
                  location.pathname === to
                    ? 'bg-primary/10 text-primary'
                    : 'text-text-muted hover:bg-bg hover:text-text'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/perfil"
                  className="flex items-center gap-2 bg-bg px-3 py-1.5 rounded-lg no-underline hover:bg-card transition-colors border border-border"
                >
                  <User className="w-4 h-4 text-text-muted" />
                  <span className="text-sm text-text">
                    {userName || 'Usuário'}
                  </span>
                </Link>
                <Link
                  to="/carteira"
                  className="flex items-center gap-1.5 bg-primary text-white px-3 py-1.5 rounded-lg text-sm font-bold no-underline hover:bg-primary-dark transition-colors shadow-sm"
                >
                  <Wallet className="w-4 h-4" />
                  R$ {saldo.toFixed(2).replace('.', ',')}
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="flex items-center gap-1.5 bg-bg hover:bg-card text-text text-sm px-3 py-2 rounded-lg transition-colors cursor-pointer font-medium border border-border"
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 text-text-muted hover:text-text text-sm px-3 py-2 rounded-lg no-underline transition-colors font-medium"
                >
                  <LogIn className="w-4 h-4" />
                  Entrar
                </Link>
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 btn-gradient text-white font-bold text-sm px-5 py-2 rounded-lg no-underline"
                >
                  Criar Conta
                </Link>
              </div>
            )}

            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-card text-text-muted hover:text-primary transition-all border border-border cursor-pointer shadow-sm"
              title={theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            <InstallPWA />

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden bg-transparent border-0 text-text cursor-pointer p-1"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {menuOpen && (
          <nav className="md:hidden border-t border-slate-100 dark:border-slate-800 bg-card px-4 py-3 space-y-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium no-underline ${
                  location.pathname === to
                    ? 'bg-primary/10 text-primary'
                    : 'text-text-muted hover:bg-bg'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}

            <div className="border-t border-slate-100 mt-2 pt-2">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/carteira"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 mx-3 mb-2 px-3 py-2 bg-primary text-white rounded-lg text-sm font-bold no-underline hover:bg-primary-dark transition-colors"
                  >
                    <Wallet className="w-4 h-4" />
                    Saldo: R$ {saldo.toFixed(2).replace('.', ',')}
                  </Link>
                  <Link
                    to="/perfil"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-text-muted hover:bg-bg no-underline"
                  >
                    <User className="w-4 h-4" />
                    {userName || 'Meu Perfil'}
                  </Link>
                  <button
                    type="button"
                    onClick={() => { logout(); setMenuOpen(false) }}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-text-muted hover:bg-bg w-full bg-transparent border-0 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Sair
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-text-muted no-underline hover:bg-bg"
                  >
                    <LogIn className="w-4 h-4" />
                    Entrar
                  </Link>
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center gap-2 mx-3 mt-2 py-2.5 rounded-lg text-sm font-bold btn-gradient text-white no-underline"
                  >
                    Criar Conta Grátis
                  </Link>
                </>
              )}
            </div>
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className={`flex-1 max-w-7xl w-full mx-auto px-4 py-6 ${isAuthenticated ? 'pb-24 md:pb-6' : ''}`}>
        <Outlet />
      </main>

      {/* Mobile Bottom Navbar */}
      {isAuthenticated && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border shadow-[0_-4px_20px_rgba(0,0,0,0.05)] rounded-t-2xl flex">
          {bottomTabs.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex-1 flex flex-col items-center justify-center py-3 gap-1 text-xs no-underline transition-colors ${
                location.pathname === to ? 'text-primary bg-primary/10' : 'text-text-muted/60 hover:text-primary'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      )}

      {/* Footer */}
      <footer className="border-t border-border bg-card backdrop-blur-md mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center border-b border-border pb-8 mb-8">
            <div className="space-y-3">
              <Link to="/" className="flex items-center gap-2 font-bold text-xl no-underline text-text">
                <Clover className="w-6 h-6 text-primary" />
                <span>Bolão Lotofácil</span>
              </Link>
              <p className="text-sm text-text-muted leading-relaxed">
                A plataforma mais segura e transparente para você participar de bolões da Lotofácil.
              </p>
            </div>
            
            <div className="flex flex-col md:items-center gap-4">
              <h4 className="text-sm font-bold text-text uppercase tracking-widest">Links rápidos</h4>
              <div className="flex gap-4">
                <Link to="/como-jogar" className="text-sm text-text-muted hover:text-primary no-underline transition-colors">Ajuda</Link>
                <Link to="/regras" className="text-sm text-text-muted hover:text-primary no-underline transition-colors">Regras</Link>
                <Link to="/resultados" className="text-sm text-text-muted hover:text-primary no-underline transition-colors">Resultados</Link>
              </div>
            </div>

            <div className="flex flex-col md:items-end gap-3 text-text-muted">
              <div className="flex gap-4 text-xs">
                <Link to="/politica-de-privacidade" className="hover:text-primary transition-colors no-underline">
                  Privacidade
                </Link>
                <Link to="/termos-de-uso" className="hover:text-primary transition-colors no-underline">
                  Termos
                </Link>
              </div>
              <p className="text-xs text-text-muted">
                &copy; {new Date().getFullYear()} &mdash; Jogue com responsabilidade.
              </p>
            </div>
          </div>
          
          <div className="flex justify-center">
            <span className="text-[10px] text-text-muted/40 uppercase tracking-[0.2em]">Sorte é o que acontece quando a preparação encontra a oportunidade</span>
          </div>
        </div>
      </footer>

      <CookieBanner />
    </div>
  )
}
