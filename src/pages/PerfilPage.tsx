import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import api from '@/services/api'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { User, Mail, Phone, Key, Save, CheckCircle } from 'lucide-react'

interface PerfilData {
  nome: string
  email: string
  telefone: string
  chave_pix: string
}

export default function PerfilPage() {
  const { updateUserName } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [perfil, setPerfil] = useState<PerfilData>({
    nome: '',
    email: '',
    telefone: '',
    chave_pix: '',
  })

  useEffect(() => {
    loadPerfil()
  }, [])

  const loadPerfil = async () => {
    try {
      setLoading(true)
      const { data } = await api.get('/perfil')
      setPerfil({
        nome: data.nome || '',
        email: data.email || '',
        telefone: data.telefone || '',
        chave_pix: data.chave_pix || '',
      })
    } catch {
      setError('Erro ao carregar perfil')
    } finally {
      setLoading(false)
    }
  }

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!perfil.nome.trim()) {
      setError('Nome é obrigatório')
      return
    }

    try {
      setSaving(true)
      setError('')
      setSucesso('')
      await api.put('/perfil', {
        nome: perfil.nome.trim(),
        telefone: perfil.telefone.trim(),
        chave_pix: perfil.chave_pix.trim(),
      })
      setSucesso('Perfil atualizado com sucesso!')
      updateUserName(perfil.nome.trim())
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } }
      setError(error.response?.data?.detail || 'Erro ao salvar perfil')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadingSpinner text="Carregando perfil..." />

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text flex items-center gap-2">
          <User className="w-6 h-6 text-primary" />
          Meu Perfil
        </h1>
        <p className="text-text-muted text-sm mt-1">Gerencie seus dados pessoais</p>
      </div>

      <div className="bg-card rounded-xl border border-border p-6">
        {sucesso && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-800 p-3 rounded-lg text-sm mb-4">
            <CheckCircle className="w-4 h-4 shrink-0" />
            {sucesso}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSalvar} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-text mb-1.5">Nome</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                value={perfil.nome}
                onChange={(e) => { setPerfil({ ...perfil, nome: e.target.value }); setError(''); setSucesso('') }}
                placeholder="Seu nome completo"
                className="w-full pl-10 pr-3 py-3 border border-border rounded-xl text-sm bg-bg focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-text mb-1.5">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="email"
                value={perfil.email}
                disabled
                className="w-full pl-10 pr-3 py-3 border border-border rounded-xl text-sm bg-gray-100 text-text-muted cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-text-muted mt-1">O e-mail não pode ser alterado</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-text mb-1.5">Telefone</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="tel"
                value={perfil.telefone}
                onChange={(e) => { setPerfil({ ...perfil, telefone: e.target.value }); setSucesso('') }}
                placeholder="(00) 00000-0000"
                className="w-full pl-10 pr-3 py-3 border border-border rounded-xl text-sm bg-bg focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-text mb-1.5">Chave Pix</label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                value={perfil.chave_pix}
                onChange={(e) => { setPerfil({ ...perfil, chave_pix: e.target.value }); setSucesso('') }}
                placeholder="CPF, e-mail, telefone ou chave aleatória"
                className="w-full pl-10 pr-3 py-3 border border-border rounded-xl text-sm bg-bg focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>
            <p className="text-xs text-text-muted mt-1">Usada para receber saques</p>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl transition-colors border-0 cursor-pointer text-sm"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </form>
      </div>
    </div>
  )
}
