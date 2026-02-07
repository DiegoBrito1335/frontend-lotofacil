import { useEffect, useState } from 'react'
import { cotaService } from '@/services/cotaService'
import type { ResultadoBolaoUsuario } from '@/types'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { Trophy, DollarSign, ChevronDown, ChevronUp } from 'lucide-react'

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
      // Expandir o primeiro por padrão
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
    setExpandido(prev => ({ ...prev, [bolaoId]: !prev[bolaoId] }))
  }

  if (loading) return <LoadingSpinner text="Carregando resultados..." />

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-danger">{error}</p>
        <button onClick={loadResultados} className="mt-3 text-primary hover:underline bg-transparent border-0 cursor-pointer">
          Tentar novamente
        </button>
      </div>
    )
  }

  const totalPremios = resultados.reduce((sum, r) => sum + r.premio_usuario, 0)

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-500" />
          Meus Resultados
        </h1>
        <p className="text-text-muted text-sm mt-1">Resultados dos concursos em que você participou</p>
      </div>

      {/* Resumo */}
      {resultados.length > 0 && (
        <div className="bg-card rounded-xl border border-border p-4 mb-4 flex items-center justify-between">
          <div className="text-sm text-text-muted">
            {resultados.length} bolão(ões) apurado(s)
          </div>
          <div className="flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-green-600" />
            <span className="text-sm text-text-muted">Total em prêmios:</span>
            <span className={`font-bold ${totalPremios > 0 ? 'text-green-600' : 'text-text-muted'}`}>
              R$ {totalPremios.toFixed(2)}
            </span>
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
        <div className="space-y-4">
          {resultados.map((bolao) => {
            const isTeimosinha = bolao.concurso_fim && bolao.concurso_fim > bolao.concurso_numero
            const isOpen = expandido[bolao.bolao_id]

            return (
              <div key={bolao.bolao_id} className="bg-card rounded-xl border border-border overflow-hidden">
                {/* Header do bolão */}
                <button
                  onClick={() => toggleExpandido(bolao.bolao_id)}
                  className="w-full flex items-center justify-between p-5 bg-transparent border-0 cursor-pointer text-left"
                >
                  <div>
                    <h3 className="font-semibold text-lg text-text">{bolao.bolao_nome}</h3>
                    <p className="text-text-muted text-sm mt-0.5">
                      {isTeimosinha
                        ? `Concursos ${bolao.concurso_numero} a ${bolao.concurso_fim} (Teimosinha)`
                        : `Concurso ${bolao.concurso_numero}`
                      }
                      {' '}&middot;{' '}{bolao.quantidade_cotas} cota{bolao.quantidade_cotas > 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {bolao.premio_usuario > 0 ? (
                      <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-lg font-semibold">
                        R$ {bolao.premio_usuario.toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-sm bg-gray-100 text-gray-500 px-3 py-1 rounded-lg">
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
                  <div className="border-t border-border p-5 space-y-4">
                    {bolao.resultados.map((resultado) => (
                      <div key={resultado.concurso_numero}>
                        {/* Dezenas sorteadas */}
                        <div className="mb-3">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-semibold text-text">
                              {isTeimosinha ? `Concurso ${resultado.concurso_numero}` : 'Dezenas Sorteadas'}
                            </p>
                            {resultado.premio_total > 0 && (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded font-medium">
                                Prêmio: R$ {resultado.premio_total.toFixed(2)}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {resultado.dezenas_sorteadas.map((d) => (
                              <span
                                key={d}
                                className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-yellow-500 text-white font-bold text-xs shadow-sm"
                              >
                                {String(d).padStart(2, '0')}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Jogos com acertos */}
                        <div className="space-y-2">
                          {resultado.jogos.map((jogo, idx) => {
                            const resultadoSet = new Set(resultado.dezenas_sorteadas)
                            return (
                              <div key={idx} className="bg-bg rounded-lg p-3">
                                <div className="flex items-center justify-between mb-2">
                                  <p className="text-xs text-text-muted font-medium">Jogo {idx + 1}</p>
                                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                    jogo.acertos >= 14 ? 'bg-yellow-100 text-yellow-800' :
                                    jogo.acertos >= 11 ? 'bg-green-100 text-green-800' :
                                    'bg-gray-100 text-gray-600'
                                  }`}>
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
                            )
                          })}
                        </div>

                        {/* Separador entre concursos teimosinha */}
                        {isTeimosinha && resultado !== bolao.resultados[bolao.resultados.length - 1] && (
                          <hr className="border-border mt-4" />
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
