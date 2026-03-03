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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link
            to="/admin"
            className="text-text-muted hover:text-text transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-text">Gerenciar Usuários</h1>
            <p className="text-text-muted text-sm mt-1">{usuarios.length} usuário(s) cadastrado(s)</p>
          </div>
        </div>
        <button
          onClick={carregarUsuarios}
          className="flex items-center gap-2 bg-bg border border-border text-text text-sm px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Atualizar
        </button>
      </div>

      {mensagem && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
          {mensagem}
        </div>
      )}

      {erro && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {erro}
        </div>
      )}

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {usuarios.length === 0 ? (
          <p className="text-text-muted text-sm text-center py-10">Nenhum usuário encontrado.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-bg">
                  <th className="text-left px-4 py-3 font-semibold text-text-muted">Nome</th>
                  <th className="text-left px-4 py-3 font-semibold text-text-muted">Email</th>
                  <th className="text-left px-4 py-3 font-semibold text-text-muted hidden md:table-cell">Telefone</th>
                  <th className="text-right px-4 py-3 font-semibold text-text-muted hidden sm:table-cell">Saldo</th>
                  <th className="text-center px-4 py-3 font-semibold text-text-muted">Admin</th>
                  <th className="text-right px-4 py-3 font-semibold text-text-muted">Ações</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u) => {
                  const isMe = u.id === userId
                  const isLoading = loadingAction === u.id
                  return (
                    <tr key={u.id} className="border-b border-border last:border-0 hover:bg-bg/50 transition-colors">
                      <td className="px-4 py-3">
                        <span className="font-medium">{u.nome || <span className="text-text-muted italic">—</span>}</span>
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
                      <td className="px-4 py-3 text-center">
                        {u.is_admin ? (
                          <span className="inline-flex items-center gap-1 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                            <Shield className="w-3 h-3" />
                            Admin
                          </span>
                        ) : (
                          <span className="text-text-muted text-xs">—</span>
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl border border-border p-6 max-w-sm w-full shadow-xl">
            <h2 className="text-lg font-bold mb-2">Remover usuário?</h2>
            <p className="text-text-muted text-sm mb-1">
              Você está prestes a remover permanentemente:
            </p>
            <p className="font-semibold mb-1">{confirmRemover.nome || 'Sem nome'}</p>
            <p className="text-sm text-text-muted mb-4">{confirmRemover.email}</p>
            <p className="text-xs text-red-600 mb-4">
              Esta ação não pode ser desfeita. O perfil, carteira e conta de acesso serão removidos.
              Não é possível remover usuários com cotas ativas.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmRemover(null)}
                className="flex-1 px-4 py-2 border border-border rounded-lg text-sm hover:bg-bg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleRemover(confirmRemover)}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition-colors"
              >
                Remover
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
