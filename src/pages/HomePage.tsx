import { useEffect, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { bolaoService } from '@/services/bolaoService'
import type { Bolao } from '@/types'
import StatusBadge from '@/components/ui/StatusBadge'
import Skeleton from '@/components/ui/Skeleton'
import FAQItem from '@/components/ui/FAQItem'
import { Ticket, Users, TrendingUp } from 'lucide-react'

export default function HomePage() {
  const [boloes, setBoloes] = useState<Bolao[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadBoloes()
  }, [])

  const loadBoloes = async () => {
    setLoading(true)
    setError('')

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const data = await bolaoService.listar(true)
        setBoloes(data)
        setLoading(false)
        return
      } catch {
        if (attempt < 3) {
          await new Promise((r) => setTimeout(r, 3000))
        }
      }
    }

    setError('Erro ao carregar bolões')
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="fade-in">
        <div className="mb-6">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-card border border-border p-5 rounded-[20px] shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-4" />
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-8" />
                </div>
                <Skeleton className="h-2 w-full" />
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-border">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-28" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-danger">{error}</p>
        <button type="button" onClick={loadBoloes} className="mt-3 text-primary hover:underline bg-transparent border-0 cursor-pointer">
          Tentar novamente
        </button>
      </div>
    )
  }

  return (
    <div className="fade-in">
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
            const isUrgente = bolao.cotas_disponiveis > 0 && bolao.total_cotas > 0 && bolao.cotas_disponiveis / bolao.total_cotas < 0.2

            return (
              <Link
                key={bolao.id}
                to={`/bolao/${bolao.id}`}
                className="bg-card border border-border p-5 no-underline text-text block card-hover"
              >
                <div className="flex items-start justify-between flex-wrap gap-2 mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{bolao.nome}</h3>
                    <p className="text-text-muted text-sm">
                      {bolao.concurso_fim && bolao.concurso_fim > bolao.concurso_numero
                        ? <>Teimosinha ({bolao.concurso_fim - bolao.concurso_numero + 1} concursos)</>
                        : <>Concurso {bolao.concurso_numero}</>
                      }
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {isUrgente && (
                      <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full font-bold animate-pulse">
                        Últimas cotas!
                      </span>
                    )}
                    <StatusBadge status={bolao.status} />
                  </div>
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

      {/* ===== FAQ SECTION ===== */}
      <section className="mt-24 pt-16 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-text mb-4">Dúvidas Frequentes</h2>
            <p className="text-lg text-text-muted">Respondemos o essencial para você jogar com confiança.</p>
          </div>

          <div className="bg-card rounded-[24px] p-6 md:p-10 border border-border shadow-sm">
            <FAQItem 
              question="Minhas cotas e prêmios são garantidos?" 
              answer="100%. Quando o bolão atinge a meta e é registrado na lotérica, o rateio do prêmio (dividido pelo número total de cotas) entra instantaneamente como saldo líquido na sua carteira da plataforma para saque via Pix."
            />
            <FAQItem 
              question="Como eu recebo meu dinheiro?" 
              answer="Basta ir no menu Carteira, solicitar 'Sacar' e inserir a sua chave Pix. O pagamento será processado em minutos para a chave cadastrada."
            />
            <FAQItem 
              question="Existe taxa de administração ou imposto embutido?" 
              answer="O valor da cota mostrado no sistema já contém todos os custos previstos e embutidos. O lucro que você ganha na premiação é seu lucro e não cobraremos nenhuma taxa extra."
            />
            <FAQItem 
              question="O que acontece se o Bolão não atingir o 100% de venda?" 
              answer="Se não fechar, devolveremos o valor pago como saldo na sua carteira antes do sorteio. Porém nós assumimos riscos dos bolões quase fechados para que não haja cancelamento."
            />
          </div>
        </div>
      </section>
    </div>
  )
}
