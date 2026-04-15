import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { carteiraService } from '@/services/carteiraService'
import type { CarteiraResumo, Transacao, TransacaoResumo } from '@/types'
import Skeleton from '@/components/ui/Skeleton'
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
import { formatBRL } from '@/utils/format'

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

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto fade-in">
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            <Skeleton className="w-6 h-6 rounded-md" />
            <div>
              <Skeleton className="w-32 h-6 mb-1" />
              <Skeleton className="w-48 h-4" />
            </div>
          </div>
          <Skeleton className="w-36 h-10 rounded-lg" />
        </div>
        
        <div className="p-6 mb-6 rounded-[1.5rem] bg-gray-100 flex items-center justify-between relative overflow-hidden">
          <div className="relative z-10 w-full flex justify-between items-center">
            <div>
              <Skeleton className="w-32 h-4 mb-2 bg-gray-200" />
              <Skeleton className="w-48 h-12 bg-gray-200" />
            </div>
            <Skeleton className="w-12 h-12 rounded-lg bg-gray-200" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-card border border-border p-4 rounded-[20px]">
              <div className="flex items-center gap-2 mb-2">
                <Skeleton className="w-8 h-8 rounded-lg" />
                <Skeleton className="w-20 h-3" />
              </div>
              <Skeleton className="w-24 h-6" />
            </div>
          ))}
        </div>

        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-border">
            <div className="flex items-center gap-2">
               <Skeleton className="w-5 h-5 rounded" />
               <Skeleton className="w-20 h-6" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="w-16 h-8 rounded-lg" />
              <Skeleton className="w-16 h-8 rounded-lg" />
              <Skeleton className="w-16 h-8 rounded-lg" />
            </div>
          </div>
          <div>
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex items-center justify-between px-5 py-4 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-xl" />
                  <div>
                    <Skeleton className="w-32 h-4 mb-1.5" />
                    <Skeleton className="w-48 h-3" />
                  </div>
                </div>
                <Skeleton className="w-20 h-5" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 float-up">
        <div>
          <h1 className="text-4xl font-black text-text tracking-tight flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Wallet className="w-8 h-8 text-primary" />
            </div>
            Minha <span className="text-primary">Carteira</span>
          </h1>
          <p className="text-text-muted font-medium mt-2">Gerencie seu saldo, prêmios e movimentações</p>
        </div>
        <Link
          to="/depositar"
          className="flex items-center justify-center gap-2 btn-gradient text-white font-black text-base px-8 py-4 rounded-2xl no-underline shadow-lg shadow-green-600/20 active:scale-95 transition-all"
        >
          <QrCode className="w-5 h-5" />
          Adicionar Saldo
        </Link>
      </div>

      {/* Saldo Principal */}
      <div className="p-8 mb-10 saldo-glow rounded-[32px] float-up float-up-delay-1 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl transition-transform group-hover:scale-110" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <p className="text-white/70 text-sm font-bold uppercase tracking-widest mb-2">Saldo Total Disponível</p>
            <p className="text-5xl md:text-6xl font-black tracking-tight text-white drop-shadow-md">
              {saldo ? formatBRL(Number(saldo.saldo_disponivel)) : formatBRL(0)}
            </p>
          </div>
          <div className="p-5 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-inner">
            <Wallet className="w-12 h-12 text-white" />
          </div>
        </div>
        {saldo && Number(saldo.saldo_bloqueado) > 0 && (
          <div className="relative z-10 flex items-center gap-2 mt-8 pt-6 border-t border-white/10">
            <div className="p-1.5 bg-amber-400/20 rounded-lg">
              <Lock className="w-4 h-4 text-amber-200" />
            </div>
            <span className="text-sm font-bold text-white/80">
              Valor bloqueado em apostas: <span className="text-white">{formatBRL(Number(saldo.saldo_bloqueado))}</span>
            </span>
          </div>
        )}
      </div>

      {/* Resumo Financeiro */}
      {resumo && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 float-up float-up-delay-2">
          <div className="bg-card border border-border p-6 rounded-3xl shadow-sm card-hover">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-900/30 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-500" />
              </div>
              <span className="text-xs text-text-muted font-bold uppercase tracking-wider">Depósitos</span>
            </div>
            <p className="text-2xl font-black text-green-600 dark:text-green-500">
              {formatBRL(resumo.total_depositos)}
            </p>
          </div>
          <div className="bg-card border border-border p-6 rounded-3xl shadow-sm card-hover">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-amber-600 dark:text-amber-500" />
              </div>
              <span className="text-xs text-text-muted font-bold uppercase tracking-wider">Prêmios</span>
            </div>
            <p className="text-2xl font-black text-amber-600 dark:text-amber-500">
              {formatBRL(resumo.total_premios)}
            </p>
          </div>
          <div className="bg-card border border-border p-6 rounded-3xl shadow-sm card-hover">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-bg flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-text-muted" />
              </div>
              <span className="text-xs text-text-muted font-bold uppercase tracking-wider">Investido</span>
            </div>
            <p className="text-2xl font-black text-text">
              {formatBRL(resumo.total_compras)}
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
                    : 'bg-bg text-text-muted hover:bg-bg/80'
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
                      className="flex items-center justify-between px-5 py-3.5 border-b border-border last:border-0 hover:bg-bg transition-colors"
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
                            Saldo: {formatBRL(Number(t.saldo_anterior))} → {formatBRL(Number(t.saldo_posterior))}
                          </p>
                        </div>
                      </div>
                      <div className="text-right shrink-0 ml-3">
                        <p className={`font-bold text-sm ${t.tipo === 'credito' ? 'text-green-600' : 'text-red-500'}`}>
                          {t.tipo === 'credito' ? '+' : '-'} {formatBRL(Number(t.valor))}
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
