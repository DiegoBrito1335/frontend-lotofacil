import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { bolaoService } from '@/services/bolaoService'
import { cotaService } from '@/services/cotaService'
import { useAuth } from '@/contexts/AuthContext'
import type { Bolao, Jogo } from '@/types'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import StatusBadge from '@/components/ui/StatusBadge'
import { ArrowLeft, ShoppingCart, Minus, Plus, Ticket, Hash, Trophy } from 'lucide-react'

export default function BolaoDetalhesPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const [bolao, setBolao] = useState<Bolao | null>(null)
  const [jogos, setJogos] = useState<Jogo[]>([])
  const [loading, setLoading] = useState(true)
  const [quantidade, setQuantidade] = useState(1)
  const [comprando, setComprando] = useState(false)
  const [mensagem, setMensagem] = useState<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(null)

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
    } catch {
      setMensagem({ tipo: 'erro', texto: 'Erro ao carregar bolão' })
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
      setMensagem(null)
      const resultado = await cotaService.comprar({ bolao_id: id, quantidade })
      setMensagem({
        tipo: 'sucesso',
        texto: `${resultado.mensagem} Valor: R$ ${resultado.valor_total.toFixed(2)} | Saldo restante: R$ ${resultado.saldo_restante.toFixed(2)}`,
      })
      // Recarrega dados do bolão
      await loadBolao(id)
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } }
      const detail = error.response?.data?.detail || 'Erro ao comprar cota'
      const textoAmigavel = detail.toLowerCase().includes('carteira')
        ? 'Saldo insuficiente. Deposite via Pix antes de comprar cotas.'
        : detail
      setMensagem({
        tipo: 'erro',
        texto: textoAmigavel,
      })
    } finally {
      setComprando(false)
    }
  }

  if (loading) return <LoadingSpinner text="Carregando bolão..." />
  if (!bolao) return <div className="text-center py-12 text-danger">Bolão não encontrado</div>

  const cotasVendidas = bolao.total_cotas - bolao.cotas_disponiveis
  const percentual = bolao.total_cotas > 0 ? (cotasVendidas / bolao.total_cotas) * 100 : 0
  const valorTotal = quantidade * Number(bolao.valor_cota)

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-text-muted hover:text-text mb-4 bg-transparent border-0 cursor-pointer text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </button>

      {/* Cabeçalho */}
      <div className="bg-card rounded-xl border border-border p-6 mb-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">{bolao.nome}</h1>
            <p className="text-text-muted mt-1">
              {bolao.concurso_fim && bolao.concurso_fim > bolao.concurso_numero
                ? <>Concursos {bolao.concurso_numero} a {bolao.concurso_fim} <span className="text-primary font-medium">(Teimosinha)</span></>
                : <>Concurso {bolao.concurso_numero}</>
              }
            </p>
          </div>
          <StatusBadge status={bolao.status} />
        </div>

        {bolao.descricao && <p className="text-text-muted mb-4">{bolao.descricao}</p>}

        {/* Progresso */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-text-muted mb-1">
            <span>{cotasVendidas}/{bolao.total_cotas} cotas vendidas</span>
            <span>{percentual.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3">
            <div
              className="bg-primary h-3 rounded-full transition-all"
              style={{ width: `${Math.min(percentual, 100)}%` }}
            />
          </div>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-bg rounded-lg p-3 text-center">
            <p className="text-xs text-text-muted">Valor/Cota</p>
            <p className="text-lg font-bold text-primary">R$ {Number(bolao.valor_cota).toFixed(2)}</p>
          </div>
          <div className="bg-bg rounded-lg p-3 text-center">
            <p className="text-xs text-text-muted">Total de Cotas</p>
            <p className="text-lg font-bold">{bolao.total_cotas}</p>
          </div>
          <div className="bg-bg rounded-lg p-3 text-center">
            <p className="text-xs text-text-muted">Disponíveis</p>
            <p className="text-lg font-bold text-success">{bolao.cotas_disponiveis}</p>
          </div>
          <div className="bg-bg rounded-lg p-3 text-center">
            <p className="text-xs text-text-muted">Jogos</p>
            <p className="text-lg font-bold">{jogos.length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Comprar Cotas */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-xl border border-border p-5 sticky top-20">
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-primary" />
              Comprar Cotas
            </h2>

            {bolao.status !== 'aberto' ? (
              <p className="text-text-muted text-sm">Este bolão não está aberto para compras.</p>
            ) : bolao.cotas_disponiveis === 0 ? (
              <p className="text-text-muted text-sm">Todas as cotas foram vendidas!</p>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-text-muted block mb-1">Quantidade</label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setQuantidade(Math.max(1, quantidade - 1))}
                      className="w-10 h-10 flex items-center justify-center rounded-lg border border-border bg-bg hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      min={1}
                      max={bolao.cotas_disponiveis}
                      value={quantidade}
                      onChange={(e) => setQuantidade(Math.max(1, Math.min(bolao.cotas_disponiveis, parseInt(e.target.value) || 1)))}
                      className="w-16 h-10 text-center border border-border rounded-lg bg-bg text-lg font-semibold"
                    />
                    <button
                      onClick={() => setQuantidade(Math.min(bolao.cotas_disponiveis, quantidade + 1))}
                      className="w-10 h-10 flex items-center justify-center rounded-lg border border-border bg-bg hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="bg-bg rounded-lg p-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-text-muted">{quantidade}x R$ {Number(bolao.valor_cota).toFixed(2)}</span>
                    <span className="font-semibold">R$ {valorTotal.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleComprar}
                  disabled={comprando}
                  className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-lg transition-colors border-0 cursor-pointer text-sm"
                >
                  <Ticket className="w-4 h-4" />
                  {comprando ? 'Comprando...' : `Comprar ${quantidade} cota${quantidade > 1 ? 's' : ''}`}
                </button>

                {mensagem && (
                  <div className={`p-3 rounded-lg text-sm ${mensagem.tipo === 'sucesso' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                    {mensagem.texto}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Jogos */}
        <div className="lg:col-span-2">
          {/* Resultado do concurso (se apurado) */}
          {bolao.status === 'apurado' && bolao.resultado_dezenas && (
            <div className="bg-card rounded-xl border border-border p-5 mb-4">
              <h2 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Resultado do Concurso {bolao.concurso_numero}
              </h2>
              <div className="flex flex-wrap gap-2">
                {bolao.resultado_dezenas.sort((a, b) => a - b).map((d) => (
                  <span key={d} className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-yellow-500 text-white font-bold text-sm shadow-sm">
                    {String(d).padStart(2, '0')}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="bg-card rounded-xl border border-border p-5">
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Hash className="w-5 h-5 text-primary" />
              Jogos ({jogos.length})
            </h2>

            {jogos.length === 0 ? (
              <p className="text-text-muted text-sm">Nenhum jogo cadastrado ainda.</p>
            ) : (
              <div className="space-y-3">
                {jogos.map((jogo, index) => {
                  const resultadoSet = bolao.resultado_dezenas ? new Set(bolao.resultado_dezenas) : null
                  const acertos = jogo.acertos ?? (resultadoSet ? jogo.dezenas.filter((d) => resultadoSet.has(d)).length : null)
                  return (
                    <div key={jogo.id} className="bg-bg rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs text-text-muted font-medium">Jogo {index + 1}</p>
                        {acertos !== null && (
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            acertos >= 14 ? 'bg-yellow-100 text-yellow-800' :
                            acertos >= 11 ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-600'
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
    </div>
  )
}
