import { BookOpen, UserPlus, Wallet, Ticket, Trophy, RefreshCw } from 'lucide-react'

export default function ComoJogarPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-primary" />
          Como Jogar
        </h1>
        <p className="text-text-muted text-sm mt-1">Entenda como funciona o Bolão Lotofácil</p>
      </div>

      <div className="space-y-4">
        {/* O que é */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="font-semibold text-lg mb-3 text-text">O que é o Bolão Lotofácil?</h2>
          <p className="text-text-muted text-sm leading-relaxed">
            O Bolão Lotofácil é uma forma de jogar na Lotofácil em grupo, dividindo o custo dos jogos entre vários participantes.
            Em vez de apostar sozinho, você compra <strong>cotas</strong> de um bolão que já tem os jogos definidos.
            Se algum jogo acertar, o prêmio é dividido proporcionalmente entre todos os cotistas.
          </p>
          <p className="text-text-muted text-sm leading-relaxed mt-2">
            Assim, com um investimento menor, você participa de vários jogos ao mesmo tempo, aumentando suas chances de ganhar!
          </p>
        </div>

        {/* Passo a passo */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="font-semibold text-lg mb-4 text-text">Como Participar</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <UserPlus className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-text">1. Crie sua conta</h3>
                <p className="text-text-muted text-sm mt-0.5">
                  Cadastre-se gratuitamente com seu e-mail e senha. Em segundos você já pode começar!
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Wallet className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-text">2. Deposite via Pix</h3>
                <p className="text-text-muted text-sm mt-0.5">
                  Faça um depósito via Pix para sua carteira digital. O crédito é instantâneo e seguro.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Ticket className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-text">3. Escolha um bolão e compre cotas</h3>
                <p className="text-text-muted text-sm mt-0.5">
                  Na página de bolões, escolha o que mais te interessa. Veja os jogos, o valor da cota e quantas estão disponíveis.
                  Compre uma ou mais cotas diretamente do seu saldo.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Trophy className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-text">4. Aguarde o resultado</h3>
                <p className="text-text-muted text-sm mt-0.5">
                  Após o sorteio da Lotofácil, os resultados são apurados automaticamente.
                  Se o bolão ganhar, o prêmio é distribuído proporcionalmente e creditado na sua carteira!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Como funciona o sorteio */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="font-semibold text-lg mb-3 text-text">Como Funciona a Lotofácil</h2>
          <p className="text-text-muted text-sm leading-relaxed">
            A Lotofácil é uma das loterias mais populares do Brasil. Em cada jogo, são escolhidas <strong>15 dezenas</strong> de 01 a 25.
            No sorteio, a Caixa também sorteia 15 dezenas. Ganha quem acertar:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
              <p className="text-lg font-bold text-yellow-700">15 acertos</p>
              <p className="text-xs text-yellow-600">Prêmio principal</p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
              <p className="text-lg font-bold text-yellow-700">14 acertos</p>
              <p className="text-xs text-yellow-600">Prêmio secundário</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
              <p className="text-lg font-bold text-green-700">11 a 13 acertos</p>
              <p className="text-xs text-green-600">Prêmios menores</p>
            </div>
          </div>
        </div>

        {/* Premiação */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="font-semibold text-lg mb-3 text-text">Premiação e Distribuição</h2>
          <p className="text-text-muted text-sm leading-relaxed">
            Quando um jogo do bolão acerta 11 ou mais números, o prêmio correspondente é consultado automaticamente
            na tabela oficial da Caixa. O valor do prêmio é então <strong>dividido proporcionalmente</strong> entre todos
            os cotistas do bolão.
          </p>
          <p className="text-text-muted text-sm leading-relaxed mt-2">
            <strong>Exemplo:</strong> Se um bolão tem 10 cotas vendidas e você comprou 2 cotas,
            você recebe 20% do prêmio. O valor é creditado automaticamente na sua carteira digital.
          </p>
        </div>

        {/* Teimosinha */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="font-semibold text-lg mb-3 text-text flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-primary" />
            Teimosinha
          </h2>
          <p className="text-text-muted text-sm leading-relaxed">
            A <strong>Teimosinha</strong> é uma modalidade especial onde os mesmos jogos são repetidos em vários
            concursos consecutivos. Por exemplo, um bolão teimosinha dos concursos 3250 a 3255 joga as mesmas
            dezenas em 6 sorteios seguidos.
          </p>
          <p className="text-text-muted text-sm leading-relaxed mt-2">
            Os prêmios de cada concurso são acumulados. Ou seja, se o bolão ganhar em 3 dos 6 concursos,
            você recebe a soma de todos os prêmios proporcionalmente às suas cotas.
          </p>
        </div>
      </div>
    </div>
  )
}
