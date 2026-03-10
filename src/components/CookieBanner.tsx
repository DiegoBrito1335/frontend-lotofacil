import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Cookie, X } from 'lucide-react'

export default function CookieBanner() {
  const [visible, setVisible] = useState<boolean>(() => {
    return !localStorage.getItem('cookie_consent')
  })

  if (!visible) return null

  const handleAceitar = () => {
    localStorage.setItem('cookie_consent', 'accepted')
    setVisible(false)
  }

  const handleEssenciais = () => {
    localStorage.setItem('cookie_consent', 'essential')
    setVisible(false)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900 text-white border-t border-slate-700">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <Cookie className="w-5 h-5 text-green-400 shrink-0 mt-0.5 sm:mt-0" />
        <p className="text-sm text-slate-300 flex-1">
          Usamos cookies essenciais para autenticação e monitoramento de erros sem dados pessoais (Sentry).{' '}
          <Link
            to="/politica-de-privacidade"
            className="text-green-400 hover:text-green-300 underline"
          >
            Política de Privacidade
          </Link>
          .
        </p>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleEssenciais}
            className="text-xs px-3 py-1.5 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer bg-transparent"
          >
            Apenas Essenciais
          </button>
          <button
            onClick={handleAceitar}
            className="text-xs px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-500 text-white font-semibold transition-colors cursor-pointer border-0"
          >
            Aceitar Todos
          </button>
          <button
            onClick={handleEssenciais}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer bg-transparent border-0 p-1"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
