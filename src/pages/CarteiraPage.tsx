import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { carteiraService } from '@/services/carteiraService'
import type { CarteiraResumo, Transacao } from '@/types'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { Wallet, ArrowUpCircle, ArrowDownCircle, QrCode, Lock } from 'lucide-react'

export default function CarteiraPage() {
  const [saldo, setSaldo] = useState<CarteiraResumo | null>(null)
  const [transacoes, setTransacoes] = useState<Transacao[]>([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState<string | undefined>(undefined)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    loadTransacoes()
  }, [filtro])

  const loadData = async () => {
    try {
      setLoading(true)
      const [saldoData, transacoesData] = await Promise.allSettled([
        carteiraService.getSaldo(),
        carteiraService.getTransacoes(),
      ])
      if (saldoData.status === 'fulfilled') {
        setSaldo(saldoData.value)
      }
      if (transacoesData.status === 'fulfilled') {
        setTransacoes(transacoesData.value)
      }
    } catch {
      // silently handle
    } finally {
      setLoading(false)
    }
  }

  const loadTransacoes = async () => {
    try {
      const data = await carteiraService.getTransacoes(filtro)
      setTransacoes(data)
    } catch {
      // silently handle
    }
  }

  if (loading) return <LoadingSpinner text="Carregando carteira..." />

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text">Carteira</h1>
          <p className="text-text-muted text-sm mt-1">Gerencie seu saldo e transações</p>
        </div>
        <Link
          to="/depositar"
          className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold text-sm px-4 py-2.5 rounded-lg no-underline transition-colors"
        >
          <QrCode className="w-4 h-4" />
          Depositar via Pix
        </Link>
      </div>

      {/* Saldos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-2 text-text-muted text-sm mb-1">
            <Wallet className="w-4 h-4" />
            Saldo Disponível
          </div>
          <p className="text-2xl font-bold text-primary">
            R$ {saldo ? Number(saldo.saldo_disponivel).toFixed(2) : '0.00'}
          </p>
        </div>
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-2 text-text-muted text-sm mb-1">
            <Lock className="w-4 h-4" />
            Saldo Bloqueado
          </div>
          <p className="text-2xl font-bold text-accent">
            R$ {saldo ? Number(saldo.saldo_bloqueado).toFixed(2) : '0.00'}
          </p>
        </div>
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-2 text-text-muted text-sm mb-1">
            <Wallet className="w-4 h-4" />
            Saldo Total
          </div>
          <p className="text-2xl font-bold">
            R$ {saldo ? Number(saldo.saldo_total).toFixed(2) : '0.00'}
          </p>
        </div>
      </div>

      {/* Transações */}
      <div className="bg-card rounded-xl border border-border p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg">Transações</h2>
          <div className="flex gap-1">
            {[
              { label: 'Todas', value: undefined },
              { label: 'Créditos', value: 'credito' },
              { label: 'Débitos', value: 'debito' },
            ].map((f) => (
              <button
                key={f.label}
                onClick={() => setFiltro(f.value)}
                className={`px-3 py-1 text-xs rounded-full border-0 cursor-pointer transition-colors ${
                  filtro === f.value
                    ? 'bg-primary text-white'
                    : 'bg-bg text-text-muted hover:bg-gray-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {transacoes.length === 0 ? (
          <p className="text-text-muted text-sm text-center py-8">Nenhuma transação encontrada</p>
        ) : (
          <div className="space-y-2">
            {transacoes.map((t) => (
              <div key={t.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  {t.tipo === 'credito' ? (
                    <ArrowUpCircle className="w-5 h-5 text-success" />
                  ) : (
                    <ArrowDownCircle className="w-5 h-5 text-danger" />
                  )}
                  <div>
                    <p className="text-sm font-medium">{t.descricao || t.origem}</p>
                    <p className="text-xs text-text-muted">
                      {new Date(t.created_at).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
                <span className={`font-semibold text-sm ${t.tipo === 'credito' ? 'text-success' : 'text-danger'}`}>
                  {t.tipo === 'credito' ? '+' : '-'} R$ {Number(t.valor).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
