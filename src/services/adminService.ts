import api from './api'
import type {
  Bolao,
  Jogo,
  BolaoCreateAdmin,
  BolaoUpdateAdmin,
  JogosCreateBatch,
  ApuracaoResponse,
  ApuracaoTeimosinhaResponse,
  StatusApuracao,
  QuickStats,
  RevenueData,
  Atividade,
} from '@/types'

export const adminService = {
  listarBoloes: async (statusFilter?: string): Promise<Bolao[]> => {
    const { data } = await api.get('/admin/boloes', {
      params: { status_filter: statusFilter },
    })
    return data
  },

  criarBolao: async (bolao: BolaoCreateAdmin): Promise<Bolao> => {
    const { data } = await api.post('/admin/boloes', bolao)
    return data
  },

  atualizarBolao: async (id: string, bolao: BolaoUpdateAdmin): Promise<Bolao> => {
    const { data } = await api.put(`/admin/boloes/${id}`, bolao)
    return data
  },

  fecharBolao: async (id: string): Promise<{ mensagem: string }> => {
    const { data } = await api.patch(`/admin/boloes/${id}/close`)
    return data
  },

  deletarBolao: async (id: string): Promise<{ mensagem: string }> => {
    const { data } = await api.delete(`/admin/boloes/${id}`)
    return data
  },

  // Jogos
  adicionarJogos: async (bolaoId: string, jogos: JogosCreateBatch): Promise<Jogo[]> => {
    const { data } = await api.post(`/admin/boloes/${bolaoId}/jogos`, jogos)
    return data
  },

  removerJogo: async (bolaoId: string, jogoId: string): Promise<void> => {
    await api.delete(`/admin/boloes/${bolaoId}/jogos/${jogoId}`)
  },

  // Apuração
  apurarManual: async (bolaoId: string, dezenas: number[]): Promise<ApuracaoResponse> => {
    const { data } = await api.post(`/admin/boloes/${bolaoId}/apurar`, { dezenas })
    return data
  },

  apurarAutomatico: async (bolaoId: string): Promise<ApuracaoResponse> => {
    const { data } = await api.post(`/admin/boloes/${bolaoId}/apurar/automatico`)
    return data
  },

  getResultado: async (bolaoId: string) => {
    const { data } = await api.get(`/admin/boloes/${bolaoId}/resultado`)
    return data
  },

  getStatusApuracao: async (bolaoId: string): Promise<StatusApuracao> => {
    const { data } = await api.get(`/admin/boloes/${bolaoId}/apuracao/status`)
    return data
  },

  apurarTeimosinhaAutomatico: async (bolaoId: string): Promise<ApuracaoTeimosinhaResponse> => {
    const { data } = await api.post(`/admin/boloes/${bolaoId}/apurar/automatico`)
    return data
  },

  // Stats
  getQuickStats: async (): Promise<QuickStats> => {
    const { data } = await api.get('/admin/stats/quick')
    return data
  },

  getRevenue: async (): Promise<RevenueData[]> => {
    const { data } = await api.get('/admin/stats/revenue')
    return data
  },

  getActivity: async (): Promise<Atividade[]> => {
    const { data } = await api.get('/admin/activity')
    return data
  },
}
