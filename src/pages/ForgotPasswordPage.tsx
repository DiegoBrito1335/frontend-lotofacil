import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '@/services/api'
import { Clover, Mail, ArrowLeft, CheckCircle, Send } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) {
      setError('Informe seu e-mail')
      return
    }

    try {
      setLoading(true)
      setError('')
      await api.post('/auth/forgot-password', { email: email.trim() })
      setEnviado(true)
    } catch {
      setError('Erro ao enviar email. Tente novamente.')
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
            <h1 className="text-2xl font-extrabold text-text">Recuperar senha</h1>
            <p className="text-text-muted mt-2 text-sm">
              Informe seu email e enviaremos um link para redefinir sua senha
            </p>
          </div>

          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="p-6">
              {enviado ? (
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-text">Email enviado!</p>
                    <p className="text-text-muted text-sm mt-1">
                      Se o email <strong>{email}</strong> estiver cadastrado, você receberá um link
                      de recuperação em instantes.
                    </p>
                    <p className="text-text-muted text-sm mt-2">
                      Verifique também sua caixa de spam.
                    </p>
                  </div>
                  <Link
                    to="/login"
                    className="inline-block text-primary font-semibold hover:underline text-sm"
                  >
                    Voltar ao login
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

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 btn-gradient text-white font-bold py-3 px-4 rounded-xl border-0 cursor-pointer text-sm"
                  >
                    <Send className="w-4 h-4" />
                    {loading ? 'Enviando...' : 'Enviar link de recuperação'}
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
