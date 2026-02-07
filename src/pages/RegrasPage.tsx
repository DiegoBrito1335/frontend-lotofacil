import { FileText, AlertCircle, Wallet, Trophy, HelpCircle } from 'lucide-react'

export default function RegrasPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text flex items-center gap-2">
          <FileText className="w-6 h-6 text-primary" />
          Regras e Informações
        </h1>
        <p className="text-text-muted text-sm mt-1">Tudo que você precisa saber sobre o Bolão Lotofácil</p>
      </div>

      <div className="space-y-4">
        {/* Regras dos Bolões */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="font-semibold text-lg mb-3 text-text flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-primary" />
            Regras dos Bolões
          </h2>
          <ul className="space-y-2 text-text-muted text-sm">
            <li className="flex gap-2">
              <span className="text-primary font-bold">&bull;</span>
              <span>Cada bolão possui um número definido de cotas disponíveis para compra.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">&bull;</span>
              <span>O valor de cada cota é fixo e definido pelo administrador do bolão.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">&bull;</span>
              <span>Você pode comprar uma ou mais cotas em cada bolão, dependendo da disponibilidade.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">&bull;</span>
              <span>Quando todas as cotas forem vendidas, o bolão é fechado automaticamente.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">&bull;</span>
              <span>Após o sorteio, os resultados são apurados automaticamente e os prêmios são distribuídos.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">&bull;</span>
              <span><strong>Não é possível cancelar uma cota após a compra.</strong> Verifique os jogos antes de comprar.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">&bull;</span>
              <span>Os jogos do bolão (dezenas escolhidas) são visíveis na página de detalhes de cada bolão.</span>
            </li>
          </ul>
        </div>

        {/* Carteira Digital */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="font-semibold text-lg mb-3 text-text flex items-center gap-2">
            <Wallet className="w-5 h-5 text-primary" />
            Carteira Digital
          </h2>
          <ul className="space-y-2 text-text-muted text-sm">
            <li className="flex gap-2">
              <span className="text-primary font-bold">&bull;</span>
              <span>Todo usuário possui uma carteira digital com saldo para compra de cotas.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">&bull;</span>
              <span>Depósitos são feitos exclusivamente via <strong>Pix</strong>, com crédito automático e instantâneo.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">&bull;</span>
              <span>Todas as transações (depósitos, compras e prêmios) ficam registradas no extrato da carteira.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">&bull;</span>
              <span>Prêmios ganhos são creditados automaticamente na carteira após a apuração.</span>
            </li>
          </ul>
        </div>

        {/* Saques */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="font-semibold text-lg mb-3 text-text flex items-center gap-2">
            <Wallet className="w-5 h-5 text-green-600" />
            Saques
          </h2>
          <div className="space-y-3 text-text-muted text-sm">
            <p>
              Para solicitar um saque do seu saldo disponível, entre em contato com o administrador do site.
              O valor será transferido via Pix para a conta informada.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-amber-800 font-medium text-sm flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                Taxa de saque
              </p>
              <p className="text-amber-700 text-sm mt-1">
                Cada saque possui uma taxa fixa de <strong>R$ 0,50</strong> (cinquenta centavos) para manutenção do site.
                Essa taxa é descontada automaticamente do valor sacado.
              </p>
            </div>
            <ul className="space-y-2">
              <li className="flex gap-2">
                <span className="text-primary font-bold">&bull;</span>
                <span>O valor mínimo para saque é de R$ 1,00.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">&bull;</span>
                <span>Saques são processados em até 24 horas úteis.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">&bull;</span>
                <span>Você só pode sacar o saldo disponível (prêmios e depósitos não utilizados).</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Apuração e Prêmios */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="font-semibold text-lg mb-3 text-text flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Apuração e Prêmios
          </h2>
          <ul className="space-y-2 text-text-muted text-sm">
            <li className="flex gap-2">
              <span className="text-primary font-bold">&bull;</span>
              <span>Os resultados são apurados automaticamente após cada sorteio da Lotofácil.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">&bull;</span>
              <span>Jogos que acertam de <strong>11 a 15 números</strong> recebem prêmio conforme tabela oficial da Caixa.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">&bull;</span>
              <span>O prêmio é dividido <strong>proporcionalmente</strong> entre os cotistas. Quem tem mais cotas, recebe mais.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">&bull;</span>
              <span>Após a distribuição, o valor é creditado automaticamente na carteira de cada participante.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">&bull;</span>
              <span>Você pode acompanhar seus resultados na aba <strong>"Resultados"</strong> do menu.</span>
            </li>
          </ul>
        </div>

        {/* FAQ */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="font-semibold text-lg mb-3 text-text flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-primary" />
            Dúvidas Frequentes
          </h2>
          <div className="space-y-4">
            <div>
              <p className="font-medium text-text text-sm">Posso comprar cotas de mais de um bolão?</p>
              <p className="text-text-muted text-sm mt-0.5">
                Sim! Você pode participar de quantos bolões quiser, desde que tenha saldo suficiente.
              </p>
            </div>
            <div>
              <p className="font-medium text-text text-sm">E se nenhum jogo do bolão acertar?</p>
              <p className="text-text-muted text-sm mt-0.5">
                Se nenhum jogo atingir o mínimo de 11 acertos, não há prêmio para distribuir.
                O valor das cotas não é devolvido, pois foi utilizado para o pagamento dos jogos.
              </p>
            </div>
            <div>
              <p className="font-medium text-text text-sm">O que acontece se o bolão não vender todas as cotas?</p>
              <p className="text-text-muted text-sm mt-0.5">
                O bolão pode ser fechado pelo administrador mesmo sem vender todas as cotas.
                Os participantes que compraram continuam concorrendo normalmente.
              </p>
            </div>
            <div>
              <p className="font-medium text-text text-sm">Como sei se ganhei algum prêmio?</p>
              <p className="text-text-muted text-sm mt-0.5">
                Após a apuração, você pode ver os resultados na aba "Resultados" e na página "Minhas Cotas".
                Prêmios são creditados automaticamente na sua carteira.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
