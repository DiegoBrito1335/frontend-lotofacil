import { FileText } from 'lucide-react'

export default function TermosUsoPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text flex items-center gap-2">
          <FileText className="w-6 h-6 text-primary" />
          Termos de Uso
        </h1>
        <p className="text-text-muted text-sm mt-1">
          Última atualização: março de 2026
        </p>
      </div>

      <div className="space-y-4">

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <p className="text-yellow-800 text-sm font-medium">
            A Bolão Lotofácil é uma plataforma independente de organização de bolões entre amigos.
            Não é afiliada à Caixa Econômica Federal, ao Governo Federal, nem a qualquer órgão oficial
            de loterias. Os resultados são baseados nos concursos oficiais da Lotofácil.
          </p>
        </div>

        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="font-semibold text-lg mb-3 text-text">1. Definições</h2>
          <ul className="space-y-2 text-sm text-text-muted">
            <li className="flex gap-2"><span className="text-primary font-bold mt-0.5">•</span><span><strong className="text-text">Plataforma</strong>: o site Bolão Lotofácil e todos os seus serviços</span></li>
            <li className="flex gap-2"><span className="text-primary font-bold mt-0.5">•</span><span><strong className="text-text">Bolão</strong>: grupo de apostas coletivas em um ou mais concursos da Lotofácil</span></li>
            <li className="flex gap-2"><span className="text-primary font-bold mt-0.5">•</span><span><strong className="text-text">Cota</strong>: participação adquirida em um bolão, que representa fração proporcional dos prêmios</span></li>
            <li className="flex gap-2"><span className="text-primary font-bold mt-0.5">•</span><span><strong className="text-text">Concurso</strong>: sorteio oficial da Lotofácil realizado pela Caixa Econômica Federal</span></li>
            <li className="flex gap-2"><span className="text-primary font-bold mt-0.5">•</span><span><strong className="text-text">Carteira</strong>: saldo virtual dentro da plataforma, sem valor monetário fora dela</span></li>
            <li className="flex gap-2"><span className="text-primary font-bold mt-0.5">•</span><span><strong className="text-text">Usuário</strong>: toda pessoa que se cadastra e utiliza a plataforma</span></li>
          </ul>
        </div>

        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="font-semibold text-lg mb-3 text-text">2. Elegibilidade</h2>
          <ul className="space-y-2 text-sm text-text-muted">
            <li className="flex gap-2"><span className="text-primary font-bold mt-0.5">•</span><span>Ser maior de 18 (dezoito) anos</span></li>
            <li className="flex gap-2"><span className="text-primary font-bold mt-0.5">•</span><span>Possuir CPF válido e residir no Brasil</span></li>
            <li className="flex gap-2"><span className="text-primary font-bold mt-0.5">•</span><span>Ter capacidade civil plena para celebrar contratos</span></li>
            <li className="flex gap-2"><span className="text-primary font-bold mt-0.5">•</span><span>Não estar impedido por lei ou decisão judicial de participar de jogos</span></li>
          </ul>
          <p className="text-text-muted text-sm mt-3">
            Ao se cadastrar, você declara atender a todos os requisitos acima.
          </p>
        </div>

        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="font-semibold text-lg mb-3 text-text">3. Cadastro e Responsabilidades</h2>
          <ul className="space-y-2 text-sm text-text-muted">
            <li className="flex gap-2"><span className="text-primary font-bold mt-0.5">•</span><span>Você é responsável por manter suas credenciais em sigilo</span></li>
            <li className="flex gap-2"><span className="text-primary font-bold mt-0.5">•</span><span>Cada usuário pode ter apenas uma conta ativa</span></li>
            <li className="flex gap-2"><span className="text-primary font-bold mt-0.5">•</span><span>Informações falsas podem resultar em suspensão imediata</span></li>
            <li className="flex gap-2"><span className="text-primary font-bold mt-0.5">•</span><span>Você é responsável por todas as atividades realizadas com sua conta</span></li>
            <li className="flex gap-2"><span className="text-primary font-bold mt-0.5">•</span><span>Em caso de acesso não autorizado, notifique-nos imediatamente</span></li>
          </ul>
        </div>

        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="font-semibold text-lg mb-3 text-text">4. Pagamentos e Carteira</h2>
          <ul className="space-y-2 text-sm text-text-muted">
            <li className="flex gap-2"><span className="text-primary font-bold mt-0.5">•</span><span>Depósitos são realizados via <strong className="text-text">Pix</strong> processado pelo Mercado Pago</span></li>
            <li className="flex gap-2"><span className="text-primary font-bold mt-0.5">•</span><span>O saldo creditado na carteira fica disponível para compra de cotas</span></li>
            <li className="flex gap-2"><span className="text-primary font-bold mt-0.5">•</span><span>A carteira é virtual — o saldo não pode ser transferido para contas bancárias externas</span></li>
            <li className="flex gap-2"><span className="text-primary font-bold mt-0.5">•</span><span>Transações são registradas de forma permanente e imutável para fins de auditoria</span></li>
            <li className="flex gap-2"><span className="text-primary font-bold mt-0.5">•</span><span>Problemas com processamento Pix devem ser reportados em até 24h</span></li>
          </ul>
        </div>

        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="font-semibold text-lg mb-3 text-text">5. Participação em Bolões</h2>
          <ul className="space-y-2 text-sm text-text-muted">
            <li className="flex gap-2"><span className="text-primary font-bold mt-0.5">•</span><span>A compra de cotas é definitiva após confirmação do saldo debitado</span></li>
            <li className="flex gap-2"><span className="text-primary font-bold mt-0.5">•</span><span>O número de jogos e dezenas é definido pelo criador do bolão e não pode ser alterado após abertura</span></li>
            <li className="flex gap-2"><span className="text-primary font-bold mt-0.5">•</span><span>Bolões do tipo "Teimosinha" participam de múltiplos concursos consecutivos — todos os concursos são obrigatórios</span></li>
            <li className="flex gap-2"><span className="text-primary font-bold mt-0.5">•</span><span>A apuração ocorre automaticamente após divulgação do resultado oficial da Caixa</span></li>
          </ul>
        </div>

        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="font-semibold text-lg mb-3 text-text">6. Premiação</h2>
          <ul className="space-y-2 text-sm text-text-muted">
            <li className="flex gap-2"><span className="text-primary font-bold mt-0.5">•</span><span>O prêmio total é calculado com base nas faixas oficiais do concurso Lotofácil</span></li>
            <li className="flex gap-2"><span className="text-primary font-bold mt-0.5">•</span><span>Cada participante recebe proporcionalmente ao número de cotas adquiridas</span></li>
            <li className="flex gap-2"><span className="text-primary font-bold mt-0.5">•</span><span>Cotas não vendidas revertem para o criador do bolão</span></li>
            <li className="flex gap-2"><span className="text-primary font-bold mt-0.5">•</span><span>Os prêmios são creditados automaticamente na carteira virtual após apuração</span></li>
            <li className="flex gap-2"><span className="text-primary font-bold mt-0.5">•</span><span>A plataforma não cobra taxas administrativas sobre os prêmios</span></li>
          </ul>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-5">
          <h2 className="font-semibold text-lg mb-3 text-green-800">7. Direito de Arrependimento (CDC Art. 49)</h2>
          <p className="text-green-700 text-sm leading-relaxed">
            Em conformidade com o Código de Defesa do Consumidor, você tem direito de se arrepender
            da compra de cotas em até <strong>7 (sete) dias corridos</strong> a partir da data da transação,
            desde que o bolão ainda não tenha sido fechado ou o concurso não tenha ocorrido.
            Para solicitar o cancelamento, entre em contato pelo e-mail de suporte dentro do prazo.
          </p>
        </div>

        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="font-semibold text-lg mb-3 text-text">8. Conduta Proibida</h2>
          <ul className="space-y-2 text-sm text-text-muted">
            <li className="flex gap-2"><span className="text-danger font-bold mt-0.5">•</span><span>Criar múltiplas contas ou compartilhar conta com terceiros</span></li>
            <li className="flex gap-2"><span className="text-danger font-bold mt-0.5">•</span><span>Tentar manipular resultados, sistemas ou processos da plataforma</span></li>
            <li className="flex gap-2"><span className="text-danger font-bold mt-0.5">•</span><span>Usar a plataforma para lavagem de dinheiro ou atividades ilícitas</span></li>
            <li className="flex gap-2"><span className="text-danger font-bold mt-0.5">•</span><span>Realizar ataques técnicos, scraping automatizado ou exploração de vulnerabilidades</span></li>
          </ul>
          <p className="text-text-muted text-sm mt-3">
            Violações resultarão em suspensão imediata da conta e, se aplicável, notificação às autoridades.
          </p>
        </div>

        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="font-semibold text-lg mb-3 text-text">9. Limitação de Responsabilidade</h2>
          <p className="text-text-muted text-sm leading-relaxed">
            A plataforma não se responsabiliza por: indisponibilidade temporária do serviço por manutenção
            ou falhas técnicas; atrasos no resultado dos concursos por parte da Caixa Econômica Federal;
            falhas em pagamentos causadas por indisponibilidade do Mercado Pago ou do sistema bancário.
            A plataforma envidará todos os esforços para resolver prontamente qualquer problema.
          </p>
        </div>

        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="font-semibold text-lg mb-3 text-text">10. Encerramento de Conta</h2>
          <p className="text-text-muted text-sm leading-relaxed">
            Você pode solicitar o encerramento da sua conta a qualquer momento pelo e-mail de suporte.
            Após encerramento, dados pessoais serão eliminados, exceto registros financeiros retidos por
            obrigação legal. A plataforma pode encerrar contas que violem estes termos sem aviso prévio.
          </p>
        </div>

        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="font-semibold text-lg mb-3 text-text">11. Disposições Gerais</h2>
          <ul className="space-y-2 text-sm text-text-muted">
            <li className="flex gap-2"><span className="text-primary font-bold mt-0.5">•</span><span>Estes termos são regidos pela <strong className="text-text">legislação brasileira</strong></span></li>
            <li className="flex gap-2"><span className="text-primary font-bold mt-0.5">•</span><span>Foro eleito: comarca de <strong className="text-text">São Paulo/SP</strong>, com renúncia a qualquer outro</span></li>
            <li className="flex gap-2"><span className="text-primary font-bold mt-0.5">•</span><span>Alterações nos termos serão comunicadas com antecedência mínima de 15 dias</span></li>
            <li className="flex gap-2"><span className="text-primary font-bold mt-0.5">•</span><span>O uso continuado após alterações implica aceitação dos novos termos</span></li>
          </ul>
        </div>

      </div>
    </div>
  )
}
