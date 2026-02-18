import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import api from '@/services/api'
import {
  Clover,
  LogIn,
  UserPlus,
  ArrowLeft,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  CheckCircle,
} from 'lucide-react'

type Tab = 'login' | 'registro'

export default function LoginPage() {
  const [tab, setTab] = useState<Tab>('login')
  const [email, setEmail] = useState('')
  const [nome, setNome] = useState('')
  const [senha, setSenha] = useState('')
  const [showSenha, setShowSenha] = useState(false)
  const [error, setError] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      setError('Informe seu e-mail')
      return
    }
    if (!senha) {
      setError('Informe sua senha')
      return
    }

    try {
      setLoading(true)
      setError('')
      const { data } = await api.post('/auth/login', { email: email.trim(), senha })
      login(data.id, data.email, data.is_admin, data.nome)
      navigate('/boloes')
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } }
      setError(error.response?.data?.detail || 'Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  const handleRegistro = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nome || !email || !senha) {
      setError('Preencha todos os campos')
      return
    }
    if (senha.length < 6) {
      setError('Senha deve ter no mínimo 6 caracteres')
      return
    }

    try {
      setLoading(true)
      setError('')
      const { data } = await api.post('/auth/register', { nome, email, senha })
      setSucesso(data.mensagem)
      // Auto-login após 1.5 segundos
      setTimeout(() => {
        login(data.id, data.email, data.is_admin, data.nome)
        navigate('/boloes')
      }, 1500)
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } }
      setError(error.response?.data?.detail || 'Erro ao criar conta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Mini header */}
      <div className="p-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-text-muted hover:text-text no-underline text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao início
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 pb-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-primary to-green-600 rounded-2xl mb-4 shadow-lg">
              <Clover className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold text-text">Bolão Lotofácil</h1>
            <p className="text-text-muted mt-2">
              {tab === 'login' ? 'Entre na sua conta para continuar' : 'Crie sua conta gratuita'}
            </p>
          </div>

          {/* Card */}
          <div className="bg-card rounded-2xl border border-border overflow-hidden card-hover">
            {/* Tabs */}
            <div className="flex border-b border-border">
              <button
                onClick={() => { setTab('login'); setError(''); setSucesso('') }}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-semibold border-0 cursor-pointer transition-colors ${
                  tab === 'login'
                    ? 'bg-card text-primary border-b-2 border-primary'
                    : 'bg-gray-100 text-gray-500 hover:text-gray-700'
                }`}
              >
                <LogIn className="w-4 h-4" />
                Entrar
              </button>
              <button
                onClick={() => { setTab('registro'); setError(''); setSucesso('') }}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-semibold border-0 cursor-pointer transition-colors ${
                  tab === 'registro'
                    ? 'bg-card text-primary border-b-2 border-primary'
                    : 'bg-gray-100 text-gray-500 hover:text-gray-700'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                Criar Conta
              </button>
            </div>

            <div className="p-6">
              {/* Mensagem de sucesso */}
              {sucesso && (
                <div className="flex items-start gap-2 bg-green-50 border border-green-200 text-green-800 p-3 rounded-lg text-sm mb-4">
                  <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{sucesso}</span>
                </div>
              )}

              {/* Mensagem de erro */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm mb-4">
                  {error}
                </div>
              )}

              {tab === 'login' ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label htmlFor="loginEmail" className="block text-sm font-semibold text-text mb-1.5">
                      E-mail
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                      <input
                        id="loginEmail"
                        type="email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setError('') }}
                        placeholder="seu@email.com"
                        className="w-full pl-10 pr-3 py-3 border border-border rounded-xl text-sm bg-gray-50 text-text placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="loginSenha" className="block text-sm font-semibold text-text mb-1.5">
                      Senha
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                      <input
                        id="loginSenha"
                        type={showSenha ? 'text' : 'password'}
                        value={senha}
                        onChange={(e) => { setSenha(e.target.value); setError('') }}
                        placeholder="Sua senha"
                        className="w-full pl-10 pr-10 py-3 border border-border rounded-xl text-sm bg-gray-50 text-text placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSenha(!showSenha)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text bg-transparent border-0 cursor-pointer p-0"
                      >
                        {showSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 btn-gradient text-white font-bold py-3 px-4 rounded-xl border-0 cursor-pointer text-sm"
                  >
                    <LogIn className="w-4 h-4" />
                    {loading ? 'Entrando...' : 'Entrar'}
                  </button>

                  <p className="text-center text-sm text-text-muted">
                    Não tem conta?{' '}
                    <button
                      type="button"
                      onClick={() => setTab('registro')}
                      className="text-primary font-semibold hover:underline bg-transparent border-0 cursor-pointer"
                    >
                      Criar conta grátis
                    </button>
                  </p>
                </form>
              ) : (
                <form onSubmit={handleRegistro} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-text mb-1.5">
                      Nome completo
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                      <input
                        type="text"
                        value={nome}
                        onChange={(e) => { setNome(e.target.value); setError('') }}
                        placeholder="Seu nome"
                        className="w-full pl-10 pr-3 py-3 border border-border rounded-xl text-sm bg-gray-50 text-text placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-text mb-1.5">
                      E-mail
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setError('') }}
                        placeholder="seu@email.com"
                        className="w-full pl-10 pr-3 py-3 border border-border rounded-xl text-sm bg-gray-50 text-text placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-text mb-1.5">
                      Senha
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                      <input
                        type={showSenha ? 'text' : 'password'}
                        value={senha}
                        onChange={(e) => { setSenha(e.target.value); setError('') }}
                        placeholder="Mínimo 6 caracteres"
                        className="w-full pl-10 pr-10 py-3 border border-border rounded-xl text-sm bg-gray-50 text-text placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSenha(!showSenha)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text bg-transparent border-0 cursor-pointer p-0"
                      >
                        {showSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 btn-gradient text-white font-bold py-3 px-4 rounded-xl border-0 cursor-pointer text-sm"
                  >
                    <UserPlus className="w-4 h-4" />
                    {loading ? 'Criando conta...' : 'Criar Conta'}
                  </button>

                  <p className="text-center text-sm text-text-muted">
                    Já tem conta?{' '}
                    <button
                      type="button"
                      onClick={() => setTab('login')}
                      className="text-primary font-semibold hover:underline bg-transparent border-0 cursor-pointer"
                    >
                      Faça login
                    </button>
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
