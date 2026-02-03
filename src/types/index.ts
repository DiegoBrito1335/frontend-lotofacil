// ===================================
// BOLÃO
// ===================================

export interface Bolao {
  id: string
  nome: string
  descricao: string | null
  total_cotas: number
  cotas_disponiveis: number
  valor_cota: number
  concurso_numero: number
  status: 'aberto' | 'fechado' | 'apurado' | 'cancelado'
  data_fechamento: string | null
  created_at: string
  updated_at?: string
  jogos?: Jogo[]
  resultado_dezenas?: number[] | null
  cotas_vendidas?: number
  receita_total?: number
  percentual_vendido?: number
}

export interface Jogo {
  id: string
  bolao_id: string
  dezenas: number[]
  acertos?: number | null
  created_at: string
}

export interface JogoCreate {
  dezenas: number[]
}

export interface JogosCreateBatch {
  jogos: JogoCreate[]
}

export interface ApuracaoResponse {
  bolao_id: string
  concurso_numero: number
  resultado_dezenas: number[]
  jogos_resultado: { jogo_id: string; dezenas: number[]; acertos: number }[]
  resumo: Record<number, number>
}

export interface BolaoDisponibilidade {
  bolao_id: string
  disponivel: boolean
  status: string
  cotas_disponiveis: number
}

// ===================================
// COTAS
// ===================================

export interface ComprarCotaRequest {
  bolao_id: string
  quantidade: number
}

export interface ComprarCotaResponse {
  mensagem: string
  cota_id: string
  bolao_id: string
  quantidade: number
  valor_total: number
  saldo_restante: number
}

export interface Cota {
  id: string
  bolao_id: string
  usuario_id: string
  valor_pago: number
  created_at: string
  bolao_nome?: string
  bolao_status?: string
  concurso_numero?: number
}

// ===================================
// CARTEIRA
// ===================================

export interface CarteiraResumo {
  saldo_disponivel: number
  saldo_bloqueado: number
  saldo_total: number
}

// ===================================
// TRANSAÇÕES
// ===================================

export interface Transacao {
  id: string
  tipo: 'credito' | 'debito'
  valor: number
  origem: string
  descricao: string | null
  saldo_anterior: number
  saldo_posterior: number
  status: string
  created_at: string
}

export interface TransacaoResumo {
  credito: { total: number; quantidade: number }
  debito: { total: number; quantidade: number }
  saldo_movimentado: number
}

// ===================================
// PAGAMENTOS
// ===================================

export interface CriarPagamentoPixRequest {
  valor: number
  descricao?: string
}

export interface PagamentoPix {
  id: string
  usuario_id?: string
  status: string
  valor: number
  qr_code: string
  qr_code_base64: string
  expira_em: string
  external_id: string
  created_at?: string
}

// ===================================
// ADMIN
// ===================================

export interface QuickStats {
  boloes_ativos: number
  total_cotas_vendidas: number
  receita_total: number
  total_usuarios: number
  pagamentos_pendentes: number
}

export interface RevenueData {
  data: string
  receita: number
}

export interface Atividade {
  tipo: 'compra_cota' | 'pagamento'
  descricao: string
  valor: number
  usuario_id: string
  data: string
}

export interface BolaoCreateAdmin {
  nome: string
  descricao?: string
  concurso_numero: number
  total_cotas: number
  valor_cota: number
  status?: string
  data_fechamento?: string
}

export interface BolaoUpdateAdmin {
  nome?: string
  descricao?: string
  concurso_numero?: number
  total_cotas?: number
  valor_cota?: number
  status?: string
  data_fechamento?: string
}
