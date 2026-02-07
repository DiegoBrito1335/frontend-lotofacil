import api from './api'
import type { Bolao, Jogo, BolaoDisponibilidade } from '@/types'

export const bolaoService = {
  listar: async (apenasAbertos = true): Promise<Bolao[]> => {
    const { data } = await api.get('/boloes', {
      params: { apenas_abertos: apenasAbertos },
    })
    return data
  },

  getById: async (id: string): Promise<Bolao> => {
    const { data } = await api.get(`/boloes/${id}`)
    return data
  },

  getJogos: async (bolaoId: string): Promise<Jogo[]> => {
    const { data } = await api.get(`/boloes/${bolaoId}/jogos`)
    return data
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getResultado: async (bolaoId: string): Promise<any> => {
    const { data } = await api.get(`/boloes/${bolaoId}/resultado`)
    return data
  },

  verificarDisponibilidade: async (bolaoId: string): Promise<BolaoDisponibilidade> => {
    const { data } = await api.get(`/boloes/${bolaoId}/disponivel`)
    return data
  },
}
