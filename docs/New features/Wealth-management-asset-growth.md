Este relatório detalha o planejamento estratégico para a implementação do módulo de **Gestão de Riqueza e Crescimento Patrimonial** no Finance Freedom. O objetivo é evoluir a plataforma de um simples rastreador de despesas para um motor de acumulação de ativos, focado em alocação estratégica, rebalanceamento e projeções de longo prazo.

---

## 1. Visão Geral e Objetivos

A gestão de riqueza no Finance Freedom visa transformar o "excedente" (renda menos despesas e dívidas) em patrimônio produtivo. Atualmente, o sistema já possui uma base para `InvestmentAccount` e metas de economia, que serão integradas a um motor de inteligência patrimonial.

### Objetivos Principais:

- **Consolidação de Ativos:** Visão unificada de contas correntes, investimentos e bens.
- **Alocação de Ativos (Asset Allocation):** Definição de metas percentuais por classe de ativo.
- **Projeção de Independência:** Cálculo de valor futuro baseado em aportes reais e taxas históricas.
- **Custo Zero:** Utilização de índices de mercado abertos (IPCA, SELIC, CDI) sem taxas de assinatura.

---

## 2. Modelagem de Dados e Expansão (Prisma)

Para suportar o crescimento patrimonial, o esquema de dados deve ir além do saldo simples, permitindo categorizar a natureza do ativo e sua rentabilidade esperada.

### Evolução do `schema.prisma`:

```prisma
model InvestmentAccount {
  // ... campos existentes
  assetClass    AssetClass @default(CASH)
  targetPercent Decimal?   // Percentual desejado no portfólio
  expectedReturn Decimal?  // Rentabilidade anual estimada (%)
  isTaxable     Boolean    @default(true)
}

enum AssetClass {
  CASH          // Liquidez imediata
  FIXED_INCOME  // Renda Fixa (CDB, Tesouro)
  STOCKS        // Ações / Renda Variável
  REAL_ESTATE   // Imóveis / FIIs
  CRYPTO        // Criptoativos
  OTHER         // Bens diversos
}

```

---

## 3. Motor de Alocação e Rebalanceamento

O sistema deve ajudar o usuário a manter o risco sob controle através do rebalanceamento.

- **Cálculo de Desvio:** O assistente compara o percentual atual de cada `AssetClass` contra o `targetPercent` definido.
- **Sugestão de Aporte:** Ao detectar um novo saldo disponível, o sistema sugere investir na classe que está "abaixo" da meta, seguindo a filosofia de "comprar na baixa".
- **Confiabilidade:** Os cálculos utilizam transações atômicas para garantir que movimentações entre contas de investimento e contas correntes mantenham o saldo global consistente.

---

## 4. Projeções e Matemática Financeira

A implementação de projeções utilizará os dados de renda real capturados pelo `IncomeService` e os simuladores de economia já presentes no `SimulatorService`.

### Cálculo de Valor Futuro ()

Para projetar o crescimento patrimonial com aportes mensais constantes (), taxa de juros () e tempo em meses (), utilizaremos a fórmula de juros compostos para séries de pagamentos:

### Simulação de Independência Financeira:

1. **Custo de Vida Real:** Extraído automaticamente da média de `TransactionService` (despesas).
2. **Taxa de Retirada Segura:** O sistema aplica a regra dos 4% (ou personalizada pelo usuário) para calcular o "Número da Liberdade".
3. **Ajuste por Inflação:** Utilização de dados históricos (ex: BCB/Ptax) para projetar o poder de compra real.

---

## 5. Implementação Técnica (Service Pattern)

Seguindo os padrões de codificação do projeto, a lógica de riqueza será centralizada em um novo serviço especializado.

```javascript
/**
 * Description:
 * Service responsible for wealth growth logic and portfolio rebalancing.
 *
 * Properties summary:
 * - _investmentService {InvestmentAccountService} : Access to investment data.
 * - _transactionService {TransactionService} : Access to cash flow data.
 *
 * Typical usage:
 * const plan = await me.calculateRebalancingPlan(userId);
 *
 * Business rules implemented:
 * - Never suggest selling assets unless specifically requested.
 * - Prioritize emergency fund before high-risk allocations.
 * - Use real historical data for base return estimates.
 */
export class WealthGrowthService {
    _investmentService;
    _transactionService;

    constructor(investmentService, transactionService) {
        const me = this;
        me._investmentService = investmentService;
        me._transactionService = transactionService;
    }

    /**
     * Calculates the future value of the current portfolio.
     * @param {string} userId User identifier.
     * @param {number} monthlyAporte Amount to invest monthly.
     * @param {number} years Investment horizon.
     * @returns {Promise<object>} Projected wealth and interest.
     */
    async projectWealth(userId, monthlyAporte, years) {
        const me = this;
        // Logic using the compound interest formula...
    }
}
```

---

## 6. Estratégia de Dados e Próximos Passos

Para garantir **custo zero**, o sistema não assinará provedores de dados de corretoras. Em vez disso:

1. **Atualização Manual/OFX:** O usuário importa o extrato da corretora via `ImportModule`.
2. **Web Scraping/APIs Públicas:** Uso de dados do Banco Central para indexadores (SELIC/IPCA).
3. **Segurança:** Todas as chaves de API e credenciais de investimento são criptografadas no `ConfigService`.

### Plano de Execução:

- **Etapa 1:** Atualizar o banco de dados para suportar `AssetClass` e metas de alocação.
- **Etapa 2:** Criar o `WealthGrowthService` com as fórmulas de projeção.
- **Etapa 3:** Desenvolver o dashboard de rebalanceamento no frontend utilizando Recharts.
