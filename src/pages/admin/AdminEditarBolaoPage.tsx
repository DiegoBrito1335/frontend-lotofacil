import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { adminService } from '@/services/adminService'
import { bolaoService } from '@/services/bolaoService'
import type { Bolao, Jogo, ApuracaoResponse, ResultadoConcurso, StatusConcurso } from '@/types'
import NumberPicker from '@/components/NumberPicker'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import StatusBadge from '@/components/ui/StatusBadge'
import {
  ArrowLeft,
  Save,
  Hash,
  Trash2,
  Zap,
  PenLine,
  Trophy,
  CheckCircle,
  AlertCircle,
  Upload,
} from 'lucide-react'

export default function AdminEditarBolaoPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [bolao, setBolao] = useState<Bolao | null>(null)
  const [jogos, setJogos] = useState<Jogo[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [addingJogo, setAddingJogo] = useState(false)
  const [removingJogo, setRemovingJogo] = useState<string | null>(null)
  const [apurando, setApurando] = useState(false)
  const [resultado, setResultado] = useState<ApuracaoResponse | null>(null)
  const [resultadosTeimosinha, setResultadosTeimosinha] = useState<ResultadoConcurso[]>([])
  const [resumoGeral, setResumoGeral] = useState<Record<number, number>>({})
  const [modoApuracao, setModoApuracao] = useState<'auto' | 'manual' | null>(null)
  const [concursoExpandido, setConcursoExpandido] = useState<number | null>(null)
  const [statusConcursos, setStatusConcursos] = useState<StatusConcurso[]>([])
  const [apurandoConcurso, setApurandoConcurso] = useState<number | null>(null)
  const [premioTotalGeral, setPremioTotalGeral] = useState(0)
  const [uploadingCSV, setUploadingCSV] = useState(false)
  const [modoAddJogo, setModoAddJogo] = useState<'picker' | 'csv'>('picker')
  const [mensagem, setMensagem] = useState<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(null)

  const [form, setForm] = useState({
    nome: '',
    descricao: '',
    concurso_numero: '',
    total_cotas: '',
    valor_cota: '',
  })

  useEffect(() => {
    if (id) loadData(id)
  }, [id])

  const loadData = async (bolaoId: string) => {
    try {
      setLoading(true)
      const [bolaoData, jogosData] = await Promise.all([
        bolaoService.getById(bolaoId),
        bolaoService.getJogos(bolaoId),
      ])
      setBolao(bolaoData)
      setJogos(jogosData)
      setForm({
        nome: bolaoData.nome,
        descricao: bolaoData.descricao || '',
        concurso_numero: String(bolaoData.concurso_numero),
        total_cotas: String(bolaoData.total_cotas),
        valor_cota: String(bolaoData.valor_cota),
      })

      // Carregar resultado se apurado (ou parcialmente apurado para teimosinha)
      const isTeimosinha = bolaoData.concurso_fim && bolaoData.concurso_fim > bolaoData.concurso_numero
      if (bolaoData.status === 'apurado' || (isTeimosinha && (bolaoData.concursos_apurados ?? 0) > 0)) {
        try {
          const res = await adminService.getResultado(bolaoId)
          if (res.teimosinha && res.resultados) {
            setResultadosTeimosinha(res.resultados)
            setResumoGeral(res.resumo_geral || {})
          } else {
            setResultado(res)
          }
        } catch (err) {
          console.debug('Resultado ainda não disponível:', err)
        }
      }

      // Carregar status de concursos individuais (teimosinha)
      if (isTeimosinha) {
        try {
          const statusData = await adminService.getStatusApuracao(bolaoId)
          if (statusData.concursos) {
            setStatusConcursos(statusData.concursos)
            setPremioTotalGeral(statusData.premio_total_geral || 0)
          }
        } catch (err) {
          console.debug('Status de concursos não disponível:', err)
        }
      }
    } catch {
      setMensagem({ tipo: 'erro', texto: 'Erro ao carregar bolão' })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!id) return
    try {
      setSaving(true)
      setMensagem(null)
      await adminService.atualizarBolao(id, {
        nome: form.nome,
        descricao: form.descricao || undefined,
        concurso_numero: parseInt(form.concurso_numero),
        total_cotas: parseInt(form.total_cotas),
        valor_cota: parseFloat(form.valor_cota),
      })
      setMensagem({ tipo: 'sucesso', texto: 'Bolão atualizado com sucesso!' })
      await loadData(id)
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } }
      setMensagem({ tipo: 'erro', texto: error.response?.data?.detail || 'Erro ao salvar' })
    } finally {
      setSaving(false)
    }
  }

  const handleAddJogo = async (dezenas: number[]) => {
    if (!id) return
    try {
      setAddingJogo(true)
      setMensagem(null)
      await adminService.adicionarJogos(id, { jogos: [{ dezenas }] })
      const jogosData = await bolaoService.getJogos(id)
      setJogos(jogosData)
      setMensagem({ tipo: 'sucesso', texto: 'Jogo adicionado com sucesso!' })
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } }
      setMensagem({ tipo: 'erro', texto: error.response?.data?.detail || 'Erro ao adicionar jogo' })
    } finally {
      setAddingJogo(false)
    }
  }

  const handleRemoveJogo = async (jogoId: string) => {
    if (!id || !confirm('Deseja remover este jogo?')) return
    try {
      setRemovingJogo(jogoId)
      await adminService.removerJogo(id, jogoId)
      setJogos((prev) => prev.filter((j) => j.id !== jogoId))
      setMensagem({ tipo: 'sucesso', texto: 'Jogo removido' })
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } }
      setMensagem({ tipo: 'erro', texto: error.response?.data?.detail || 'Erro ao remover jogo' })
    } finally {
      setRemovingJogo(null)
    }
  }

  const handleUploadCSV = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!id || !e.target.files?.[0]) return
    const file = e.target.files[0]
    try {
      setUploadingCSV(true)
      setMensagem(null)
      const res = await adminService.uploadJogosCSV(id, file)
      const jogosData = await bolaoService.getJogos(id)
      setJogos(jogosData)
      const errosMsg = res.erros.length > 0 ? ` | Erros: ${res.erros.join('; ')}` : ''
      setMensagem({
        tipo: res.total_importados > 0 ? 'sucesso' : 'erro',
        texto: `${res.total_importados} jogo${res.total_importados !== 1 ? 's' : ''} importado${res.total_importados !== 1 ? 's' : ''}${errosMsg}`,
      })
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } }
      setMensagem({ tipo: 'erro', texto: error.response?.data?.detail || 'Erro ao importar CSV' })
    } finally {
      setUploadingCSV(false)
      e.target.value = ''
    }
  }

  const handleApurarAutomatico = async () => {
    if (!id) return
    try {
      setApurando(true)
      setMensagem(null)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await adminService.apurarAutomatico(id)

      // Teimosinha retorna formato diferente
      if (res.resultados) {
        setResultadosTeimosinha(res.resultados)
        setResumoGeral(res.resumo_geral || {})
        const erros: string[] = res.erros || []
        if (erros.length > 0) {
          setMensagem({ tipo: 'erro', texto: `Apuração parcial. Erros: ${erros.join('; ')}` })
        } else {
          setMensagem({ tipo: 'sucesso', texto: `Apuração teimosinha concluída! ${res.resultados.length} concursos apurados.` })
        }
      } else {
        setResultado(res)
        setMensagem({ tipo: 'sucesso', texto: 'Apuração realizada com sucesso!' })
      }

      await loadData(id)
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } }
      setMensagem({ tipo: 'erro', texto: error.response?.data?.detail || 'Erro na apuração automática' })
    } finally {
      setApurando(false)
    }
  }

  const handleApurarManual = async (dezenas: number[]) => {
    if (!id) return
    try {
      setApurando(true)
      setMensagem(null)
      const res = await adminService.apurarManual(id, dezenas)
      setResultado(res)
      setMensagem({ tipo: 'sucesso', texto: 'Apuração realizada com sucesso!' })
      await loadData(id)
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } }
      setMensagem({ tipo: 'erro', texto: error.response?.data?.detail || 'Erro na apuração manual' })
    } finally {
      setApurando(false)
    }
  }

  const handleApurarConcurso = async (concursoNumero: number) => {
    if (!id) return
    try {
      setApurandoConcurso(concursoNumero)
      setMensagem(null)
      const res = await adminService.apurarConcurso(id, concursoNumero)
      setMensagem({
        tipo: 'sucesso',
        texto: `Concurso ${concursoNumero} apurado! Prêmio: R$ ${(res.premio_total || 0).toFixed(2)}`,
      })
      await loadData(id)
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } }
      setMensagem({ tipo: 'erro', texto: error.response?.data?.detail || `Erro ao apurar concurso ${concursoNumero}` })
    } finally {
      setApurandoConcurso(null)
    }
  }

  const handleApurarPendentes = async () => {
    if (!id) return
    try {
      setApurando(true)
      setMensagem(null)
      const res = await adminService.apurarPendentes(id)
      const novos = res.resultados?.length || 0
      const erros: string[] = res.erros || []
      if (novos > 0) {
        setMensagem({
          tipo: 'sucesso',
          texto: `${novos} concurso${novos > 1 ? 's' : ''} apurado${novos > 1 ? 's' : ''}! Prêmio total: R$ ${(res.premio_total_geral || 0).toFixed(2)}${erros.length > 0 ? ` | Erros: ${erros.join('; ')}` : ''}`,
        })
      } else if (erros.length > 0) {
        setMensagem({ tipo: 'erro', texto: `Nenhum concurso novo apurado. ${erros.join('; ')}` })
      } else {
        setMensagem({ tipo: 'sucesso', texto: 'Todos os concursos já estavam apurados.' })
      }
      await loadData(id)
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } }
      setMensagem({ tipo: 'erro', texto: error.response?.data?.detail || 'Erro ao apurar pendentes' })
    } finally {
      setApurando(false)
    }
  }

  if (loading) return <LoadingSpinner text="Carregando bolão..." />
  if (!bolao) return <div className="text-center py-12 text-danger">Bolão não encontrado</div>

  const isTeimosinha = !!(bolao.concurso_fim && bolao.concurso_fim > bolao.concurso_numero)
  const isApurado = bolao.status === 'apurado'
  const canEdit = !isApurado
  const canAddJogos = canEdit
  const canApurar = jogos.length > 0 && !isApurado
  const resultadoDezenas = resultado?.resultado_dezenas || bolao.resultado_dezenas
  const resultadoSet = resultadoDezenas ? new Set(resultadoDezenas) : null

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate('/admin/boloes')}
        className="flex items-center gap-1 text-text-muted hover:text-text mb-4 bg-transparent border-0 cursor-pointer text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar para Bolões
      </button>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{bolao.nome}</h1>
          <p className="text-text-muted mt-1">
            {bolao.concurso_fim && bolao.concurso_fim > bolao.concurso_numero
              ? <>Concursos {bolao.concurso_numero} a {bolao.concurso_fim} <span className="text-primary font-medium">(Teimosinha — {bolao.concurso_fim - bolao.concurso_numero + 1} concursos)</span></>
              : <>Concurso {bolao.concurso_numero}</>
            }
          </p>
          {bolao.concurso_fim && bolao.concurso_fim > bolao.concurso_numero && (bolao.concursos_apurados ?? 0) > 0 && (
            <p className="text-xs text-text-muted mt-1">
              {bolao.concursos_apurados} de {bolao.concurso_fim - bolao.concurso_numero + 1} concursos apurados
            </p>
          )}
        </div>
        <StatusBadge status={bolao.status} />
      </div>

      {/* Mensagens */}
      {mensagem && (
        <div className={`flex items-start gap-2 p-3 rounded-lg text-sm mb-4 ${
          mensagem.tipo === 'sucesso' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {mensagem.tipo === 'sucesso' ? <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" /> : <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />}
          <span>{mensagem.texto}</span>
        </div>
      )}

      {/* Seção 1: Dados do bolão */}
      {canEdit && (
        <div className="bg-card rounded-xl border border-border p-6 mb-4">
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <PenLine className="w-5 h-5 text-primary" />
            Dados do Bolão
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1">Nome</label>
              <input
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                className="w-full px-3 py-2.5 border border-border rounded-lg bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-1">Descrição</label>
              <textarea
                value={form.descricao}
                onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                rows={2}
                className="w-full px-3 py-2.5 border border-border rounded-lg bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-text mb-1">Concurso</label>
                <input
                  type="number"
                  value={form.concurso_numero}
                  onChange={(e) => setForm({ ...form, concurso_numero: e.target.value })}
                  className="w-full px-3 py-2.5 border border-border rounded-lg bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-1">Total de Cotas</label>
                <input
                  type="number"
                  value={form.total_cotas}
                  onChange={(e) => setForm({ ...form, total_cotas: e.target.value })}
                  className="w-full px-3 py-2.5 border border-border rounded-lg bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-1">Valor/Cota (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={form.valor_cota}
                  onChange={(e) => setForm({ ...form, valor_cota: e.target.value })}
                  className="w-full px-3 py-2.5 border border-border rounded-lg bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors border-0 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </div>
      )}

      {/* Seção 2: Jogos */}
      <div className="bg-card rounded-xl border border-border p-6 mb-4">
        <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <Hash className="w-5 h-5 text-primary" />
          Jogos ({jogos.length})
        </h2>

        {/* Resultado sorteado (concurso único) */}
        {!isTeimosinha && resultadoDezenas && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p className="text-xs font-semibold text-yellow-800 mb-2">Resultado do Concurso {bolao.concurso_numero}</p>
            <div className="flex flex-wrap gap-2">
              {resultadoDezenas.sort((a, b) => a - b).map((d) => (
                <span key={d} className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-yellow-500 text-white font-bold text-sm shadow-sm">
                  {String(d).padStart(2, '0')}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Resultados teimosinha (por concurso) */}
        {isTeimosinha && resultadosTeimosinha.length > 0 && (
          <div className="mb-4 space-y-2">
            <p className="text-xs font-semibold text-text mb-2">Resultados por Concurso</p>
            {resultadosTeimosinha.map((res) => (
              <div key={res.concurso_numero} className="bg-yellow-50 border border-yellow-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setConcursoExpandido(concursoExpandido === res.concurso_numero ? null : res.concurso_numero)}
                  className="w-full flex items-center justify-between p-3 bg-transparent border-0 cursor-pointer text-left"
                >
                  <span className="text-sm font-semibold text-yellow-800">Concurso {res.concurso_numero}</span>
                  <div className="flex items-center gap-2">
                    {res.premio_total !== undefined && res.premio_total > 0 && (
                      <span className="text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded font-medium">
                        R$ {res.premio_total.toFixed(2)}
                      </span>
                    )}
                    {[15, 14, 13].map((n) => res.resumo[n] > 0 && (
                      <span key={n} className="text-xs bg-yellow-200 text-yellow-800 px-1.5 py-0.5 rounded font-medium">
                        {res.resumo[n]}x {n}ac
                      </span>
                    ))}
                    <span className="text-xs text-yellow-600">{concursoExpandido === res.concurso_numero ? '▲' : '▼'}</span>
                  </div>
                </button>
                {concursoExpandido === res.concurso_numero && (
                  <div className="p-3 pt-0 space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {res.dezenas.sort((a, b) => a - b).map((d) => (
                        <span key={d} className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-yellow-500 text-white font-bold text-xs shadow-sm">
                          {String(d).padStart(2, '0')}
                        </span>
                      ))}
                    </div>
                    <div className="grid grid-cols-5 gap-2 bg-white/50 rounded-lg p-2">
                      {[15, 14, 13, 12, 11].map((n) => (
                        <div key={n} className="text-center">
                          <p className="text-sm font-bold text-primary">{res.resumo[n] || 0}</p>
                          <p className="text-[10px] text-text-muted">{n} ac</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Resumo geral teimosinha */}
            {Object.values(resumoGeral).some((v) => v > 0) && (
              <div className="bg-primary/10 rounded-lg p-4">
                <p className="text-xs font-semibold text-primary mb-2">Resumo Geral (todos os concursos)</p>
                <div className="grid grid-cols-5 gap-2">
                  {[15, 14, 13, 12, 11].map((n) => (
                    <div key={n} className="text-center">
                      <p className="text-lg font-bold text-primary">{resumoGeral[n] || 0}</p>
                      <p className="text-xs text-text-muted">{n} acertos</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Lista de jogos */}
        {jogos.length === 0 ? (
          <p className="text-text-muted text-sm mb-4">Nenhum jogo cadastrado ainda.</p>
        ) : (
          <div className="space-y-3 mb-4">
            {jogos.map((jogo, index) => {
              const acertos = jogo.acertos ?? (resultadoSet ? jogo.dezenas.filter((d) => resultadoSet.has(d)).length : null)
              return (
                <div key={jogo.id} className="bg-bg rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-text-muted font-medium">Jogo {index + 1}</p>
                    <div className="flex items-center gap-2">
                      {acertos !== null && (
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          acertos >= 14 ? 'bg-yellow-100 text-yellow-800' :
                          acertos >= 11 ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {acertos} acertos
                        </span>
                      )}
                      {canAddJogos && (
                        <button
                          onClick={() => handleRemoveJogo(jogo.id)}
                          disabled={removingJogo === jogo.id}
                          className="p-1 rounded hover:bg-red-50 text-danger bg-transparent border-0 cursor-pointer"
                          title="Remover jogo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {jogo.dezenas.sort((a, b) => a - b).map((dezena) => {
                      const acertou = resultadoSet?.has(dezena)
                      return (
                        <span
                          key={dezena}
                          className={
                            resultadoSet
                              ? acertou
                                ? 'numero-acerto'
                                : 'numero-erro'
                              : 'numero-bolao'
                          }
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

        {/* Resumo de acertos */}
        {resultado && (
          <div className="bg-bg rounded-lg p-4 mb-4">
            <p className="text-xs font-semibold text-text mb-2">Resumo da Apuração</p>
            <div className="grid grid-cols-5 gap-2">
              {[15, 14, 13, 12, 11].map((n) => (
                <div key={n} className="text-center">
                  <p className="text-lg font-bold text-primary">{resultado.resumo[n] || 0}</p>
                  <p className="text-xs text-text-muted">{n} acertos</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Adicionar jogos */}
        {canAddJogos && (
          <div className="border-t border-border pt-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-text">Adicionar jogos</p>
              <div className="flex gap-1 bg-bg rounded-lg p-0.5">
                <button
                  onClick={() => setModoAddJogo('picker')}
                  className={`text-xs px-3 py-1.5 rounded-md border-0 cursor-pointer transition-colors ${
                    modoAddJogo === 'picker' ? 'bg-primary text-white font-medium' : 'bg-transparent text-text-muted hover:text-text'
                  }`}
                >
                  Manual
                </button>
                <button
                  onClick={() => setModoAddJogo('csv')}
                  className={`text-xs px-3 py-1.5 rounded-md border-0 cursor-pointer transition-colors ${
                    modoAddJogo === 'csv' ? 'bg-primary text-white font-medium' : 'bg-transparent text-text-muted hover:text-text'
                  }`}
                >
                  Importar CSV
                </button>
              </div>
            </div>

            {modoAddJogo === 'picker' ? (
              <NumberPicker onConfirm={handleAddJogo} disabled={addingJogo} />
            ) : (
              <div className="space-y-3">
                <div className="bg-bg rounded-lg p-4 text-center border-2 border-dashed border-border">
                  <Upload className="w-8 h-8 text-text-muted mx-auto mb-2" />
                  <p className="text-sm text-text-muted mb-1">Selecione um arquivo CSV</p>
                  <p className="text-xs text-text-muted mb-3">Um jogo por linha, 15 numeros separados por virgula ou ponto-e-virgula</p>
                  <label className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-medium text-sm px-4 py-2 rounded-lg cursor-pointer transition-colors">
                    <Upload className="w-4 h-4" />
                    {uploadingCSV ? 'Importando...' : 'Escolher Arquivo'}
                    <input
                      type="file"
                      accept=".csv,.txt"
                      onChange={handleUploadCSV}
                      disabled={uploadingCSV}
                      className="hidden"
                    />
                  </label>
                </div>
                <div className="bg-bg rounded-lg p-3">
                  <p className="text-xs font-semibold text-text mb-1">Exemplo de CSV:</p>
                  <pre className="text-xs text-text-muted font-mono whitespace-pre-wrap">
{`01,03,05,07,09,10,12,14,16,18,20,21,23,24,25
02,04,06,08,10,11,13,15,17,19,21,22,23,24,25
03,05,07,09,11,12,14,16,18,20,22,23,24,25,01`}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Seção 3: Apuração */}
      {canApurar && (
        <div className="bg-card rounded-xl border border-border p-6 mb-4">
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            Apuração
            {isTeimosinha && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                Teimosinha — {bolao.concursos_apurados || 0} de {bolao.concurso_fim! - bolao.concurso_numero + 1} concursos
              </span>
            )}
          </h2>

          <div className="space-y-4">
            {/* Teimosinha: lista de concursos individuais */}
            {isTeimosinha && statusConcursos.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-text-muted">Concursos Individuais</p>

                {premioTotalGeral > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center justify-between">
                    <span className="text-sm font-medium text-green-800">Prêmio Total Distribuído</span>
                    <span className="text-lg font-bold text-green-700">R$ {premioTotalGeral.toFixed(2)}</span>
                  </div>
                )}

                <div className="max-h-64 overflow-y-auto space-y-1 border border-border rounded-lg p-2">
                  {statusConcursos.map((sc) => (
                    <div
                      key={sc.concurso_numero}
                      className={`flex items-center justify-between p-2 rounded-lg text-sm ${
                        sc.apurado ? 'bg-green-50' : 'bg-bg'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {sc.apurado ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-text-muted" />
                        )}
                        <span className="font-medium">Concurso {sc.concurso_numero}</span>
                        {sc.apurado && sc.premio_total !== undefined && sc.premio_total > 0 && (
                          <span className="text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded font-medium">
                            R$ {sc.premio_total.toFixed(2)}
                          </span>
                        )}
                        {sc.apurado && (sc.premio_total === undefined || sc.premio_total === 0) && (
                          <span className="text-xs text-text-muted">Sem prêmio</span>
                        )}
                      </div>
                      {!sc.apurado && (
                        <button
                          onClick={() => handleApurarConcurso(sc.concurso_numero)}
                          disabled={apurandoConcurso !== null || apurando}
                          className="flex items-center gap-1 text-xs bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 text-white font-medium px-3 py-1.5 rounded-lg transition-colors border-0 cursor-pointer"
                        >
                          {apurandoConcurso === sc.concurso_numero ? (
                            'Apurando...'
                          ) : (
                            <>
                              <Zap className="w-3 h-3" />
                              Apurar
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Botão apurar todos pendentes */}
                <button
                  onClick={handleApurarPendentes}
                  disabled={apurando || apurandoConcurso !== null}
                  className="w-full flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-lg transition-colors border-0 cursor-pointer text-sm"
                >
                  <Zap className="w-4 h-4" />
                  {apurando ? 'Apurando pendentes...' : 'Apurar Todos os Pendentes'}
                </button>
              </div>
            )}

            {/* Teimosinha sem status carregado: botão fallback */}
            {isTeimosinha && statusConcursos.length === 0 && (
              <button
                onClick={handleApurarAutomatico}
                disabled={apurando}
                className="w-full flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-lg transition-colors border-0 cursor-pointer text-sm"
              >
                <Zap className="w-4 h-4" />
                {apurando ? 'Buscando resultados...' : `Apurar Todos os Concursos (${bolao.concurso_numero} a ${bolao.concurso_fim})`}
              </button>
            )}

            {/* Concurso único */}
            {!isTeimosinha && (
              <>
                <button
                  onClick={handleApurarAutomatico}
                  disabled={apurando}
                  className="w-full flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-lg transition-colors border-0 cursor-pointer text-sm"
                >
                  <Zap className="w-4 h-4" />
                  {apurando ? 'Buscando resultados...' : `Buscar Resultado Automático (Concurso ${bolao.concurso_numero})`}
                </button>

                <div className="text-center text-text-muted text-xs">ou</div>

                {modoApuracao === 'manual' ? (
                  <div>
                    <p className="text-sm font-semibold text-text mb-3">Informe os 15 números sorteados</p>
                    <NumberPicker
                      onConfirm={handleApurarManual}
                      disabled={apurando}
                      buttonLabel="Apurar Resultado"
                    />
                    <button
                      onClick={() => setModoApuracao(null)}
                      className="mt-2 text-xs text-text-muted hover:text-text bg-transparent border-0 cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setModoApuracao('manual')}
                    className="w-full flex items-center justify-center gap-2 bg-bg hover:bg-gray-200 text-text font-medium py-3 px-4 rounded-lg transition-colors border border-border cursor-pointer text-sm"
                  >
                    <PenLine className="w-4 h-4" />
                    Apuração Manual
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
