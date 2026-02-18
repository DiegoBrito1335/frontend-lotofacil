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
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { carteiraService } from '@/services/carteiraService'

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

const adminNav = { to: '/admin', label: 'Admin', icon: Shield }

export default function Layout() {
  const { isAuthenticated, isAdmin, userName, logout } = useAuth()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
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

  const navItems = isAuthenticated
    ? (isAdmin ? [...authNav, adminNav] : authNav)
    : publicNav

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-[#031a0d]/95 backdrop-blur-md border-b border-emerald-900/40 text-white sticky top-0 z-50 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl no-underline text-white">
            <Clover className="w-7 h-7 text-primary" />
            <span>Bolão Lotofácil</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium no-underline transition-colors ${
                  location.pathname === to
                    ? 'bg-white/15 text-white'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
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
                  className="flex items-center gap-2 bg-white/8 px-3 py-1.5 rounded-lg no-underline hover:bg-white/15 transition-colors border border-white/10"
                >
                  <User className="w-4 h-4 text-white/60" />
                  <span className="text-sm text-white/75">
                    {userName || 'Usuário'}
                  </span>
                </Link>
                <Link
                  to="/carteira"
                  className="flex items-center gap-1.5 bg-yellow-400 text-green-900 px-3 py-1.5 rounded-lg text-sm font-bold no-underline hover:bg-yellow-300 transition-colors shadow-[0_0_15px_rgba(250,204,21,0.25)]"
                >
                  <Wallet className="w-4 h-4" />
                  R$ {saldo.toFixed(2).replace('.', ',')}
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 bg-white/8 hover:bg-white/15 text-white text-sm px-3 py-2 rounded-lg transition-colors border-0 cursor-pointer font-medium border border-white/10"
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 text-white/70 hover:text-white text-sm px-3 py-2 rounded-lg no-underline transition-colors font-medium"
                >
                  <LogIn className="w-4 h-4" />
                  Entrar
                </Link>
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 bg-yellow-400 text-green-900 font-bold text-sm px-5 py-2 rounded-lg no-underline hover:bg-yellow-300 transition-colors shadow-[0_0_15px_rgba(250,204,21,0.2)]"
                >
                  Criar Conta
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden bg-transparent border-0 text-white cursor-pointer p-1"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {menuOpen && (
          <nav className="md:hidden border-t border-white/10 bg-[#022c22]/98 px-4 py-3 space-y-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium no-underline ${
                  location.pathname === to
                    ? 'bg-white/15 text-white'
                    : 'text-white/70 hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}

            <div className="border-t border-white/10 mt-2 pt-2">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/carteira"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 mx-3 mb-2 px-3 py-2 bg-yellow-400 text-green-900 rounded-lg text-sm font-bold no-underline hover:bg-yellow-300 transition-colors"
                  >
                    <Wallet className="w-4 h-4" />
                    Saldo: R$ {saldo.toFixed(2).replace('.', ',')}
                  </Link>
                  <Link
                    to="/perfil"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:bg-white/10 no-underline"
                  >
                    <User className="w-4 h-4" />
                    {userName || 'Meu Perfil'}
                  </Link>
                  <button
                    onClick={() => { logout(); setMenuOpen(false) }}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:bg-white/10 w-full bg-transparent border-0 cursor-pointer"
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
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-white no-underline hover:bg-white/10"
                  >
                    <LogIn className="w-4 h-4" />
                    Entrar
                  </Link>
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center gap-2 mx-3 mt-2 py-2.5 rounded-lg text-sm font-bold bg-yellow-400 text-green-900 no-underline hover:bg-yellow-300 transition-colors"
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
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-emerald-900/40 bg-[#031a0d]/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clover className="w-4 h-4 text-primary" />
              <span className="font-semibold text-sm text-white/80">Bolão Lotofácil</span>
            </div>
            <p className="text-xs text-white/40">
              &copy; {new Date().getFullYear()} &mdash; Jogue com responsabilidade
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
