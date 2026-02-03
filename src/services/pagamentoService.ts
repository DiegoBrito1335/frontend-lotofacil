import api from './api'
import type { CriarPagamentoPixRequest, PagamentoPix } from '@/types'

export const pagamentoService = {
  criarPix: async (request: CriarPagamentoPixRequest): Promise<PagamentoPix> => {
    const { data } = await api.post('/pagamentos/criar-pix', request)
    return data
  },

  meusPagamentos: async (): Promise<PagamentoPix[]> => {
    const { data } = await api.get('/pagamentos/meus-pagamentos')
    return data
  },
}
