import { useState } from 'react'
import { pagamentoService } from '@/services/pagamentoService'
import type { PagamentoPix } from '@/types'
import { QrCode, Copy, Check, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function DepositarPage() {
  const navigate = useNavigate()
  const [valor, setValor] = useState('')
  const [loading, setLoading] = useState(false)
  const [pix, setPix] = useState<PagamentoPix | null>(null)
  const [error, setError] = useState('')
  const [copiado, setCopiado] = useState(false)

  const handleGerarPix = async (e: React.FormEvent) => {
    e.preventDefault()
    const valorNum = parseFloat(valor)

    if (!valorNum || valorNum < 1) {
      setError('Valor mínimo: R$ 1,00')
      return
    }
    if (valorNum > 10000) {
      setError('Valor máximo: R$ 10.000,00')
      return
    }

    try {
      setLoading(true)
      setError('')
      const resultado = await pagamentoService.criarPix({
        valor: valorNum,
        descricao: `Depósito de R$ ${valorNum.toFixed(2)}`,
      })
      setPix(resultado)
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } }
      setError(error.response?.data?.detail || 'Erro ao gerar Pix')
    } finally {
      setLoading(false)
    }
  }

  const copiarCodigoPix = async () => {
    if (pix?.qr_code) {
      await navigator.clipboard.writeText(pix.qr_code)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    }
  }

  return (
    <div className="max-w-lg mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-text-muted hover:text-text mb-4 bg-transparent border-0 cursor-pointer text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </button>

      <div className="bg-card rounded-2xl border border-border p-6 shadow-[0_10px_25px_rgba(0,0,0,0.06)]">
        <div className="flex items-center gap-2 mb-6">
          <QrCode className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-bold">Depositar via Pix</h1>
        </div>

        {!pix ? (
          <form onSubmit={handleGerarPix} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">
                Valor do depósito (R$)
              </label>
              <input
                type="number"
                step="0.01"
                min="1"
                max="10000"
                value={valor}
                onChange={(e) => { setValor(e.target.value); setError('') }}
                placeholder="0,00"
                className="w-full px-3 py-3 border border-border rounded-lg text-lg bg-bg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-center font-semibold"
              />
              {error && <p className="text-danger text-xs mt-1">{error}</p>}
            </div>

            {/* Valores rápidos */}
            <div className="flex gap-2">
              {[10, 25, 50, 100].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setValor(String(v))}
                  className="flex-1 py-2 text-sm font-semibold bg-white border border-border rounded-xl hover:border-primary hover:text-primary cursor-pointer transition-colors shadow-sm"
                >
                  R$ {v}
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 btn-gradient text-white font-semibold py-3 rounded-lg border-0 cursor-pointer"
            >
              <QrCode className="w-4 h-4" />
              {loading ? 'Gerando...' : 'Gerar QR Code Pix'}
            </button>
          </form>
        ) : (
          <div className="space-y-4 text-center">
            <div className="bg-green-100 text-green-800 p-3 rounded-lg text-sm ring-1 ring-green-200">
              Pix gerado com sucesso! Escaneie o QR Code ou copie o código.
            </div>

            {/* QR Code */}
            <div className="bg-white p-4 rounded-xl border border-border inline-block">
              {pix.qr_code_base64 ? (
                <img
                  src={`data:image/png;base64,${pix.qr_code_base64}`}
                  alt="QR Code Pix"
                  className="w-48 h-48"
                />
              ) : (
                <div className="w-48 h-48 bg-gray-100 flex items-center justify-center rounded-lg">
                  <QrCode className="w-16 h-16 text-text-muted" />
                </div>
              )}
            </div>

            <div className="text-2xl font-bold text-primary">
              R$ {Number(pix.valor).toFixed(2)}
            </div>

            {/* Código Pix para copiar */}
            <div className="bg-bg rounded-lg p-3">
              <p className="text-xs text-text-muted mb-2">Código Pix Copia e Cola</p>
              <div className="flex gap-2">
                <input
                  readOnly
                  value={pix.qr_code}
                  title="Código Pix"
                  aria-label="Código Pix copia e cola"
                  className="flex-1 px-3 py-2 text-xs bg-white border border-border rounded font-mono truncate"
                />
                <button
                  onClick={copiarCodigoPix}
                  className="flex items-center gap-1 px-3 py-2 bg-primary text-white text-xs rounded hover:bg-primary-dark transition-colors border-0 cursor-pointer"
                >
                  {copiado ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copiado ? 'Copiado!' : 'Copiar'}
                </button>
              </div>
            </div>

            <p className="text-xs text-text-muted">
              Expira em: {new Date(pix.expira_em).toLocaleString('pt-BR')}
            </p>

            <button
              onClick={() => setPix(null)}
              className="text-primary hover:underline bg-transparent border-0 cursor-pointer text-sm"
            >
              Gerar novo Pix
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
