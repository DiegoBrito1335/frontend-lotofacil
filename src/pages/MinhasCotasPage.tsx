import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { cotaService } from '@/services/cotaService'
import type { Cota } from '@/types'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import StatusBadge from '@/components/ui/StatusBadge'
import { Ticket, ExternalLink, Trophy } from 'lucide-react'

export default function MinhasCotasPage() {
  const [cotas, setCotas] = useState<Cota[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadCotas()
  }, [])

  const loadCotas = async () => {
    try {
      setLoading(true)
      const data = await cotaService.minhasCotas()
      setCotas(data)
    } catch {
      setError('Erro ao carregar suas cotas')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingSpinner text="Carregando suas cotas..." />

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-danger">{error}</p>
        <button onClick={loadCotas} className="mt-3 text-primary hover:underline bg-transparent border-0 cursor-pointer">
          Tentar novamente
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text">Minhas Cotas</h1>
        <p className="text-text-muted text-sm mt-1">Acompanhe todas as suas cotas compradas</p>
      </div>

      {cotas.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-xl border border-border">
          <Ticket className="w-12 h-12 text-text-muted mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-text">Nenhuma cota comprada</h3>
          <p className="text-text-muted text-sm mt-1">
            Explore os{' '}
            <Link to="/" className="text-primary hover:underline">
              bolões disponíveis
            </Link>{' '}
            e compre suas cotas!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {cotas.map((cota) => (
            <div key={cota.id} className="bg-card rounded-xl border border-border p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Ticket className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">
                    {cota.bolao_nome || `Bolão ${cota.bolao_id.slice(0, 8)}`}
                  </h3>
                  <p className="text-text-muted text-xs">
                    {cota.concurso_numero ? `Concurso ${cota.concurso_numero} • ` : ''}
                    {new Date(cota.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-semibold text-sm">{cota.quantidade && cota.quantidade > 1 ? `${cota.quantidade} cotas • ` : ''}R$ {Number(cota.valor_pago).toFixed(2)}</p>
                  <div className="flex items-center gap-1 justify-end mt-0.5">
                    {cota.bolao_status && <StatusBadge status={cota.bolao_status} />}
                    {cota.bolao_status === 'apurado' && (
                      cota.premio_ganho && cota.premio_ganho > 0 ? (
                        <span className="inline-flex items-center gap-0.5 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded font-medium">
                          <Trophy className="w-3 h-3" />
                          R$ {cota.premio_ganho.toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
                          Sem premio
                        </span>
                      )
                    )}
                  </div>
                </div>
                <Link
                  to={`/bolao/${cota.bolao_id}`}
                  className="text-text-muted hover:text-primary transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}

          <div className="bg-bg rounded-lg p-4 text-center text-sm text-text-muted">
            Total: <strong>{cotas.reduce((acc, c) => acc + (c.quantidade || 1), 0)}</strong> cota{cotas.reduce((acc, c) => acc + (c.quantidade || 1), 0) > 1 ? 's' : ''} •
            Investido: <strong className="text-primary">R$ {cotas.reduce((acc, c) => acc + Number(c.valor_pago), 0).toFixed(2)}</strong>
            {cotas.some(c => (c.premio_ganho || 0) > 0) && (
              <> • Ganhos: <strong className="text-green-700">R$ {cotas.reduce((acc, c) => acc + (c.premio_ganho || 0), 0).toFixed(2)}</strong></>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
