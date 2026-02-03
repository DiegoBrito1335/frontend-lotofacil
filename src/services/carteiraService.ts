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
    const userId = localStorage.getItem('user_id')
    const { data } = await api.get('/transacoes/', {
      params: { usuario_id: userId, tipo },
    })
    return data
  },

  getResumoTransacoes: async (): Promise<TransacaoResumo> => {
    const userId = localStorage.getItem('user_id')
    const { data } = await api.get('/transacoes/resumo', {
      params: { usuario_id: userId },
    })
    return data
  },
}
