import { useEffect, useState } from 'react'
import { cotaService } from '@/services/cotaService'
import type { ResultadoBolaoUsuario, ResultadoConcursoUsuario } from '@/types'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { Trophy, ChevronDown, ChevronUp, Star } from 'lucide-react'
import { formatBRL } from '@/utils/format'

function ResumoAcertosFaixas({ resultado, tipo }: { resultado: ResultadoConcursoUsuario; tipo?: string }) {
  const isMega = tipo === 'megasena'
  const faixas = isMega ? [6, 5, 4, 3, 2, 1, 0] : [15, 14, 13, 12, 11]

  // Usa resumo_acertos do backend se disponível; caso contrário, calcula dos jogos
  const resumo: Record<number, number> =
    resultado.resumo_acertos && Object.keys(resultado.resumo_acertos).length > 0
      ? resultado.resumo_acertos
      : resultado.jogos.reduce<Record<number, number>>((acc, jogo) => {
          acc[jogo.acertos] = (acc[jogo.acertos] || 0) + 1
          return acc
        }, {})
  const totalJogos = resultado.jogos.length

  return (
    <div className="bg-bg rounded-xl p-4">
      <h4 className="text-sm font-semibold text-text mb-3 flex items-center gap-1.5">
        <Star className="w-4 h-4 text-yellow-500" />
        Resumo de Acertos
      </h4>
      <div className={`grid gap-2 ${isMega ? 'grid-cols-7' : 'grid-cols-5'}`}>
        {faixas.map((faixa) => {
          const qtd = resumo[faixa] || 0
          const hasPrize = isMega ? faixa >= 4 : faixa >= 11
          const isTop = isMega ? faixa === 6 : faixa >= 14
          return (
            <div
              key={faixa}
              className={`text-center rounded-lg p-2 ${
                qtd > 0 && isTop
                  ? 'bg-yellow-100/20 border border-yellow-500/30'
                  : qtd > 0 && hasPrize
                  ? 'bg-primary/10 border border-primary/30'
                  : 'bg-bg border border-border'
              }`}
            >
              <div className={`text-lg font-bold ${
                qtd > 0 && isTop ? 'text-amber-500' :
                qtd > 0 && hasPrize ? 'text-primary' : 'text-text-muted/40'
              }`}>
                {qtd}
              </div>
              <div className="text-[10px] text-text-muted font-medium">
                {faixa} ac
              </div>
            </div>
          )
        })}
      </div>
      <div className="text-xs text-text-muted mt-2 text-right">
        {totalJogos} jogo{totalJogos !== 1 ? 's' : ''} no total
      </div>
    </div>
  )
}

function DezenaSorteada({ numero }: { numero: number }) {
  return (
    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-linear-to-br from-yellow-400 to-yellow-600 text-white font-bold text-sm shadow-md">
      {String(numero).padStart(2, '0')}
    </span>
  )
}

