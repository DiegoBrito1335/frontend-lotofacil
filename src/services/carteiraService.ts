import api from './api'
import type { CarteiraResumo, Transacao, TransacaoResumo } from '@/types'

export const carteiraService = {
  getSaldo: async (): Promise<CarteiraResumo> => {
    try {
      const { data } = await api.get('/carteira/')
      return data
    } catch (err: unknown) {
      const error = err as { response?: { status?: number } }
      if (error.response?.status === 404) {
        return { saldo_disponivel: 0, saldo_bloqueado: 0, saldo_total: 0 }
      }
      throw err
    }
  },

  getTransacoes: async (tipo?: string): Promise<Transacao[]> => {
    const { data } = await api.get('/transacoes/', {
      params: tipo ? { tipo } : undefined,
    })
    return data
  },

  getResumoTransacoes: async (): Promise<TransacaoResumo> => {
    const { data } = await api.get('/transacoes/resumo')
    return data
  },
}
