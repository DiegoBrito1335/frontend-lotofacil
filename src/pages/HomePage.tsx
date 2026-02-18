import { useEffect, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { bolaoService } from '@/services/bolaoService'
import type { Bolao } from '@/types'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import StatusBadge from '@/components/ui/StatusBadge'
import { Ticket, Users, TrendingUp } from 'lucide-react'

export default function HomePage() {
  const [boloes, setBoloes] = useState<Bolao[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadBoloes()
  }, [])

  const loadBoloes = async () => {
    try {
      setLoading(true)
      const data = await bolaoService.listar(true)
      setBoloes(data)
    } catch {
      setError('Erro ao carregar bolões')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingSpinner text="Carregando bolões..." />

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-danger">{error}</p>
        <button onClick={loadBoloes} className="mt-3 text-primary hover:underline bg-transparent border-0 cursor-pointer">
          Tentar novamente
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text">Bolões Disponíveis</h1>
        <p className="text-text-muted text-sm mt-1">Escolha um bolão e compre suas cotas</p>
      </div>

      {boloes.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-xl border border-border">
          <Ticket className="w-12 h-12 text-text-muted mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-text">Nenhum bolão disponível</h3>
          <p className="text-text-muted text-sm mt-1">Novos bolões serão abertos em breve!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {boloes.map((bolao) => {
            const cotasVendidas = bolao.total_cotas - bolao.cotas_disponiveis
            const percentual = bolao.total_cotas > 0 ? (cotasVendidas / bolao.total_cotas) * 100 : 0

            return (
              <Link
                key={bolao.id}
                to={`/bolao/${bolao.id}`}
                className="bg-card border border-border p-5 no-underline text-text block card-hover"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{bolao.nome}</h3>
                    <p className="text-text-muted text-sm">
                      {bolao.concurso_fim && bolao.concurso_fim > bolao.concurso_numero
                        ? <>Teimosinha ({bolao.concurso_fim - bolao.concurso_numero + 1} concursos)</>
                        : <>Concurso {bolao.concurso_numero}</>
                      }
                    </p>
                  </div>
                  <StatusBadge status={bolao.status} />
                </div>

                {bolao.descricao && (
                  <p className="text-text-muted text-sm mb-3 line-clamp-2">{bolao.descricao}</p>
                )}

                <div className="space-y-3">
                  {/* Barra de progresso */}
                  <div>
                    <div className="flex justify-between text-xs text-text-muted mb-1">
                      <span>{cotasVendidas}/{bolao.total_cotas} cotas vendidas</span>
                      <span>{percentual.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full progress-animated"
                        style={{ '--progress': `${Math.min(percentual, 100)}%` } as CSSProperties}
                      />
                    </div>
                  </div>

                  {/* Info cards */}
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="flex items-center gap-1 text-sm">
                      <TrendingUp className="w-4 h-4 text-primary" />
                      <span className="font-semibold text-primary">
                        R$ {Number(bolao.valor_cota).toFixed(2)}
                      </span>
                      <span className="text-text-muted">/cota</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-text-muted">
                      <Users className="w-4 h-4" />
                      {bolao.cotas_disponiveis <= 0 ? (
                        <span className="text-amber-600 font-medium">Cotas esgotadas</span>
                      ) : (
                        <span>{bolao.cotas_disponiveis} restantes</span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
