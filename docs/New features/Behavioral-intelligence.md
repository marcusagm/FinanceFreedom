Este relatório detalha o planejamento para a implementação da **Inteligência de Comportamento (O "Assistente")** no Finance Freedom. O objetivo é transformar a plataforma de um repositório passivo de dados em um orientador financeiro proativo que utiliza padrões históricos para prever problemas e sugerir otimizações, mantendo a soberania de dados e o custo zero.

---

## 1. Visão Geral e Objetivos

O "Assistente" atua como a camada lógica que interpreta as transações e saldos para gerar "Financial Nudges" (empurrões financeiros). Ele não apenas registra o que aconteceu, mas analisa o comportamento para evitar gastos desnecessários e maximizar a quitação de dívidas e o crescimento patrimonial.

### Objetivos do Recurso:

- **Detecção de Assinaturas e "Gastos Vampiros"**: Identificar cobranças recorrentes e alertar sobre aumentos de preço ou serviços não utilizados.
- **Análise de Desvio Padrão**: Alertar quando um gasto em uma categoria específica foge da média histórica do usuário.
- **Custo de Oportunidade em Tempo Real**: Converter despesas supérfluas em horas de trabalho ou impacto no prazo de quitação de dívidas.
- **Previsão de Fluxo de Caixa**: Antecipar se o saldo atual será suficiente para cobrir as despesas fixas e parcelas de dívidas até o próximo recebimento.

---

## 2. Modelagem de Dados (Prisma Schema)

Para que o assistente "aprenda" com o usuário, o banco de dados deve armazenar padrões de comportamento e a eficácia dos _insights_ gerados.

```prisma
model BehavioralPattern {
  id                String   @id @default(uuid())
  userId            String
  category          String
  averageAmount     Decimal
  frequencyDays     Int
  lastDetectedAt    DateTime
  confidenceScore   Decimal  // Nível de certeza do padrão (0 a 1)
  isSubscription    Boolean  @default(false)
  createdAt         DateTime @default(now())
}

model AssistantInsight {
  id              String   @id @default(uuid())
  userId          String
  type            String   // VAMPIRE_SPEND, BUDGET_DEVIATION, DEBT_OPPORTUNITY
  title           String
  description     String
  isRead          Boolean  @default(false)
  actionTaken     Boolean  @default(false) // Se o usuário seguiu o conselho
  createdAt       DateTime @default(now())
}

```

---

## 3. Lógica de Inteligência e Gatilhos

O motor de inteligência será executado de forma assíncrona para não impactar a performance da API principal.

- **Identificação de Padrões**: O `SmartMergerService` já calcula assinaturas de transações. O assistente expandirá isso para identificar periodicidade (ex: transações similares a cada 30 dias).
- **Simulação de Impacto**: Utiliza o `SimulatorService` para calcular quanto uma economia sugerida representaria em meses a menos de dívida.
- **Análise de Saúde**: Integra-se ao `HealthScoreService` para gerar alertas quando o índice de endividamento ou a reserva de emergência estiverem em níveis críticos.

---

## 4. Implementação Técnica (Service Pattern)

Abaixo, o modelo do serviço seguindo rigorosamente as diretrizes de codificação e documentação.

```javascript
/**
 * Description:
 * Core engine for behavioral analysis and proactive financial coaching.
 *
 * Properties summary:
 * - _prisma {PrismaService} : Database instance.
 * - _simulator {SimulatorService} : Access to financial simulators.
 *
 * Typical usage:
 * await me.analyzeSpendingPatterns(userId);
 *
 * Business rules implemented:
 * - Only suggest actions that result in zero cost for the user.
 * - Prioritize debt reduction insights over lifestyle spending.
 * - Maintain 100% local processing for privacy.
 *
 * Dependencies:
 * - {import('../../prisma/prisma.service.js').default}
 * - {import('../simulator/simulator.service.js').default}
 */
export class BehavioralAssistantService {
    /**
     * Database client
     * @type {PrismaService}
     * private
     */
    _prisma;

    /**
     * Financial simulator engine
     * @type {SimulatorService}
     * private
     */
    _simulator;

    constructor(prisma, simulator) {
        this._prisma = prisma;
        this._simulator = simulator;
    }

    /**
     * Analyzes recent transactions to identify "vampire spends".
     * @param {string} userId User identifier.
     * @returns {Promise<Array>} List of identified spend patterns.
     */
    async auditVampireSpends(userId) {
        const me = this;
        const transactions = await me._prisma.transaction.findMany({
            where: { userId, type: "EXPENSE" },
            orderBy: { date: "desc" },
            take: 100,
        });

        if (transactions.length < 10) {
            return [];
        }

        // Logic for frequency analysis and anomaly detection...
        return [];
    }
}
```

---

## 5. Estratégia de Confiabilidade e Custo Zero

- **Processamento Local**: Diferente de assistentes baseados em nuvem (como IA generativa comercial), o processamento é feito inteiramente no servidor NestJS do usuário (Docker/SQLite), garantindo custo zero e privacidade total.
- **Heurísticas vs. ML**: Em vez de modelos de Machine Learning pesados e caros, utilizaremos algoritmos de detecção de anomalias estatísticos (Z-Score) e análise de séries temporais simples, que são eficientes em hardware doméstico.
- **Consistência**: Toda recomendação de "Ajuste" ou "Redirecionamento" passa pelo `TransactionService` utilizando transações interativas para evitar corrupção de saldo.

---

## 6. Diagnóstico e Próximos Passos

### Riscos:

- **Falsos Positivos**: O assistente pode identificar uma compra parcelada legítima como um "gasto vampiro". O sistema deve permitir que o usuário marque padrões como "ignorados".

### Plano de Execução:

1. **Fase 1**: Implementar a tabela de `AssistantInsight` e o widget básico no Dashboard.
2. **Fase 2**: Implementar o motor de detecção de assinaturas recorrentes.
3. **Fase 3**: Integrar o assistente às notificações do sistema para alertas em tempo real.
