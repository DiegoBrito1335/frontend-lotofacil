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
    tipo: 'lotofacil' as 'lotofacil' | 'megasena',
    teimosinha: false,
    quantidade_concursos: '',
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
      const concursoNumero = parseInt(form.concurso_numero)
      const concursoFim = form.teimosinha && form.quantidade_concursos
        ? concursoNumero + parseInt(form.quantidade_concursos) - 1
        : undefined

      const novoBolao = await adminService.criarBolao({
        nome: form.nome,
        descricao: form.descricao || undefined,
        concurso_numero: concursoNumero,
        concurso_fim: concursoFim,
        total_cotas: parseInt(form.total_cotas),
        valor_cota: parseFloat(form.valor_cota),
        status: form.status,
        tipo: form.tipo,
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
    <div className="max-w-2xl mx-auto fade-in">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-text-muted hover:text-primary mb-8 bg-transparent border-0 cursor-pointer font-bold transition-colors group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Voltar à listagem
      </button>

      <div className="bg-card rounded-[32px] border border-border p-10 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] float-up">
        <h1 className="text-3xl font-black text-text mb-8 tracking-tight">Criar Novo <span className="text-primary">Bolão</span></h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Seletor de tipo de loteria */}
          <div>
            <label className="block text-sm font-medium text-text mb-2">Tipo de Loteria *</label>
            <div className="grid grid-cols-2 gap-3">
              {(['lotofacil', 'megasena'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm({ ...form, tipo: t })}
                  className={`py-3 px-4 rounded-lg border-2 text-sm font-semibold transition-colors cursor-pointer ${
                    form.tipo === t
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-bg text-text-muted hover:border-primary/50'
                  }`}
                >
                  {t === 'lotofacil' ? '🍀 Lotofácil' : '🟢 Mega-Sena'}
                </button>
              ))}
            </div>
            <p className="text-xs text-text-muted mt-1">
              {form.tipo === 'megasena'
                ? 'Mega-Sena: 6 a 20 números de 1 a 60 por jogo'
                : 'Lotofácil: 15 a 18 números de 1 a 25 por jogo'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1">Nome *</label>
            <input
              name="nome"
              value={form.nome}
              onChange={handleChange}
              placeholder={form.tipo === 'megasena' ? 'Ex: Mega-Sena Concurso 2800' : 'Ex: Lotofácil Concurso 3250'}
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
                aria-label="Status do bolão"
                className="w-full px-3 py-2.5 border border-border rounded-lg bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="aberto">Aberto</option>
                <option value="fechado">Fechado</option>
              </select>
            </div>
          </div>

          {/* Teimosinha */}
          <div className="bg-bg rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.teimosinha}
                  onChange={(e) => setForm({ ...form, teimosinha: e.target.checked, quantidade_concursos: '' })}
                  aria-label="Ativar teimosinha"
                  className="w-4 h-4 accent-primary cursor-pointer"
                />
              </label>
              <div>
                <span className="text-sm font-medium text-text">Teimosinha</span>
                <p className="text-xs text-text-muted">Jogar os mesmos números por vários concursos consecutivos</p>
              </div>
            </div>

            {form.teimosinha && (
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-text mb-1">Quantidade de concursos</label>
                  <input
                    name="quantidade_concursos"
                    type="number"
                    min="2"
                    max="999"
                    value={form.quantidade_concursos}
                    onChange={handleChange}
                    placeholder="Ex: 6"
                    className="w-full px-3 py-2.5 border border-border rounded-lg bg-bg text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                {form.concurso_numero && form.quantidade_concursos && (
                  <div className="flex-1 bg-primary/10 rounded-lg p-3">
                    <p className="text-xs text-text-muted">Concursos</p>
                    <p className="text-sm font-bold text-primary">
                      {form.concurso_numero} a {parseInt(form.concurso_numero) + parseInt(form.quantidade_concursos) - 1}
                    </p>
                    <p className="text-xs text-text-muted">{form.quantidade_concursos} concursos</p>
                  </div>
                )}
              </div>
            )}
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
            <div className="bg-danger/10 text-danger border border-danger/20 p-3 rounded-lg text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 btn-gradient text-white font-black py-5 rounded-2xl no-underline shadow-lg shadow-green-600/20 active:scale-95 transition-all text-lg mt-8"
          >
            <Save className="w-6 h-6" />
            {loading ? 'Sincronizando...' : 'Lançar Bolão Oficial'}
          </button>
        </form>
      </div>
    </div>
  )
}
