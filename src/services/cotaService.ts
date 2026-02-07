import api from './api'
import type { ComprarCotaRequest, ComprarCotaResponse, Cota, ResultadoBolaoUsuario } from '@/types'

export const cotaService = {
  comprar: async (request: ComprarCotaRequest): Promise<ComprarCotaResponse> => {
    const { data } = await api.post('/cotas/comprar', request)
    return data
  },

  minhasCotas: async (): Promise<Cota[]> => {
    const { data } = await api.get('/cotas/minhas')
    return data
  },

  meusResultados: async (): Promise<ResultadoBolaoUsuario[]> => {
    const { data } = await api.get('/cotas/meus-resultados')
    return data
  },
}
