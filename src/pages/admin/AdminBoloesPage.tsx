import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { adminService } from '@/services/adminService'
import type { Bolao } from '@/types'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import StatusBadge from '@/components/ui/StatusBadge'
import { Plus, Trash2, ArrowLeft, ChevronDown, PenLine } from 'lucide-react'

const STATUS_OPTIONS = [
  { value: 'aberto', label: 'Aberto' },
  { value: 'fechado', label: 'Fechado' },
  { value: 'apurado', label: 'Apurado' },
  { value: 'cancelado', label: 'Cancelado' },
]

const STATUS_CONFIRM_MSG: Record<string, string> = {
  aberto: 'Deseja reabrir este bolão? Novas compras serão permitidas.',
  fechado: 'Deseja fechar este bolão? Novas compras serão impedidas.',
  apurado: 'Deseja marcar este bolão como apurado? Esta ação indica que o resultado foi conferido.',
  cancelado: 'Deseja cancelar este bolão?',
}

export default function AdminBoloesPage() {
  const [boloes, setBoloes] = useState<Bolao[]>([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState<string | undefined>(undefined)
  const [statusMenuOpen, setStatusMenuOpen] = useState<string | null>(null)
  const [statusMenuPos, setStatusMenuPos] = useState<{ top: number; left: number } | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)

  useEffect(() => {
    loadBoloes()
  }, [filtro])

  const loadBoloes = async () => {
    try {
      setLoading(true)
      const data = await adminService.listarBoloes(filtro)
      setBoloes(data)
    } catch (err) {
      console.error('Erro ao carregar bolões:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    setStatusMenuOpen(null)
    setStatusMenuPos(null)
    const msg = STATUS_CONFIRM_MSG[newStatus] || `Deseja alterar o status para "${newStatus}"?`
    if (!confirm(msg)) return
    try {
      setUpdatingStatus(id)
      await adminService.atualizarBolao(id, { status: newStatus })
      await loadBoloes()
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } }
      alert(error.response?.data?.detail || 'Erro ao alterar status')
    } finally {
      setUpdatingStatus(null)
    }
  }

  const handleDeletar = async (id: string) => {
    if (!confirm('Deseja deletar este bolão? Esta ação é irreversível.')) return
    try {
      await adminService.deletarBolao(id)
      await loadBoloes()
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } }
      alert(error.response?.data?.detail || 'Erro ao deletar bolão')
    }
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 float-up">
        <div className="flex items-center gap-4">
          <Link to="/admin" className="w-12 h-12 flex items-center justify-center rounded-2xl bg-card border border-border text-text-muted hover:text-primary hover:border-primary/30 transition-all shadow-sm">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-4xl font-black text-text tracking-tight">Gerenciar <span className="text-primary">Bolões</span></h1>
            <p className="text-text-muted font-medium mt-1">{boloes.length} registros no sistema</p>
          </div>
        </div>
        <Link
          to="/admin/boloes/novo"
          className="flex items-center justify-center gap-2 btn-gradient text-white font-black text-base px-8 py-4 rounded-2xl no-underline shadow-lg shadow-green-600/20 active:scale-95 transition-all"
        >
          <Plus className="w-5 h-5" />
          Novo Bolão
        </Link>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {[
          { label: 'Todos', value: undefined },
          { label: 'Abertos', value: 'aberto' },
          { label: 'Fechados', value: 'fechado' },
          { label: 'Apurados', value: 'apurado' },
          { label: 'Cancelados', value: 'cancelado' },
        ].map((f) => (
            <button
              key={f.label}
              onClick={() => setFiltro(f.value)}
              className={`px-3 py-1.5 text-xs rounded-lg border-0 cursor-pointer transition-colors font-medium ${
                filtro === f.value
                  ? 'bg-primary text-white'
                  : 'bg-bg text-text-muted hover:bg-bg/80'
              }`}
            >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center gap-4 bg-bg/50 backdrop-blur-sm rounded-[32px] border border-border">
          <LoadingSpinner />
          <p className="text-text-muted font-bold uppercase tracking-widest text-xs">Sincronizando Banco...</p>
        </div>
      ) : boloes.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-[32px] border border-border shadow-sm float-up">
           <div className="w-16 h-16 bg-bg rounded-full flex items-center justify-center mx-auto mb-4">
             <ArrowLeft className="w-8 h-8 text-text-muted/40" />
           </div>
           <p className="text-text-muted font-bold">Nenhum bolão encontrado</p>
        </div>
      ) : (
        <div className="bg-card rounded-[32px] border border-border overflow-hidden shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] float-up float-up-delay-1">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-separate border-spacing-0">
              <thead>
                <tr>
                  <th className="text-left py-5 px-6 font-bold text-text-muted uppercase tracking-widest text-[10px] bg-bg/50 border-b border-border">Nome</th>
                  <th className="text-left py-5 px-6 font-bold text-text-muted uppercase tracking-widest text-[10px] bg-bg/50 border-b border-border">Concurso</th>
                  <th className="text-left py-5 px-6 font-bold text-text-muted uppercase tracking-widest text-[10px] bg-bg/50 border-b border-border">Status</th>
                  <th className="text-right py-5 px-6 font-bold text-text-muted uppercase tracking-widest text-[10px] bg-bg/50 border-b border-border">Valor/Cota</th>
                  <th className="text-right py-5 px-6 font-bold text-text-muted uppercase tracking-widest text-[10px] bg-bg/50 border-b border-border">Cotas</th>
                  <th className="text-right py-5 px-6 font-bold text-text-muted uppercase tracking-widest text-[10px] bg-bg/50 border-b border-border">Pendentes</th>
                  <th className="text-right py-5 px-6 font-bold text-text-muted uppercase tracking-widest text-[10px] bg-bg/50 border-b border-border">Receita</th>
                  <th className="text-right py-5 px-6 font-bold text-text-muted uppercase tracking-widest text-[10px] bg-bg/50 border-b border-border">Ações</th>
                </tr>
              </thead>
              <tbody>
                {boloes.map((b) => {
                  const vendidas = b.cotas_vendidas ?? (b.total_cotas - b.cotas_disponiveis)
                  const receita = b.receita_total ?? vendidas * Number(b.valor_cota)
                  return (
                    <tr key={b.id} className="hover:bg-bg/50 transition-colors group">
                      <td className="py-4 px-6">
                        <Link to={`/bolao/${b.id}`} className="font-black text-text hover:text-primary no-underline transition-colors block">
                          {b.nome}
                        </Link>
                      </td>
                      <td className="p-3 text-text-muted">
                        {b.concurso_fim
                          ? <span>{b.concurso_numero}-{b.concurso_fim} <span className="text-xs text-primary font-medium">(Teimosinha)</span></span>
                          : b.concurso_numero
                        }
                      </td>
                      <td className="p-3">
                        <div>
                          <button
                            onClick={(e) => {
                              if (statusMenuOpen === b.id) {
                                setStatusMenuOpen(null)
                                setStatusMenuPos(null)
                              } else {
                                const rect = e.currentTarget.getBoundingClientRect()
                                setStatusMenuPos({ top: rect.bottom + 4, left: rect.left })
                                setStatusMenuOpen(b.id)
                              }
                            }}
                            disabled={updatingStatus === b.id}
                            aria-label={`Alterar status: ${b.status}`}
                            className="flex items-center gap-1 bg-transparent border-0 cursor-pointer p-0"
                          >
                            <StatusBadge status={b.status} />
                            <ChevronDown className="w-3 h-3 text-text-muted" />
                          </button>
                          {statusMenuOpen === b.id && statusMenuPos && (
                            <>
                              <div
                                className="fixed inset-0 z-40"
                                onClick={() => { setStatusMenuOpen(null); setStatusMenuPos(null) }}
                              />
                              <div
                                className="fixed bg-white rounded-lg shadow-lg border border-border py-1 z-50 min-w-35"
                                style={{ top: statusMenuPos.top, left: statusMenuPos.left }}
                              >
                                {STATUS_OPTIONS.filter((s) => s.value !== b.status).map((s) => (
                                  <button
                                    key={s.value}
                                    onClick={() => handleStatusChange(b.id, s.value)}
                                    aria-label={`Mudar para ${s.value}`}
                                    className="w-full text-left px-3 py-2 text-sm hover:bg-bg cursor-pointer bg-transparent border-0 flex items-center gap-2"
                                  >
                                    <StatusBadge status={s.value} />
                                  </button>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-right">R$ {Number(b.valor_cota).toFixed(2)}</td>
                      <td className="p-3 text-right">{b.total_cotas}</td>
                      <td className="p-3 text-right">{vendidas}</td>
                      <td className="p-3 text-right font-medium text-primary">R$ {receita.toFixed(2)}</td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            to={`/admin/boloes/${b.id}`}
                            title="Editar bolão"
                            className="p-1.5 rounded hover:bg-primary/10 text-text-muted hover:text-primary no-underline transition-colors"
                          >
                            <PenLine className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDeletar(b.id)}
                            title="Deletar bolão"
                            className="p-1.5 rounded hover:bg-danger/10 text-danger bg-transparent border-0 cursor-pointer transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
