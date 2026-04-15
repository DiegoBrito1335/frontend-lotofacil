import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { bolaoService } from '@/services/bolaoService'
import { cotaService } from '@/services/cotaService'
import { useAuth } from '@/contexts/AuthContext'
import type { Bolao, Jogo } from '@/types'
import Skeleton from '@/components/ui/Skeleton'
import StatusBadge from '@/components/ui/StatusBadge'
import { ArrowLeft, ShoppingCart, Minus, Plus, Ticket, Hash, Trophy, DollarSign, CheckCircle2, Clock } from 'lucide-react'
import { formatBRL } from '@/utils/format'
import { fireConfetti } from '@/utils/confetti'

interface ResultadoPublico {
  concurso_numero: number
  dezenas: number[]
  premio_total: number
}

import { toast } from 'react-hot-toast'

export default function BolaoDetalhesPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const [bolao, setBolao] = useState<Bolao | null>(null)
  const [jogos, setJogos] = useState<Jogo[]>([])
  const [loading, setLoading] = useState(true)
  const [quantidade, setQuantidade] = useState(1)
  const [comprando, setComprando] = useState(false)
  const [resultadosTeimosinha, setResultadosTeimosinha] = useState<ResultadoPublico[]>([])
  const [premioTotalGeral, setPremioTotalGeral] = useState(0)
  const [premioUnico, setPremioUnico] = useState(0)

  useEffect(() => {
    if (id) loadBolao(id)
  }, [id])

  const loadBolao = async (bolaoId: string) => {
    try {
      setLoading(true)
      const [bolaoData, jogosData] = await Promise.all([
        bolaoService.getById(bolaoId),
        bolaoService.getJogos(bolaoId),
      ])
      setBolao(bolaoData)
      setJogos(jogosData)

      // Carregar resultados/premiações se houver concursos apurados
      const isTeimosinha = bolaoData.concurso_fim && bolaoData.concurso_fim > bolaoData.concurso_numero
      if (bolaoData.status === 'apurado' || (isTeimosinha && (bolaoData.concursos_apurados ?? 0) > 0)) {
        try {
          const res = await bolaoService.getResultado(bolaoId)
          if (res.teimosinha && res.resultados) {
            setResultadosTeimosinha(res.resultados)
            setPremioTotalGeral(res.premio_total_geral || 0)
          } else if (res.premio_total) {
            setPremioUnico(res.premio_total)
          }
        } catch {
          // Pode não ter resultado ainda
        }
      }
    } catch {
      toast.error('Erro ao carregar bolão')
    } finally {
      setLoading(false)
    }
  }

  const handleComprar = async () => {
    if (!id || !isAuthenticated) {
      navigate('/login')
      return
    }

    try {
      setComprando(true)
      const resultado = await cotaService.comprar({ bolao_id: id, quantidade })
      fireConfetti()
      toast.success(
        <div className="flex items-start gap-3">
           <CheckCircle2 className="w-6 h-6 text-green-600 mt-0.5 shrink-0" />
           <div>
             <p className="font-bold text-green-900 mb-1">{resultado.mensagem}</p>
             <p className="text-sm font-medium text-green-800">
               Total: <span className="font-extrabold">{formatBRL(resultado.valor_total)}</span>
             </p>
             <p className="text-xs mt-1 text-green-700">Saldo atualizado: {formatBRL(resultado.saldo_restante)}</p>
           </div>
        </div>,
        { 
          duration: 6000, 
          style: { 
            background: '#f0fdf4', 
            color: '#166534', 
            border: '2px solid #86efac',
            borderRadius: '16px',
            boxShadow: '0 10px 25px -5px rgba(34, 197, 94, 0.2), 0 8px 10px -6px rgba(34, 197, 94, 0.1)',
            padding: '16px',
            maxWidth: '400px'
          } 
        }
      )
      // Recarrega dados do bolão
      await loadBolao(id)
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } }
      const detail = error.response?.data?.detail || 'Erro ao comprar cota'
      const textoAmigavel = detail.toLowerCase().includes('carteira')
        ? 'Saldo insuficiente. Deposite via Pix antes de comprar cotas.'
        : detail
      toast.error(textoAmigavel, { duration: 5000 })
    } finally {
      setComprando(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto fade-in">
        <Skeleton className="h-4 w-20 mb-4" />
        <div className="bg-card rounded-xl border border-border p-6 mb-4">
          <div className="flex justify-between items-start mb-4">
            <div>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-40" />
            </div>
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
          <Skeleton className="h-4 w-5/6 mb-4" />
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-3 w-10" />
            </div>
            <Skeleton className="h-3 w-full rounded-full" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-bg rounded-lg p-3 flex flex-col items-center">
                <Skeleton className="h-3 w-16 mb-2" />
                <Skeleton className="h-6 w-20" />
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1 bg-card rounded-xl border border-border p-5 h-[280px]">
            <Skeleton className="h-6 w-40 mb-6" />
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-10 w-full mb-4" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
          <div className="lg:col-span-2 bg-card rounded-xl border border-border p-5">
            <Skeleton className="h-6 w-32 mb-6" />
            <div className="space-y-3">
              {[1, 2].map(i => (
                <div key={i} className="bg-bg rounded-lg p-4">
                  <Skeleton className="h-4 w-16 mb-3" />
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5, 6].map(j => <Skeleton key={j} className="h-9 w-9 rounded-full" />)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
  if (!bolao) return <div className="text-center py-12 text-danger">Bolão não encontrado</div>

  const isTeimosinha = !!(bolao.concurso_fim && bolao.concurso_fim > bolao.concurso_numero)
  const cotasVendidas = bolao.total_cotas - bolao.cotas_disponiveis
  const percentual = bolao.total_cotas > 0 ? (cotasVendidas / bolao.total_cotas) * 100 : 0
  const valorTotal = quantidade * Number(bolao.valor_cota)

  return (
    <div className={`max-w-4xl mx-auto ${bolao.status === 'aberto' && bolao.cotas_disponiveis > 0 ? 'pb-24 md:pb-0' : ''}`}>
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-text-muted hover:text-text mb-4 bg-transparent border-0 cursor-pointer text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </button>

      {/* Cabeçalho */}
      <div className="bg-card rounded-3xl border border-border p-8 mb-6 float-up shadow-sm">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-text leading-tight mb-2">{bolao.nome}</h1>
            <div className="flex items-center gap-2 text-text-muted font-medium">
              <Clock className="w-4 h-4 text-primary" />
              <span>
                {bolao.concurso_fim && bolao.concurso_fim > bolao.concurso_numero
                  ? <>Concursos {bolao.concurso_numero} a {bolao.concurso_fim} <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-lg text-xs font-bold ml-1 uppercase">Teimosinha</span></>
                  : <>Concurso {bolao.concurso_numero}</>
                }
              </span>
            </div>
          </div>
          <StatusBadge status={bolao.status} />
        </div>

        {bolao.descricao && <p className="text-text-muted mb-4">{bolao.descricao}</p>}

        {/* Progresso */}
        <div className="mb-8">
          <div className="flex justify-between text-xs font-bold text-text-muted/60 uppercase tracking-widest mb-2">
            <span>Exploração: {cotasVendidas}/{bolao.total_cotas} Cotas</span>
            <span>{percentual.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
            <div
              className={`bg-linear-to-r from-primary to-green-600 h-full rounded-full progress-animated [--progress:${Math.min(percentual, 100)}%] transition-all duration-1000`}
            />
          </div>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-bg border border-border/50 rounded-2xl p-4 text-center">
            <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider mb-1">Valor/Cota</p>
            <p className="text-xl font-black text-primary">{formatBRL(Number(bolao.valor_cota))}</p>
          </div>
          <div className="bg-bg border border-border/50 rounded-2xl p-4 text-center">
            <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider mb-1">Total</p>
            <p className="text-xl font-black text-text">{bolao.total_cotas}</p>
          </div>
          <div className="bg-bg border border-border/50 rounded-2xl p-4 text-center">
            <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider mb-1">Disponíveis</p>
            <p className="text-xl font-black text-green-600">{bolao.cotas_disponiveis}</p>
          </div>
          <div className="bg-bg border border-border/50 rounded-2xl p-4 text-center">
            <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider mb-1">Qtd Jogos</p>
            <p className="text-xl font-black text-text">{jogos.length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Comprar Cotas */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-3xl border border-border p-6 sticky top-24 shadow-sm float-up float-up-delay-1">
            <h2 className="font-black text-xl mb-6 flex items-center gap-2 text-text">
              <ShoppingCart className="w-5 h-5 text-primary" />
              Comprar
            </h2>

            {bolao.status !== 'aberto' ? (
              <div className="bg-bg rounded-2xl p-4 text-center">
                <p className="text-text-muted text-sm font-medium">Este bolão não está aberto para novas compras.</p>
              </div>
            ) : bolao.cotas_disponiveis === 0 ? (
              <div className="bg-amber-50 rounded-2xl p-4 text-center border border-amber-100">
                <p className="text-amber-700 text-sm font-bold">Cotas esgotadas!</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] text-text-muted font-bold uppercase tracking-wider block mb-3">Selecione a quantidade</label>
                  <div className="flex items-center justify-between gap-4 bg-bg p-2 rounded-2xl border border-border">
                    <button
                      aria-label="Diminuir quantidade"
                      onClick={() => setQuantidade(Math.max(1, quantidade - 1))}
                      className="w-12 h-12 flex items-center justify-center rounded-xl bg-card text-text shadow-xs border border-border hover:text-primary hover:border-primary/30 transition-all cursor-pointer"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <input
                      type="number"
                      min={1}
                      max={bolao.cotas_disponiveis}
                      value={quantidade}
                      title="Quantidade de cotas"
                      aria-label="Quantidade de cotas"
                      onChange={(e) => setQuantidade(Math.max(1, Math.min(bolao.cotas_disponiveis, parseInt(e.target.value) || 1)))}
                      className="w-full h-12 text-center bg-transparent border-0 text-2xl font-black text-text focus:outline-none"
                    />
                    <button
                      aria-label="Aumentar quantidade"
                      onClick={() => setQuantidade(Math.min(bolao.cotas_disponiveis, quantidade + 1))}
                      className="w-12 h-12 flex items-center justify-center rounded-xl bg-card text-text shadow-xs border border-border hover:text-primary hover:border-primary/30 transition-all cursor-pointer"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="bg-primary/10 rounded-2xl p-4 border border-primary/20">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-text-muted uppercase tracking-tight">{quantidade} Cota{quantidade > 1 ? 's' : ''}</span>
                    <span className="text-2xl font-black text-primary">{formatBRL(valorTotal)}</span>
                  </div>
                </div>

                <button
                  onClick={handleComprar}
                  disabled={comprando}
                  className="w-full flex items-center justify-center gap-2 btn-gradient text-white font-black py-4 px-4 rounded-2xl border-0 cursor-pointer text-base shadow-lg shadow-green-600/20 active:scale-95 transition-all"
                >
                  <Ticket className="w-5 h-5" />
                  {comprando ? 'Processando...' : `Confirmar Composta`}
                </button>

                <p className="text-[10px] text-center text-text-muted font-medium">
                  Ao clicar em confirmar, você concorda com nossos termos de uso e regras do bolão.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Jogos */}
        <div className="lg:col-span-2">
          {/* Resultado do concurso único (se apurado) */}
          {bolao.status === 'apurado' && bolao.resultado_dezenas && !isTeimosinha && (
            <div className="bg-card rounded-xl border border-border p-5 mb-4">
              <h2 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Resultado do Concurso {bolao.concurso_numero}
              </h2>
              <div className="flex flex-wrap gap-2 mb-3">
                {bolao.resultado_dezenas.sort((a, b) => a - b).map((d) => (
                  <span key={d} className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-amber-100 text-amber-800 font-bold text-sm">
                    {String(d).padStart(2, '0')}
                  </span>
                ))}
              </div>
              {premioUnico > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center justify-between">
                  <span className="text-sm font-medium text-green-700 flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    Prêmio Distribuído
                  </span>
                  <span className="text-lg font-bold text-green-800">{formatBRL(premioUnico)}</span>
                </div>
              )}
            </div>
          )}

          {/* Resultados teimosinha (por concurso) */}
          {isTeimosinha && resultadosTeimosinha.length > 0 && (
            <div className="bg-card rounded-xl border border-border p-5 mb-4">
              <h2 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Resultados ({resultadosTeimosinha.length} concursos apurados)
              </h2>

              {premioTotalGeral > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-green-700 flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    Prêmio Total
                  </span>
                  <span className="text-lg font-bold text-green-800">{formatBRL(premioTotalGeral)}</span>
                </div>
              )}

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {resultadosTeimosinha.map((res) => (
                  <div key={res.concurso_numero} className="bg-bg rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold">Concurso {res.concurso_numero}</span>
                      {res.premio_total > 0 && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded font-medium">
                          {formatBRL(res.premio_total)}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {res.dezenas.sort((a, b) => a - b).map((d) => (
                        <span key={d} className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-100 text-amber-800 font-bold text-[11px]">
                          {String(d).padStart(2, '0')}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-card rounded-3xl border border-border p-6 shadow-sm float-up float-up-delay-2">
            <h2 className="font-black text-xl mb-6 flex items-center gap-2 text-text">
              <Hash className="w-5 h-5 text-primary" />
              Jogos Inclusos <span className="text-text-muted/40 ml-auto font-bold text-sm bg-bg px-3 py-1 rounded-lg">{jogos.length}</span>
            </h2>

            {jogos.length === 0 ? (
              <p className="text-text-muted text-sm">Nenhum jogo cadastrado ainda.</p>
            ) : (
              <div className="space-y-4">
                {jogos.map((jogo, index) => {
                  const resultadoSet = bolao.resultado_dezenas ? new Set(bolao.resultado_dezenas) : null
                  const acertos = jogo.acertos ?? (resultadoSet ? jogo.dezenas.filter((d) => resultadoSet.has(d)).length : null)
                  return (
                    <div key={jogo.id} className="bg-bg border border-border rounded-2xl p-5 hover:bg-card transition-all card-hover group">
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Jogo #{index + 1}</p>
                        {acertos !== null && (
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            acertos >= 14 ? 'bg-yellow-100 text-yellow-800' :
                            acertos >= 11 ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-400'
                          }`}>
                            {acertos} acertos
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {jogo.dezenas.sort((a, b) => a - b).map((dezena) => {
                          const acertou = resultadoSet?.has(dezena)
                          return (
                            <span
                              key={dezena}
                              className={resultadoSet ? (acertou ? 'numero-acerto' : 'numero-erro') : 'numero-bolao'}
                            >
                              {String(dezena).padStart(2, '0')}
                            </span>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sticky CTA — mobile only */}
      {bolao.status === 'aberto' && bolao.cotas_disponiveis > 0 && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-primary/20 p-4 flex items-center gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-text-muted">{quantidade} cota{quantidade > 1 ? 's' : ''}</p>
            <p className="font-bold text-primary text-lg">{formatBRL(valorTotal)}</p>
          </div>
          <button
            type="button"
            onClick={handleComprar}
            disabled={comprando}
            className="flex items-center justify-center gap-2 btn-gradient text-white font-bold py-3 px-6 rounded-xl border-0 cursor-pointer text-sm whitespace-nowrap"
          >
            <Ticket className="w-4 h-4" />
            {comprando ? 'Comprando...' : 'Comprar'}
          </button>
        </div>
      )}
    </div>
  )
}