function ConcursoResultado({
  resultado,
  isTeimosinha,
  defaultOpen,
  tipo,
}: {
  resultado: ResultadoConcursoUsuario
  isTeimosinha: boolean
  defaultOpen: boolean
  tipo?: string
}) {
  const [jogosAbertos, setJogosAbertos] = useState(defaultOpen)
  const resultadoSet = new Set(resultado.dezenas_sorteadas)

  return (
    <div className="space-y-3">
      {/* Header do concurso */}
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-text">
          {isTeimosinha ? `Concurso ${resultado.concurso_numero}` : 'Resultado do Concurso'}
        </h4>
        {resultado.premio_total > 0 && (
          <div className="flex flex-col items-end gap-1">
            <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-bold border border-primary/20">
              Prêmio total: {formatBRL(resultado.premio_total)}
            </span>
            {resultado.valor_por_cota != null && resultado.valor_por_cota > 0 && (
              <span className="text-xs text-text-muted">
                {formatBRL(resultado.valor_por_cota)} / cota
              </span>
            )}
          </div>
        )}
      </div>

      {/* Dezenas sorteadas */}
      <div className="bg-linear-to-r from-primary to-green-500 rounded-xl p-4">
        <p className="text-white text-xs font-medium mb-3 uppercase tracking-wide">
          Dezenas Sorteadas
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          {resultado.dezenas_sorteadas.map((d) => (
            <DezenaSorteada key={d} numero={d} />
          ))}
        </div>
      </div>

      {/* Resumo de acertos por faixa — só mostra se há jogos */}
      {resultado.jogos.length > 0 && <ResumoAcertosFaixas resultado={resultado} tipo={tipo} />}

      {/* Botão para expandir jogos */}
      <button
        onClick={() => setJogosAbertos(!jogosAbertos)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-bg rounded-lg border border-border cursor-pointer hover:bg-bg/80 transition-colors"
      >
        <span className="text-sm font-medium text-text">
          Ver Jogos ({resultado.jogos.length})
        </span>
        {jogosAbertos ? (
          <ChevronUp className="w-4 h-4 text-text-muted" />
        ) : (
          <ChevronDown className="w-4 h-4 text-text-muted" />
        )}
      </button>

      {/* Lista de jogos */}
      {jogosAbertos && (
        <div className="space-y-2">
          {resultado.jogos.map((jogo, idx) => (
            <div key={idx} className="bg-bg rounded-lg p-3 border border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-text-muted font-medium">Jogo {idx + 1}</span>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    jogo.acertos >= 15
                      ? 'bg-yellow-400 text-yellow-950'
                      : jogo.acertos >= 14
                      ? 'bg-yellow-100/20 text-amber-500 border border-amber-500/20'
                      : jogo.acertos >= 11
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'bg-bg text-text-muted/40 border border-border'
                  }`}
                >
                  {jogo.acertos} acertos
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {jogo.dezenas.map((dezena) => {
                  const acertou = resultadoSet.has(dezena)
                  return (
                    <span
                      key={dezena}
                      className={acertou ? 'numero-acerto' : 'numero-erro'}
                    >
                      {String(dezena).padStart(2, '0')}
                    </span>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function ResultadosPage() {
  const [resultados, setResultados] = useState<ResultadoBolaoUsuario[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandido, setExpandido] = useState<Record<string, boolean>>({})

  useEffect(() => {
    loadResultados()
  }, [])

  const loadResultados = async () => {
    try {
      setLoading(true)
      const data = await cotaService.meusResultados()
      setResultados(data)
      if (data.length > 0) {
        setExpandido({ [data[0].bolao_id]: true })
      }
    } catch {
      setError('Erro ao carregar resultados')
    } finally {
      setLoading(false)
    }
  }

  const toggleExpandido = (bolaoId: string) => {
    setExpandido((prev) => ({ ...prev, [bolaoId]: !prev[bolaoId] }))
  }

  if (loading) return <LoadingSpinner text="Carregando resultados..." />

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-danger">{error}</p>
        <button
          onClick={loadResultados}
          className="mt-3 text-primary hover:underline bg-transparent border-0 cursor-pointer"
        >
          Tentar novamente
        </button>
      </div>
    )
  }

  const totalPremios = resultados.reduce((sum, r) => sum + r.premio_usuario, 0)

  return (
    <div className="max-w-4xl mx-auto fade-in">
      <div className="mb-10 float-up">
        <h1 className="text-4xl font-black text-text tracking-tight flex items-center gap-3">
          Meus <span className="text-primary">Resultados</span>
        </h1>
        <p className="text-text-muted font-medium mt-1">
          Confira o desempenho de todos os concursos que você participou
        </p>
      </div>

      {/* Resumo geral */}
      {resultados.length > 0 && (
        <div className="bg-slate-900 dark:bg-slate-800 border border-slate-700 dark:border-slate-700/50 rounded-[32px] p-8 text-white shadow-2xl shadow-slate-950/20 mb-8 relative overflow-hidden group float-up float-up-delay-1">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl" />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-1">Total em Prêmios</p>
              <p className="text-4xl font-black text-amber-400">{formatBRL(totalPremios)}</p>
            </div>
            <div className="text-right">
              <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-1">Bolões Apurados</p>
              <p className="text-3xl font-black mt-1 text-white">{resultados.length}</p>
            </div>
          </div>
        </div>
      )}

      {resultados.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-xl border border-border">
          <Trophy className="w-12 h-12 text-text-muted mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-text">Nenhum resultado disponível</h3>
          <p className="text-text-muted text-sm mt-1">
            Quando os bolões que você participou forem apurados, os resultados aparecerão aqui.
          </p>
        </div>
      ) : (
        <div className="space-y-4 float-up float-up-delay-2">
          {resultados.map((bolao) => {
            const isTeimosinha =
              bolao.concurso_fim != null && bolao.concurso_fim > bolao.concurso_numero
            const isOpen = expandido[bolao.bolao_id]

            return (
              <div
                key={bolao.bolao_id}
                className="bg-card border border-border overflow-hidden rounded-[32px] shadow-sm hover:shadow-md transition-all card-hover"
              >
                {/* Header do bolão */}
                <button
                  onClick={() => toggleExpandido(bolao.bolao_id)}
                  className="w-full flex items-center justify-between p-5 bg-transparent border-0 cursor-pointer text-left hover:bg-bg transition-colors"
                >
                  <div>
                    <h3 className="font-bold text-lg text-text">{bolao.bolao_nome}</h3>
                    <p className="text-text-muted text-sm mt-0.5">
                      {isTeimosinha
                        ? `Concursos ${bolao.concurso_numero} a ${bolao.concurso_fim} (Teimosinha)`
                        : `Concurso ${bolao.concurso_numero}`}
                      {' \u00B7 '}
                      {bolao.quantidade_cotas} cota{bolao.quantidade_cotas > 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {bolao.premio_usuario > 0 ? (
                      <div className="text-right">
                        <p className="text-xs text-text-muted">Seu prêmio</p>
                        <p className="text-sm font-bold text-primary">
                          {formatBRL(bolao.premio_usuario)}
                        </p>
                      </div>
                    ) : (
                      <span className="text-sm bg-bg text-text-muted/60 px-3 py-1 rounded-lg border border-border">
                        Sem prêmio
                      </span>
                    )}
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-text-muted" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-text-muted" />
                    )}
                  </div>
                </button>

                {/* Conteúdo expandido */}
                {isOpen && (
                  <div className="border-t border-border p-5 space-y-6">
                    {bolao.resultados.map((resultado, idx) => (
                      <div key={resultado.concurso_numero}>
                        <ConcursoResultado
                          resultado={resultado}
                          isTeimosinha={isTeimosinha}
                          defaultOpen={idx === 0}
                          tipo={bolao.tipo}
                        />
                        {isTeimosinha &&
                          idx < bolao.resultados.length - 1 && (
                            <hr className="border-border mt-6" />
                          )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
