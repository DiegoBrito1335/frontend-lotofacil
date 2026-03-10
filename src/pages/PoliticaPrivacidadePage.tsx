import { Shield } from 'lucide-react'

export default function PoliticaPrivacidadePage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text flex items-center gap-2">
          <Shield className="w-6 h-6 text-primary" />
          Política de Privacidade
        </h1>
        <p className="text-text-muted text-sm mt-1">
          Última atualização: março de 2026
        </p>
      </div>

      <div className="space-y-4">

        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="font-semibold text-lg mb-3 text-text">1. Responsável pelo Tratamento</h2>
          <p className="text-text-muted text-sm leading-relaxed">
            A plataforma <strong className="text-text">Bolão Lotofácil</strong> é operada de forma independente,
            não sendo afiliada à Caixa Econômica Federal, ao Governo Federal ou a qualquer órgão oficial.
            Para dúvidas sobre privacidade, entre em contato pelo e-mail disponível na seção de suporte.
          </p>
        </div>

        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="font-semibold text-lg mb-3 text-text">2. Dados Coletados</h2>
          <p className="text-text-muted text-sm mb-3">Coletamos os seguintes dados pessoais:</p>
          <ul className="space-y-2 text-sm text-text-muted">
            <li className="flex gap-2">
              <span className="text-primary font-bold mt-0.5">•</span>
              <span><strong className="text-text">Nome completo</strong> — fornecido no cadastro, exibido no perfil</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold mt-0.5">•</span>
              <span><strong className="text-text">E-mail</strong> — usado para autenticação, confirmação de conta e comunicações</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold mt-0.5">•</span>
              <span><strong className="text-text">Telefone</strong> — opcional, fornecido no perfil do usuário</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold mt-0.5">•</span>
              <span><strong className="text-text">Chave Pix</strong> — opcional, para recebimento de prêmios</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold mt-0.5">•</span>
              <span><strong className="text-text">Dados de transações</strong> — histórico de depósitos, compras de cotas e prêmios</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold mt-0.5">•</span>
              <span><strong className="text-text">Dados de acesso</strong> — logs de erro e métricas de desempenho (sem identificação pessoal)</span>
            </li>
          </ul>
        </div>

        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="font-semibold text-lg mb-3 text-text">3. Finalidade do Tratamento</h2>
          <ul className="space-y-2 text-sm text-text-muted">
            <li className="flex gap-2">
              <span className="text-primary font-bold mt-0.5">•</span>
              <span>Autenticação e controle de acesso à plataforma</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold mt-0.5">•</span>
              <span>Processamento de pagamentos via Pix (Mercado Pago)</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold mt-0.5">•</span>
              <span>Distribuição de prêmios e gestão da carteira virtual</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold mt-0.5">•</span>
              <span>Comunicação sobre sua conta e participações</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold mt-0.5">•</span>
              <span>Monitoramento técnico para garantir estabilidade e segurança</span>
            </li>
          </ul>
        </div>

        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="font-semibold text-lg mb-3 text-text">4. Base Legal (LGPD)</h2>
          <ul className="space-y-2 text-sm text-text-muted">
            <li className="flex gap-2">
              <span className="text-primary font-bold mt-0.5">•</span>
              <span><strong className="text-text">Execução de contrato</strong> (Art. 7°, V) — dados necessários para operar a conta, processar pagamentos e distribuir prêmios</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold mt-0.5">•</span>
              <span><strong className="text-text">Legítimo interesse</strong> (Art. 7°, IX) — monitoramento de erros técnicos via Sentry para garantir a segurança da plataforma</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold mt-0.5">•</span>
              <span><strong className="text-text">Obrigação legal</strong> (Art. 7°, II) — retenção de registros financeiros conforme legislação fiscal brasileira</span>
            </li>
          </ul>
        </div>

        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="font-semibold text-lg mb-3 text-text">5. Compartilhamento de Dados</h2>
          <p className="text-text-muted text-sm mb-3">Seus dados podem ser compartilhados com os seguintes prestadores de serviço:</p>
          <ul className="space-y-3 text-sm text-text-muted">
            <li className="flex gap-2">
              <span className="text-primary font-bold mt-0.5">•</span>
              <div>
                <strong className="text-text">Supabase Inc. (EUA)</strong> — armazenamento do banco de dados.
                Dados transferidos para os EUA com garantias contratuais adequadas.
              </div>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold mt-0.5">•</span>
              <div>
                <strong className="text-text">Mercado Pago</strong> — processamento de pagamentos Pix.
                Sujeito à Política de Privacidade do Mercado Pago.
              </div>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold mt-0.5">•</span>
              <div>
                <strong className="text-text">Sentry (EUA)</strong> — monitoramento de erros técnicos.
                <strong className="text-text"> Nenhum dado pessoal identificável é enviado</strong> — apenas stack traces e logs de erro.
              </div>
            </li>
          </ul>
          <p className="text-text-muted text-sm mt-3">
            Não vendemos, alugamos ou compartilhamos seus dados com terceiros para fins comerciais.
          </p>
        </div>

        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="font-semibold text-lg mb-3 text-text">6. Cookies e Armazenamento Local</h2>
          <ul className="space-y-2 text-sm text-text-muted">
            <li className="flex gap-2">
              <span className="text-primary font-bold mt-0.5">•</span>
              <span><strong className="text-text">Cookie de autenticação</strong> (<code className="bg-slate-100 px-1 rounded text-xs">auth_token</code>) — essencial para manter sua sessão ativa. HttpOnly e Secure — inacessível por scripts.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold mt-0.5">•</span>
              <span><strong className="text-text">Armazenamento local</strong> (<code className="bg-slate-100 px-1 rounded text-xs">user_name</code>, <code className="bg-slate-100 px-1 rounded text-xs">cookie_consent</code>) — preferências não sensíveis armazenadas no seu dispositivo.</span>
            </li>
          </ul>
        </div>

        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="font-semibold text-lg mb-3 text-text">7. Retenção de Dados</h2>
          <ul className="space-y-2 text-sm text-text-muted">
            <li className="flex gap-2">
              <span className="text-primary font-bold mt-0.5">•</span>
              <span>Dados de perfil: mantidos enquanto a conta estiver ativa</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold mt-0.5">•</span>
              <span>Registros financeiros: mínimo de 5 anos por obrigação fiscal</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold mt-0.5">•</span>
              <span>Logs técnicos: 90 dias</span>
            </li>
          </ul>
        </div>

        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="font-semibold text-lg mb-3 text-text">8. Seus Direitos (LGPD Art. 18)</h2>
          <p className="text-text-muted text-sm mb-3">Como titular dos dados, você tem direito a:</p>
          <ul className="space-y-2 text-sm text-text-muted">
            <li className="flex gap-2"><span className="text-primary font-bold mt-0.5">•</span><span><strong className="text-text">Acesso</strong> — saber quais dados temos sobre você</span></li>
            <li className="flex gap-2"><span className="text-primary font-bold mt-0.5">•</span><span><strong className="text-text">Retificação</strong> — corrigir dados incompletos ou incorretos</span></li>
            <li className="flex gap-2"><span className="text-primary font-bold mt-0.5">•</span><span><strong className="text-text">Eliminação</strong> — solicitar exclusão dos dados, ressalvadas obrigações legais</span></li>
            <li className="flex gap-2"><span className="text-primary font-bold mt-0.5">•</span><span><strong className="text-text">Portabilidade</strong> — receber seus dados em formato estruturado</span></li>
            <li className="flex gap-2"><span className="text-primary font-bold mt-0.5">•</span><span><strong className="text-text">Revogação do consentimento</strong> — quando o tratamento for baseado em consentimento</span></li>
          </ul>
          <p className="text-text-muted text-sm mt-3">
            Para exercer seus direitos, entre em contato pelo e-mail de suporte. Responderemos em até 15 dias úteis.
          </p>
        </div>

        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="font-semibold text-lg mb-3 text-text">9. Segurança</h2>
          <p className="text-text-muted text-sm leading-relaxed">
            Adotamos medidas técnicas de segurança incluindo: comunicação criptografada via HTTPS,
            cookies de autenticação HttpOnly (inacessíveis via JavaScript), hash de senhas gerenciado
            pelo Supabase Auth, e monitoramento contínuo de erros. Nenhum sistema é 100% seguro;
            em caso de incidente, notificaremos os titulares afetados conforme exige a LGPD.
          </p>
        </div>

        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="font-semibold text-lg mb-3 text-text">10. Alterações nesta Política</h2>
          <p className="text-text-muted text-sm leading-relaxed">
            Esta política pode ser atualizada periodicamente. Alterações significativas serão comunicadas
            por e-mail ou notificação na plataforma. O uso continuado após as alterações implica na
            aceitação da nova versão.
          </p>
        </div>

      </div>
    </div>
  )
}
