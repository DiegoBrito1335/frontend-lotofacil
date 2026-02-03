import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminService } from '@/services/adminService'
import { ArrowLeft, Save } from 'lucide-react'

export default function AdminCriarBolaoPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    nome: '',
    descricao: '',
    concurso_numero: '',
    total_cotas: '',
    valor_cota: '',
    status: 'aberto',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.nome || !form.concurso_numero || !form.total_cotas || !form.valor_cota) {
      setError('Preencha todos os campos obrigatórios')
      return
    }

    try {
      setLoading(true)
      const novoBolao = await adminService.criarBolao({
        nome: form.nome,
        descricao: form.descricao || undefined,
        concurso_numero: parseInt(form.concurso_numero),
        total_cotas: parseInt(form.total_cotas),
        valor_cota: parseFloat(form.valor_cota),
        status: form.status,
      })
      navigate(`/admin/boloes/${novoBolao.id}`)
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } }
      setError(error.response?.data?.detail || 'Erro ao criar bolão')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-text-muted hover:text-text mb-4 bg-transparent border-0 cursor-pointer text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </button>

      <div className="bg-card rounded-xl border border-border p-6">
        <h1 className="text-xl font-bold mb-6">Criar Novo Bolão</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text mb-1">Nome *</label>
            <input
              name="nome"
              value={form.nome}
              onChange={handleChange}
              placeholder="Ex: Lotofácil Concurso 3250"
              className="w-full px-3 py-2.5 border border-border rounded-lg bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1">Descrição</label>
            <textarea
              name="descricao"
              value={form.descricao}
              onChange={handleChange}
              rows={3}
              placeholder="Descrição do bolão (opcional)"
              className="w-full px-3 py-2.5 border border-border rounded-lg bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1">Concurso *</label>
              <input
                name="concurso_numero"
                type="number"
                min="1"
                value={form.concurso_numero}
                onChange={handleChange}
                placeholder="Ex: 3250"
                className="w-full px-3 py-2.5 border border-border rounded-lg bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-border rounded-lg bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="aberto">Aberto</option>
                <option value="fechado">Fechado</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1">Total de Cotas *</label>
              <input
                name="total_cotas"
                type="number"
                min="1"
                max="1000"
                value={form.total_cotas}
                onChange={handleChange}
                placeholder="Ex: 100"
                className="w-full px-3 py-2.5 border border-border rounded-lg bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">Valor por Cota (R$) *</label>
              <input
                name="valor_cota"
                type="number"
                step="0.01"
                min="0.01"
                value={form.valor_cota}
                onChange={handleChange}
                placeholder="Ex: 5.00"
                className="w-full px-3 py-2.5 border border-border rounded-lg bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Preview */}
          {form.total_cotas && form.valor_cota && (
            <div className="bg-bg rounded-lg p-4 text-sm">
              <p className="text-text-muted mb-1">Receita máxima estimada:</p>
              <p className="text-xl font-bold text-primary">
                R$ {(parseInt(form.total_cotas) * parseFloat(form.valor_cota)).toFixed(2)}
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-800 p-3 rounded-lg text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors border-0 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Criando...' : 'Criar Bolão'}
          </button>
        </form>
      </div>
    </div>
  )
}
