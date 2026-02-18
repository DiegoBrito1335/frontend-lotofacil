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

const bottomTabs = [
  { to: '/boloes', label: 'Início', icon: Home },
  { to: '/minhas-cotas', label: 'Cotas', icon: Ticket },
  { to: '/resultados', label: 'Resultados', icon: Trophy },
  { to: '/carteira', label: 'Carteira', icon: Wallet },
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
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl no-underline text-slate-900">
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
                    ? 'bg-green-50 text-green-700'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
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
                  className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg no-underline hover:bg-slate-100 transition-colors border border-slate-200"
                >
                  <User className="w-4 h-4 text-slate-500" />
                  <span className="text-sm text-slate-700">
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
                  className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm px-3 py-2 rounded-lg transition-colors cursor-pointer font-medium border border-slate-200"
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 text-sm px-3 py-2 rounded-lg no-underline transition-colors font-medium"
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

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden bg-transparent border-0 text-gray-700 cursor-pointer p-1"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {menuOpen && (
          <nav className="md:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium no-underline ${
                  location.pathname === to
                    ? 'bg-green-50 text-green-700'
                    : 'text-slate-600 hover:bg-slate-50'
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
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 no-underline"
                  >
                    <User className="w-4 h-4" />
                    {userName || 'Meu Perfil'}
                  </Link>
                  <button
                    type="button"
                    onClick={() => { logout(); setMenuOpen(false) }}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 w-full bg-transparent border-0 cursor-pointer"
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
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 no-underline hover:bg-slate-50"
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
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] rounded-t-2xl flex">
          {bottomTabs.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex-1 flex flex-col items-center justify-center py-3 gap-1 text-xs no-underline transition-colors ${
                location.pathname === to ? 'text-green-600 bg-green-50' : 'text-slate-400 hover:text-green-600'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      )}

      {/* Footer */}
      <footer className="border-t border-green-200 bg-bg/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clover className="w-4 h-4 text-primary" />
              <span className="font-semibold text-sm text-slate-700">Bolão Lotofácil</span>
            </div>
            <p className="text-xs text-slate-400">
              &copy; {new Date().getFullYear()} &mdash; Jogue com responsabilidade
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
