import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { carteiraService } from '@/services/carteiraService'
import type { CarteiraResumo, Transacao, TransacaoResumo } from '@/types'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import {
  Wallet,
  ArrowUpCircle,
  ArrowDownCircle,
  QrCode,
  Lock,
  Trophy,
  Ticket,
  TrendingUp,
  TrendingDown,
  Receipt,
} from 'lucide-react'

function formatCurrency(value: number) {
  return value.toFixed(2).replace('.', ',')
}

function getOrigemInfo(origem: string, tipo: string) {
  switch (origem) {
    case 'premio_bolao':
      return { label: 'Premio de Bolao', icon: Trophy, color: 'text-yellow-600', bg: 'bg-yellow-100' }
    case 'pix':
      return { label: 'Deposito via Pix', icon: QrCode, color: 'text-green-600', bg: 'bg-green-100' }
    case 'compra_cota':
      return { label: 'Compra de Cota', icon: Ticket, color: 'text-blue-600', bg: 'bg-blue-100' }
    default:
      return tipo === 'credito'
        ? { label: origem || 'Credito', icon: ArrowUpCircle, color: 'text-green-600', bg: 'bg-green-100' }
        : { label: origem || 'Debito', icon: ArrowDownCircle, color: 'text-red-500', bg: 'bg-red-100' }
  }
}

export default function CarteiraPage() {
  const [saldo, setSaldo] = useState<CarteiraResumo | null>(null)
  const [resumo, setResumo] = useState<TransacaoResumo | null>(null)
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
      const [saldoData, transacoesData, resumoData] = await Promise.allSettled([
        carteiraService.getSaldo(),
        carteiraService.getTransacoes(),
        carteiraService.getResumoTransacoes(),
      ])
      if (saldoData.status === 'fulfilled') setSaldo(saldoData.value)
      if (transacoesData.status === 'fulfilled') setTransacoes(transacoesData.value)
      if (resumoData.status === 'fulfilled') setResumo(resumoData.value)
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

  // Agrupar transacoes por data
  const transacoesPorData = transacoes.reduce<Record<string, Transacao[]>>((acc, t) => {
    const data = new Date(t.created_at).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
    if (!acc[data]) acc[data] = []
    acc[data].push(t)
    return acc
  }, {})

  if (loading) return <LoadingSpinner text="Carregando carteira..." />

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text flex items-center gap-2">
            <Wallet className="w-6 h-6 text-primary" />
            Carteira
          </h1>
          <p className="text-text-muted text-sm mt-1">Seu extrato e movimentacoes</p>
        </div>
        <Link
          to="/depositar"
          className="flex items-center gap-2 btn-gradient text-white font-semibold text-sm px-4 py-2.5 rounded-lg no-underline"
        >
          <QrCode className="w-4 h-4" />
          Depositar via Pix
        </Link>
      </div>

      {/* Saldo Principal */}
      <div className="rounded-2xl p-6 mb-6 saldo-glow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-700 text-sm font-medium mb-1">Saldo Disponivel</p>
            <p className="text-5xl font-extrabold tracking-tight valor-gold">
              R$ {saldo ? formatCurrency(Number(saldo.saldo_disponivel)) : '0,00'}
            </p>
          </div>
          <Wallet className="w-12 h-12 text-green-400 opacity-60" />
        </div>
        {saldo && Number(saldo.saldo_bloqueado) > 0 && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-green-200">
            <Lock className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-700">
              Saldo bloqueado: R$ {formatCurrency(Number(saldo.saldo_bloqueado))}
            </span>
          </div>
        )}
      </div>

      {/* Resumo Financeiro */}
      {resumo && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-card border border-border p-4 card-hover">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-xs text-text-muted font-medium">Depositos</span>
            </div>
            <p className="text-xl font-extrabold text-green-600">
              R$ {formatCurrency(resumo.total_depositos)}
            </p>
          </div>
          <div className="bg-card border border-border p-4 card-hover">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center">
                <Trophy className="w-4 h-4 text-yellow-600" />
              </div>
              <span className="text-xs text-text-muted font-medium">Premios</span>
            </div>
            <p className="text-xl font-extrabold text-yellow-600">
              R$ {formatCurrency(resumo.total_premios)}
            </p>
          </div>
          <div className="bg-card border border-border p-4 card-hover">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <TrendingDown className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-xs text-text-muted font-medium">Gastos em Cotas</span>
            </div>
            <p className="text-xl font-extrabold text-blue-600">
              R$ {formatCurrency(resumo.total_compras)}
            </p>
          </div>
        </div>
      )}

      {/* Extrato */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-[0_10px_25px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-text-muted" />
            <h2 className="font-semibold text-lg">Extrato</h2>
          </div>
          <div className="flex gap-1">
            {[
              { label: 'Todas', value: undefined },
              { label: 'Entradas', value: 'credito' },
              { label: 'Saidas', value: 'debito' },
            ].map((f) => (
              <button
                key={f.label}
                onClick={() => setFiltro(f.value)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border-0 cursor-pointer transition-colors ${
                  filtro === f.value
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {transacoes.length === 0 ? (
          <div className="text-center py-12 px-4">
            <Wallet className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-text-muted text-sm font-medium">Nenhuma transacao encontrada</p>
            <p className="text-text-muted text-xs mt-1">Suas movimentacoes aparecerao aqui</p>
          </div>
        ) : (
          <div>
            {Object.entries(transacoesPorData).map(([data, items]) => (
              <div key={data}>
                <div className="px-5 py-2 bg-bg/50 border-b border-border">
                  <p className="text-xs font-semibold text-text-muted uppercase tracking-wide">{data}</p>
                </div>
                {items.map((t) => {
                  const info = getOrigemInfo(t.origem, t.tipo)
                  const Icon = info.icon
                  return (
                    <div
                      key={t.id}
                      className="flex items-center justify-between px-5 py-3.5 border-b border-border last:border-0 hover:bg-green-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${info.bg} flex items-center justify-center shrink-0`}>
                          <Icon className={`w-5 h-5 ${info.color}`} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-text">
                            {t.descricao || info.label}
                          </p>
                          <p className="text-xs text-text-muted mt-0.5">
                            {new Date(t.created_at).toLocaleTimeString('pt-BR', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                            {' · '}
                            Saldo: R$ {formatCurrency(Number(t.saldo_anterior))} → R$ {formatCurrency(Number(t.saldo_posterior))}
                          </p>
                        </div>
                      </div>
                      <div className="text-right shrink-0 ml-3">
                        <p className={`font-bold text-sm ${t.tipo === 'credito' ? 'text-green-600' : 'text-red-500'}`}>
                          {t.tipo === 'credito' ? '+' : '-'} R$ {formatCurrency(Number(t.valor))}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
