Para transformar o **Finance Freedom** de um gerenciador passivo em um **Assistente Pessoal Financeiro** proativo, a aplicação deve evoluir para um ecossistema que não apenas registra o passado, mas antecipa o futuro e orienta o comportamento do usuário.

Com base na arquitetura atual (NestJS/React/Prisma) e nas necessidades específicas identificadas, como a gestão de múltiplas dívidas e o interesse em crescimento patrimonial, apresento o roteiro de recursos para a "V2.0 - Inteligência Proativa".

---

## 1. Fundação: Integridade de Dados e Multimoedas

O assistente só é confiável se os dados forem reflexos exatos da realidade.

- **Motor de Conversão Global (Multi-currency Core):**
- Implementação de suporte nativo a moedas estrangeiras em nível de transação.
- **Recurso:** Integração com APIs de câmbio para atualização diária e armazenamento do `exchangeRate` no momento da transação, permitindo visualizar o patrimônio líquido em uma "Moeda Base" (ex: BRL) independente da origem dos ativos.

- **Modo Conciliação e Auditoria:**
- **Recurso:** Ferramenta de "Check-point" de saldo. Se o saldo real do banco divergir do app, o assistente sugere uma transação de ajuste e tenta identificar a "transação fantasma" ausente.

- **Encriptação de Nível Bancário para Credenciais:**
- Melhoria no `ConfigService` para utilizar _Hardware Security Modules_ (HSM) ou cofres de senhas (como HashiCorp Vault) para as credenciais IMAP.

---

## 2. Estratégia Avançada de Dívidas (Survival Mode)

O sistema deve agir como um consultor de crise para dívidas complexas (como as mencionadas com Mercado Pago, PicPay e Banco Inter).

- **Rastreador de Negociações:**
- **Recurso:** Uma sub-tabela vinculada a cada `Debt` para registrar tentativas de acordo, propostas de desconto e datas de prescrição.

- **Ranking de Estresse Psicológico:**
- Além de Snowball e Avalanche, adicionar o critério "Mental Peace". O usuário atribui um peso de "incômodo" para cada credor (ex: cobranças agressivas). O assistente prioriza o fim do estresse.

- **Redirecionamento Automático de "Bola de Neve":**
- Ao quitar uma dívida, o assistente não apenas comemora, mas pergunta: "Deseja redirecionar os R$ 500,00 mensais da PicPay diretamente para sua Reserva de Emergência?".

---

## 3. Gestão de Riqueza e Crescimento Patrimonial

Transformar o "WealthWidget" em um motor de projeção real.

- **Asset Allocation & Rebalancing:**
- **Recurso:** Cadastro de ativos por classe (Renda Fixa, Ações, Cripto, Imóveis). O assistente alerta quando uma classe excede o percentual desejado (ex: "Sua exposição em Cripto subiu para 20%, considere rebalancear").

- **Simulador de Juros Compostos em Tempo Real:**
- Utilização de fórmulas matemáticas para projetar a liberdade financeira.
-
- Onde é o valor futuro, o aporte mensal, a taxa de juros e o número de meses. O assistente mostra como cada R$ 100,00 economizados hoje impactam o em 10 anos.

- **Calculadora de "Poder de Compra Real":**
- Ajuste automático de todas as metas de poupança pela inflação acumulada (IPCA/IGP-M).

---

## 4. Inteligência de Comportamento (O "Assistente")

Recursos que transformam dados em conselhos práticos.

- **Auditoria de "Gastos Vampiros":**
- O `SmartMergerService` identifica assinaturas recorrentes que não foram utilizadas ou que tiveram aumento de preço sem aviso, sugerindo o cancelamento.

- **Simulador de Custo de Oportunidade Contextual:**
- Ao tentar cadastrar uma despesa alta (ex: novos eletrônicos), o sistema exibe um alerta: "Este valor equivale a 15% da sua dívida no Banco Inter. Comprar agora adiará sua quitação em 2 meses".

- **Health Score 2.0:**
- Evolução do `HealthScoreService` para incluir métricas de "Resiliência" (quantos meses você sobrevive se a renda parar hoje).

---

## 5. Próximos Passos Técnicos de Implementação

Para suportar essa evolução mantendo a qualidade, a arquitetura deve ser atualizada:

### Nova Estrutura de Tabelas (Prisma)

> **Nota:** Adicionar suporte a `Currency` e `TransactionMetadata`.

```prisma
model Transaction {
  // ... campos existentes
  originalAmount   Decimal
  originalCurrency String   @default("BRL")
  exchangeRate     Decimal  @default(1.0)
  tags             String[] // Para análise comportamental
  metadata         Json?    // Para links de negociação ou comprovantes
}
```

```javascript
/**
 * Description:
 * Engine that analyzes user data to generate proactive financial advice.
 * Properties summary:
 *   - _debtService {DebtService} : Access to debt calculation logic.
 *   - _incomeService {IncomeService} : Access to income data.
 * Business rules:
 *   - Generate notification when a debt is finished to redirect funds.
 *   - Warn about high-interest debt when new income is detected.
 */
export class FinancialAdvisorEngine {
    _debtService;
    _incomeService;

    constructor(debtService, incomeService) {
        const me = this;
        me._debtService = debtService;
        me._incomeService = incomeService;
    }

    async generateNextAction(userId) {
        // Implement logic to compare net worth growth vs debt interest
    }
}
```

---

### Diagnóstico de Impacto

1. **Consistência:** O Modo Conciliação elimina a desconfiança nos números.
2. **Flexibilidade:** O motor Multimoedas permite que o usuário gerencie compras internacionais e investimentos globais.
3. **Dívidas:** O Rastreador de Negociações tira o peso mental da gestão de múltiplos credores.
4. **Crescimento:** O Asset Allocation transforma o app de um "extrato" em um "portfólio".
