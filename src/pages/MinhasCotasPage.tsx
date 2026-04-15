import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { cotaService } from '@/services/cotaService'
import type { Cota } from '@/types'
import Skeleton from '@/components/ui/Skeleton'
import StatusBadge from '@/components/ui/StatusBadge'
import { Ticket, ExternalLink, Trophy } from 'lucide-react'
import { formatBRL } from '@/utils/format'

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

  if (loading) {
    return (
      <div className="fade-in">
        <div className="mb-6">
          <Skeleton className="w-48 h-8 mb-2" />
          <Skeleton className="w-72 h-4" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-card border border-border p-4 flex items-center justify-between rounded-[20px]">
              <div className="flex items-center gap-4">
                <Skeleton className="w-10 h-10 rounded-lg" />
                <div>
                  <Skeleton className="w-32 h-5 mb-1.5" />
                  <Skeleton className="w-40 h-3" />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end gap-1.5">
                  <Skeleton className="w-24 h-5" />
                  <Skeleton className="w-16 h-4" />
                </div>
                <Skeleton className="w-4 h-4 ml-2" />
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
        <button onClick={loadCotas} className="mt-3 text-primary hover:underline bg-transparent border-0 cursor-pointer">
          Tentar novamente
        </button>
      </div>
    )
  }

  return (
    <div className="fade-in">
      <div className="mb-10 float-up">
        <h1 className="text-4xl font-black text-text tracking-tight mb-2">
          Meus <span className="text-primary">Bilhetes</span>
        </h1>
        <p className="text-text-muted font-medium">Acompanhe aqui todas as suas participações e prêmios</p>
      </div>

      {cotas.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-[32px] border border-border shadow-sm float-up">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-bg rounded-full mb-6">
            <Ticket className="w-10 h-10 text-text-muted/40" />
          </div>
          <h3 className="text-2xl font-bold text-text mb-2">Sem bilhetes ainda</h3>
          <p className="text-text-muted font-medium max-w-xs mx-auto mb-8">Você ainda não comprou nenhuma cota. Participe de um bolão agora!</p>
          <Link to="/" className="inline-flex items-center gap-2 btn-gradient text-white font-black py-4 px-8 rounded-2xl no-underline shadow-lg shadow-green-600/20">
            Explorar Bolões
          </Link>
        </div>
      ) : (
        <div className="space-y-4 float-up float-up-delay-1">
          {cotas.map((cota) => (
            <div key={cota.id} className="bg-card border border-border p-6 flex items-center justify-between rounded-3xl card-hover float-up">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                  <Ticket className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h3 className="font-black text-text text-lg">
                    {cota.bolao_nome || `Bolão ${cota.bolao_id.slice(0, 8)}`}
                  </h3>
                  <p className="text-text-muted text-sm font-medium mt-0.5">
                    {cota.concurso_numero ? `Concurso ${cota.concurso_numero} • ` : ''}
                    {new Date(cota.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="font-black text-text text-lg">
                    {cota.quantidade && cota.quantidade > 1 ? `${cota.quantidade} cotas • ` : ''}
                    {formatBRL(Number(cota.valor_pago))}
                  </p>
                  <div className="flex items-center gap-2 justify-end mt-1.5">
                    {cota.bolao_status && <StatusBadge status={cota.bolao_status} />}
                    {cota.bolao_status === 'apurado' && (
                      cota.premio_ganho && cota.premio_ganho > 0 ? (
                        <span className="inline-flex items-center gap-1 text-xs bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-black uppercase tracking-tight shadow-sm shadow-amber-200">
                          <Trophy className="w-3 h-3" />
                          Ganhos: {formatBRL(cota.premio_ganho)}
                        </span>
                      ) : (
                        <span className="text-[10px] bg-slate-100 text-slate-400 px-2 py-0.5 rounded-lg font-bold uppercase tracking-wider">
                          NÃO PREMIADO
                        </span>
                      )
                    )}
                  </div>
                </div>
                <Link
                  to={`/bolao/${cota.bolao_id}`}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-bg text-text-muted hover:text-primary hover:bg-primary/10 transition-all border border-border"
                >
                  <ExternalLink className="w-5 h-5" />
                </Link>
              </div>
            </div>
          ))}

          <div className="bg-slate-900 dark:bg-slate-800 border border-slate-700 dark:border-slate-700/50 rounded-[32px] p-8 text-white shadow-2xl shadow-slate-950/20 mt-10 relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl" />
             <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-1">Resumo Total</p>
                  <p className="text-3xl font-black">{cotas.reduce((acc, c) => acc + (c.quantidade || 1), 0)} Bilhetes</p>
                </div>
                <div className="flex gap-10">
                  <div className="text-center md:text-left">
                    <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-1">Investimento</p>
                    <p className="text-2xl font-black text-white">{formatBRL(cotas.reduce((acc, c) => acc + Number(c.valor_pago), 0))}</p>
                  </div>
                  {cotas.some(c => (c.premio_ganho || 0) > 0) && (
                    <div className="text-center md:text-left">
                      <p className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-1">Lucro Total</p>
                      <p className="text-2xl font-black text-amber-400">{formatBRL(cotas.reduce((acc, c) => acc + (c.premio_ganho || 0), 0))}</p>
                    </div>
                  )}
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  )
}
