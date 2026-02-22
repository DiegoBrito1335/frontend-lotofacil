import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '@/services/api'
import { Clover, Lock, ArrowLeft, CheckCircle, Eye, EyeOff, AlertCircle } from 'lucide-react'

export default function ResetPasswordPage() {
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [tokenInvalido, setTokenInvalido] = useState(false)
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [showSenha, setShowSenha] = useState(false)
  const [loading, setLoading] = useState(false)
  const [sucesso, setSucesso] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    // Supabase redireciona com token no hash da URL
    // Ex: /redefinir-senha#access_token=xxx&type=recovery
    const hash = window.location.hash.substring(1)
    const params = new URLSearchParams(hash)
    const token = params.get('access_token')
    const type = params.get('type')

    if (!token || type !== 'recovery') {
      setTokenInvalido(true)
    } else {
      setAccessToken(token)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!novaSenha || novaSenha.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres')
      return
    }
    if (novaSenha !== confirmarSenha) {
      setError('As senhas não coincidem')
      return
    }

    try {
      setLoading(true)
      setError('')
      await api.post('/auth/reset-password', {
        access_token: accessToken,
        nova_senha: novaSenha,
      })
      setSucesso(true)
      setTimeout(() => navigate('/login'), 3000)
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } }
      setError(error.response?.data?.detail || 'Erro ao redefinir senha')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="p-4">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-text-muted hover:text-text no-underline text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao login
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 pb-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-primary to-green-600 rounded-2xl mb-4 shadow-lg">
              <Clover className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-text">Nova senha</h1>
            <p className="text-text-muted mt-2 text-sm">
              Escolha uma nova senha para sua conta
            </p>
          </div>

          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="p-6">
              {tokenInvalido ? (
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                      <AlertCircle className="w-8 h-8 text-red-600" />
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-text">Link inválido ou expirado</p>
                    <p className="text-text-muted text-sm mt-1">
                      Este link de recuperação não é válido ou já expirou.
                      Solicite um novo link de recuperação.
                    </p>
                  </div>
                  <Link
                    to="/esqueceu-senha"
                    className="inline-block text-primary font-semibold hover:underline text-sm"
                  >
                    Solicitar novo link
                  </Link>
                </div>
              ) : sucesso ? (
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-text">Senha redefinida!</p>
                    <p className="text-text-muted text-sm mt-1">
                      Sua senha foi atualizada com sucesso. Redirecionando para o login...
                    </p>
                  </div>
                  <Link
                    to="/login"
                    className="inline-block text-primary font-semibold hover:underline text-sm"
                  >
                    Ir para o login
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-text mb-1.5">
                      Nova senha
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                      <input
                        type={showSenha ? 'text' : 'password'}
                        value={novaSenha}
                        onChange={(e) => { setNovaSenha(e.target.value); setError('') }}
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

                  <div>
                    <label className="block text-sm font-semibold text-text mb-1.5">
                      Confirmar nova senha
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                      <input
                        type={showSenha ? 'text' : 'password'}
                        value={confirmarSenha}
                        onChange={(e) => { setConfirmarSenha(e.target.value); setError('') }}
                        placeholder="Repita a senha"
                        className="w-full pl-10 pr-3 py-3 border border-border rounded-xl text-sm bg-gray-50 text-text placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 btn-gradient text-white font-bold py-3 px-4 rounded-xl border-0 cursor-pointer text-sm"
                  >
                    <Lock className="w-4 h-4" />
                    {loading ? 'Salvando...' : 'Salvar nova senha'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
