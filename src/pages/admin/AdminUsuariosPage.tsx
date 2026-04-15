import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { adminService } from '@/services/adminService'
import type { UsuarioAdmin } from '@/types'
import { useAuth } from '@/contexts/AuthContext'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { ArrowLeft, Shield, ShieldOff, Trash2, RefreshCw } from 'lucide-react'

export default function AdminUsuariosPage() {
  const { userId } = useAuth()
  const [usuarios, setUsuarios] = useState<UsuarioAdmin[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [mensagem, setMensagem] = useState<string | null>(null)
  const [loadingAction, setLoadingAction] = useState<string | null>(null)
  const [confirmRemover, setConfirmRemover] = useState<UsuarioAdmin | null>(null)

  useEffect(() => {
    carregarUsuarios()
  }, [])

  const carregarUsuarios = async () => {
    try {
      setLoading(true)
      setErro(null)
      const data = await adminService.listarUsuarios()
      setUsuarios(data)
    } catch (err: any) {
      setErro('Erro ao carregar usuários. Tente novamente.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handlePromover = async (usuario: UsuarioAdmin) => {
    setLoadingAction(usuario.id)
    setMensagem(null)
    setErro(null)
    try {
      const resp = await adminService.promoverAdmin(usuario.id)
      setMensagem(resp.mensagem)
      await carregarUsuarios()
    } catch (err: any) {
      setErro(err?.response?.data?.detail || 'Erro ao promover usuário.')
    } finally {
      setLoadingAction(null)
    }
  }

  const handleRebaixar = async (usuario: UsuarioAdmin) => {
    setLoadingAction(usuario.id)
    setMensagem(null)
    setErro(null)
    try {
      const resp = await adminService.rebaixarAdmin(usuario.id)
      setMensagem(resp.mensagem)
      await carregarUsuarios()
    } catch (err: any) {
      setErro(err?.response?.data?.detail || 'Erro ao rebaixar usuário.')
    } finally {
      setLoadingAction(null)
    }
  }

  const handleRemover = async (usuario: UsuarioAdmin) => {
    setConfirmRemover(null)
    setLoadingAction(usuario.id)
    setMensagem(null)
    setErro(null)
    try {
      const resp = await adminService.removerUsuario(usuario.id)
      setMensagem(resp.mensagem)
      await carregarUsuarios()
    } catch (err: any) {
      setErro(err?.response?.data?.detail || 'Erro ao remover usuário.')
    } finally {
      setLoadingAction(null)
    }
  }

  if (loading) return <LoadingSpinner text="Carregando usuários..." />

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 float-up">
        <div className="flex items-center gap-4">
          <Link to="/admin" className="w-12 h-12 flex items-center justify-center rounded-2xl bg-card border border-border text-text-muted hover:text-primary hover:border-primary/30 transition-all shadow-sm">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-4xl font-black text-text tracking-tight">Gerenciar <span className="text-primary">Usuários</span></h1>
            <p className="text-text-muted font-medium mt-1">{usuarios.length} registros no sistema</p>
          </div>
        </div>
        <button
          onClick={carregarUsuarios}
          className="flex items-center justify-center gap-2 bg-card border border-border text-text-muted font-black text-sm px-6 py-4 rounded-2xl hover:bg-bg hover:border-primary/30 transition-all shadow-sm group active:scale-95"
        >
          <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
          Sincronizar
        </button>
      </div>

      {mensagem && (
        <div className="mb-4 p-3 bg-primary/10 border border-primary/20 text-primary rounded-lg text-sm">
          {mensagem}
        </div>
      )}

      {erro && (
        <div className="mb-4 p-3 bg-danger/10 border border-danger/20 text-danger rounded-lg text-sm">
          {erro}
        </div>
      )}

      <div className="bg-card rounded-[32px] border border-border overflow-hidden shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] float-up float-up-delay-1">
        {usuarios.length === 0 ? (
          <div className="text-center py-20 px-6">
            <div className="w-16 h-16 bg-bg rounded-full flex items-center justify-center mx-auto mb-4">
               <ArrowLeft className="w-8 h-8 text-text-muted/40" />
            </div>
            <p className="text-text-muted font-bold">Nenhum usuário encontrado no sistema.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-separate border-spacing-0">
              <thead>
                <tr>
                  <th className="text-left py-5 px-6 font-bold text-text-muted uppercase tracking-widest text-[10px] bg-bg/50 border-b border-border">Nome Completo</th>
                  <th className="text-left py-5 px-6 font-bold text-text-muted uppercase tracking-widest text-[10px] bg-bg/50 border-b border-border">Acesso</th>
                  <th className="text-left py-5 px-6 font-bold text-text-muted uppercase tracking-widest text-[10px] bg-bg/50 border-b border-border hidden md:table-cell">Telefone</th>
                  <th className="text-right py-5 px-6 font-bold text-text-muted uppercase tracking-widest text-[10px] bg-bg/50 border-b border-border hidden sm:table-cell">Saldo</th>
                  <th className="text-center py-5 px-6 font-bold text-text-muted uppercase tracking-widest text-[10px] bg-bg/50 border-b border-border">Nível</th>
                  <th className="text-right py-5 px-6 font-bold text-text-muted uppercase tracking-widest text-[10px] bg-bg/50 border-b border-border">Ações</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u) => {
                  const isMe = u.id === userId
                  const isLoading = loadingAction === u.id
                  return (
                    <tr key={u.id} className="hover:bg-bg/50 transition-colors group">
                      <td className="py-4 px-6">
                        <span className="font-black text-text">
                          {u.nome || <span className="text-text-muted/40 font-medium italic">Sem nome</span>}
                        </span>
                        {isMe && (
                          <span className="ml-2 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">você</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-text-muted">{u.email}</td>
                      <td className="px-4 py-3 text-text-muted hidden md:table-cell">
                        {u.telefone || <span className="italic">—</span>}
                      </td>
                      <td className="px-4 py-3 text-right hidden sm:table-cell">
                        <span className="font-medium">R$ {u.saldo_disponivel.toFixed(2)}</span>
                        {u.saldo_bloqueado > 0 && (
                          <span className="block text-xs text-text-muted">+R$ {u.saldo_bloqueado.toFixed(2)} bloq.</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-center">
                        {u.is_admin ? (
                          <span className="inline-flex items-center gap-1.5 text-[10px] bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-black uppercase tracking-tight shadow-sm shadow-amber-200">
                            <Shield className="w-3 h-3" />
                            Administrador
                          </span>
                        ) : (
                          <span className="text-slate-300 font-black text-[10px] uppercase tracking-widest">Usuário</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          {!isMe && (
                            <>
                              {u.is_admin ? (
                                <button
                                  onClick={() => handleRebaixar(u)}
                                  disabled={isLoading}
                                  title="Remover Admin"
                                  className="flex items-center gap-1 text-xs text-amber-600 hover:text-amber-800 border border-amber-200 hover:border-amber-400 px-2 py-1 rounded transition-colors disabled:opacity-50"
                                >
                                  <ShieldOff className="w-3 h-3" />
                                  <span className="hidden sm:inline">Remover Admin</span>
                                </button>
                              ) : (
                                <button
                                  onClick={() => handlePromover(u)}
                                  disabled={isLoading}
                                  title="Tornar Admin"
                                  className="flex items-center gap-1 text-xs text-primary hover:text-primary-dark border border-primary/30 hover:border-primary px-2 py-1 rounded transition-colors disabled:opacity-50"
                                >
                                  <Shield className="w-3 h-3" />
                                  <span className="hidden sm:inline">Tornar Admin</span>
                                </button>
                              )}
                              <button
                                onClick={() => setConfirmRemover(u)}
                                disabled={isLoading}
                                title="Remover usuário"
                                className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-2 py-1 rounded transition-colors disabled:opacity-50"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span className="hidden sm:inline">Remover</span>
                              </button>
                            </>
                          )}
                          {isLoading && (
                            <span className="text-xs text-text-muted animate-pulse">Aguarde...</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de confirmação de remoção */}
      {confirmRemover && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 fade-in">
          <div className="bg-card rounded-[32px] border border-border p-8 max-w-sm w-full shadow-2xl float-up">
            <div className="w-20 h-20 bg-danger/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trash2 className="w-10 h-10 text-danger" />
            </div>
            <h2 className="text-2xl font-black text-text text-center mb-2">Remover usuário?</h2>
            <p className="text-text-muted text-center text-sm mb-6 leading-relaxed">
              Você está prestes a remover permanentemente <strong>{confirmRemover.nome || confirmRemover.email}</strong>. Esta ação é irreversível.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => handleRemover(confirmRemover)}
                className="w-full px-6 py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl text-base font-black transition-all shadow-lg shadow-red-200 active:scale-95"
              >
                Sim, Remover Permanente
              </button>
              <button
                onClick={() => setConfirmRemover(null)}
                className="w-full px-6 py-4 bg-bg text-text-muted rounded-2xl text-base font-black hover:bg-bg/80 transition-all active:scale-95"
              >
                Não, Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
