import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Clover, CheckCircle, AlertCircle } from 'lucide-react'

export default function ConfirmarEmailPage() {
  const [confirmado, setConfirmado] = useState(false)

  useEffect(() => {
    // Supabase redireciona aqui com access_token no hash após confirmar email
    const hash = window.location.hash.substring(1)
    const params = new URLSearchParams(hash)
    const token = params.get('access_token')
    const type = params.get('type')
    // type=signup indica confirmação de email bem-sucedida
    setConfirmado(!!token && type === 'signup')
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-primary to-green-600 rounded-2xl shadow-lg">
          <Clover className="w-10 h-10 text-white" />
        </div>

        <div className="bg-card rounded-2xl border border-border p-8">
          {confirmado ? (
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-text">Email confirmado!</h1>
                <p className="text-text-muted text-sm mt-2">
                  Sua conta foi ativada com sucesso. Agora você já pode fazer login.
                </p>
              </div>
              <Link
                to="/login"
                className="inline-flex items-center justify-center w-full btn-gradient text-white font-bold py-3 px-4 rounded-xl no-underline text-sm"
              >
                Fazer login
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-yellow-600" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-text">Confirmação pendente</h1>
                <p className="text-text-muted text-sm mt-2">
                  Verifique seu email e clique no link de confirmação que enviamos.
                  Caso não encontre, verifique a caixa de spam.
                </p>
              </div>
              <Link
                to="/login"
                className="inline-block text-primary font-semibold hover:underline text-sm"
              >
                Voltar ao login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
