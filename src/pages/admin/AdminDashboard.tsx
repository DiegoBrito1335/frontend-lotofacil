import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { adminService } from '@/services/adminService'
import type { QuickStats, Atividade } from '@/types'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { BarChart3, Users, Ticket, DollarSign, Clock, Plus, List } from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState<QuickStats | null>(null)
  const [atividades, setAtividades] = useState<Atividade[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [statsData, atividadesData] = await Promise.all([
        adminService.getQuickStats(),
        adminService.getActivity(),
      ])
      setStats(statsData)
      setAtividades(atividadesData)
    } catch (err) {
      console.error('Erro ao carregar dashboard:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingSpinner text="Carregando dashboard..." />

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text">Painel Admin</h1>
          <p className="text-text-muted text-sm mt-1">Visão geral do sistema</p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/admin/boloes"
            className="flex items-center gap-2 bg-bg border border-border text-text font-medium text-sm px-4 py-2 rounded-lg no-underline hover:bg-gray-100 transition-colors"
          >
            <List className="w-4 h-4" />
            Gerenciar Bolões
          </Link>
          <Link
            to="/admin/boloes/novo"
            className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold text-sm px-4 py-2 rounded-lg no-underline transition-colors"
          >
            <Plus className="w-4 h-4" />
            Novo Bolão
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center gap-2 text-text-muted text-sm mb-1">
              <BarChart3 className="w-4 h-4" />
              Bolões Ativos
            </div>
            <p className="text-2xl font-bold">{stats.boloes_ativos}</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center gap-2 text-text-muted text-sm mb-1">
              <Ticket className="w-4 h-4" />
              Cotas Vendidas
            </div>
            <p className="text-2xl font-bold">{stats.total_cotas_vendidas}</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center gap-2 text-text-muted text-sm mb-1">
              <DollarSign className="w-4 h-4" />
              Receita Total
            </div>
            <p className="text-2xl font-bold text-primary">R$ {stats.receita_total.toFixed(2)}</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center gap-2 text-text-muted text-sm mb-1">
              <Users className="w-4 h-4" />
              Usuários
            </div>
            <p className="text-2xl font-bold">{stats.total_usuarios}</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center gap-2 text-text-muted text-sm mb-1">
              <Clock className="w-4 h-4" />
              Pgtos Pendentes
            </div>
            <p className="text-2xl font-bold text-accent">{stats.pagamentos_pendentes}</p>
          </div>
        </div>
      )}

      {/* Atividade Recente */}
      <div className="bg-card rounded-xl border border-border p-5">
        <h2 className="font-semibold text-lg mb-4">Atividade Recente</h2>

        {atividades.length === 0 ? (
          <p className="text-text-muted text-sm text-center py-6">Nenhuma atividade recente</p>
        ) : (
          <div className="space-y-3">
            {atividades.map((ativ, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${ativ.tipo === 'compra_cota' ? 'bg-primary' : 'bg-accent'}`} />
                  <div>
                    <p className="text-sm">{ativ.descricao}</p>
                    <p className="text-xs text-text-muted">
                      {new Date(ativ.data).toLocaleDateString('pt-BR', {
                        day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit',
                      })}
                      {' '}&middot; {ativ.usuario_id.slice(0, 8)}...
                    </p>
                  </div>
                </div>
                <span className="font-semibold text-sm">R$ {ativ.valor.toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
