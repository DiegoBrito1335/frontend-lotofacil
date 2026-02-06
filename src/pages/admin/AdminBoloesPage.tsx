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
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)

  useEffect(() => {
    loadBoloes()
  }, [filtro])

  const loadBoloes = async () => {
    try {
      setLoading(true)
      const data = await adminService.listarBoloes(filtro)
      setBoloes(data)
    } catch {
      // silently handle
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    setStatusMenuOpen(null)
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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link to="/admin" className="text-text-muted hover:text-text">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-text">Gerenciar Bolões</h1>
            <p className="text-text-muted text-sm mt-1">{boloes.length} bolão(ões) encontrado(s)</p>
          </div>
        </div>
        <Link
          to="/admin/boloes/novo"
          className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold text-sm px-4 py-2 rounded-lg no-underline transition-colors"
        >
          <Plus className="w-4 h-4" />
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
                : 'bg-bg text-text-muted hover:bg-gray-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : boloes.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-xl border border-border">
          <p className="text-text-muted">Nenhum bolão encontrado</p>
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-bg">
                  <th className="text-left p-3 font-medium text-text-muted">Nome</th>
                  <th className="text-left p-3 font-medium text-text-muted">Concurso</th>
                  <th className="text-left p-3 font-medium text-text-muted">Status</th>
                  <th className="text-right p-3 font-medium text-text-muted">Valor/Cota</th>
                  <th className="text-right p-3 font-medium text-text-muted">Cotas</th>
                  <th className="text-right p-3 font-medium text-text-muted">Vendidas</th>
                  <th className="text-right p-3 font-medium text-text-muted">Receita</th>
                  <th className="text-right p-3 font-medium text-text-muted">Ações</th>
                </tr>
              </thead>
              <tbody>
                {boloes.map((b) => {
                  const vendidas = b.cotas_vendidas ?? (b.total_cotas - b.cotas_disponiveis)
                  const receita = b.receita_total ?? vendidas * Number(b.valor_cota)
                  return (
                    <tr key={b.id} className="border-b border-border hover:bg-bg/50">
                      <td className="p-3">
                        <Link to={`/bolao/${b.id}`} className="font-medium text-text hover:text-primary no-underline">
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
                        <div className="relative">
                          <button
                            onClick={() => setStatusMenuOpen(statusMenuOpen === b.id ? null : b.id)}
                            disabled={updatingStatus === b.id}
                            className="flex items-center gap-1 bg-transparent border-0 cursor-pointer p-0"
                          >
                            <StatusBadge status={b.status} />
                            <ChevronDown className="w-3 h-3 text-text-muted" />
                          </button>
                          {statusMenuOpen === b.id && (
                            <>
                              <div
                                className="fixed inset-0 z-10"
                                onClick={() => setStatusMenuOpen(null)}
                              />
                              <div className="absolute left-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-border py-1 z-20 min-w-35">
                                {STATUS_OPTIONS.filter((s) => s.value !== b.status).map((s) => (
                                  <button
                                    key={s.value}
                                    onClick={() => handleStatusChange(b.id, s.value)}
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
                            className="p-1.5 rounded hover:bg-blue-50 text-text-muted hover:text-primary no-underline"
                          >
                            <PenLine className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDeletar(b.id)}
                            title="Deletar bolão"
                            className="p-1.5 rounded hover:bg-red-50 text-danger bg-transparent border-0 cursor-pointer"
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
