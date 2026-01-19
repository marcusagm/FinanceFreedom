Este relatório detalha o planejamento estratégico e técnico para a implementação da **Calculadora de "Poder de Compra Real"** no ecossistema Finance Freedom. O objetivo é fornecer ao usuário uma visão clara da desvalorização monetária ao longo do tempo, permitindo o ajuste de metas e rendas para valores reais (inflacionados), garantindo a soberania de dados e custo zero.

---

## 1. Visão Geral e Objetivos

Diferente de um saldo nominal, o **Poder de Compra Real** reflete a capacidade de aquisição do usuário após o ajuste por índices de preços. Esta ferramenta transformará o Finance Freedom em um assistente proativo que alerta se o crescimento patrimonial ou os aumentos salariais estão, de fato, superando a inflação.

### Objetivos do Recurso:

- **Ajuste Histórico:** Converter valores do passado para o presente (Ex: "Quanto valem hoje os R$ 1.000,00 que guardei em 2020?").
- **Projeção de Metas Reais:** Ajustar o "Número da Liberdade" pela inflação estimada para garantir que o objetivo futuro mantenha o estilo de vida desejado.
- **Auditoria de Renda:** Analisar se os reajustes de fontes de renda (`IncomeSource`) acompanharam o IPCA/IGP-M.

---

## 2. Fontes de Dados (Confiabilidade e Custo Zero)

Para manter o compromisso de custo zero, utilizaremos APIs de dados abertos governamentais e de provedores comunitários.

- **BCB (SGS - Sistema Gerenciador de Séries Temporais):** Fonte primária e oficial para índices brasileiros.
- **IPCA:** Série 433.
- **IGP-M:** Série 189.
- **SELIC:** Série 11.

- **IBGE API:** Dados detalhados de inflação por categoria.
- **AwesomeAPI:** Acesso rápido a índices e moedas sem necessidade de chaves de API.

---

## 3. Arquitetura e Implementação (Backend)

Seguindo o padrão de **Plugins** e **Strategy** já planejado para o motor multimoedas, o módulo de inflação será agnóstico quanto à fonte de dados.

### A. Modelo de Dados (Prisma)

Implementaremos uma tabela de cache para evitar chamadas externas redundantes e garantir o funcionamento offline.

```prisma
model InflationIndex {
  id        String   @id @default(uuid())
  name      String   // Ex: "IPCA", "IGP-M"
  value     Decimal  // Valor do índice no mês
  date      DateTime // Mês/Ano de referência
  createdAt DateTime @default(now())

  @@unique([name, date])
}

```

### B. Lógica de Cálculo

A fórmula para o ajuste do valor nominal () para o valor real () baseia-se no índice acumulado:

Onde representa o número índice da inflação acumulada para as respectivas datas.

---

## 4. Implementação do Serviço (Padrões de Código)

Abaixo, o modelo do serviço conforme as diretrizes de documentação e encapsulamento do projeto.

```javascript
/**
 * Description:
 * Service responsible for managing inflation indices and calculating real purchasing power.
 *
 * Properties summary:
 * - _prisma {PrismaService} : Instance of the database client for index caching.
 *
 * Business rules implemented:
 * - Fetch indices from public APIs (BCB/SGS) at zero cost.
 * - Cache data locally to minimize latency and external dependencies.
 * - Calculate accumulated inflation between two dates.
 *
 * Dependencies:
 * - {import('../../prisma/prisma.service.js').default}
 */
export class InflationService {
    /**
     * Database client instance
     * @type {PrismaService}
     * private
     */
    _prisma;

    constructor(prisma) {
        this._prisma = prisma;
    }

    /**
     * Calculates the real value of an amount between two dates.
     * @param {number} amount The nominal amount to be adjusted.
     * @param {Date} fromDate The original date of the value.
     * @param {Date} toDate The target date for adjustment (usually today).
     * @param {string} indexName The inflation index to use (default: IPCA).
     * @returns {Promise<number>} The adjusted real value.
     */
    async calculateRealValue(amount, fromDate, toDate, indexName = "IPCA") {
        const me = this;
        // Internal logic to fetch indices and apply the formula
    }
}
```

---

## 5. Integração com Módulos Existentes

- **Income Module:** Adicionar um gráfico de "Renda Real" que sobrepõe a renda nominal à linha da inflação, evidenciando ganhos ou perdas de poder de compra.
- **Savings Goals:** Ajustar automaticamente a barra de progresso das metas (`SavingsGoal`) com base na inflação projetada, informando o usuário se ele precisa aumentar o aporte para atingir o valor real desejado.
- **Dashboard:** Adicionar um "Widget de Erosão" que mostra quanto o saldo parado nas contas bancárias perdeu de valor no último mês devido à inflação.

---

## 6. Plano de Execução

1. **Etapa 1:** Atualização do `schema.prisma` com a tabela `InflationIndex` e migração do banco.
2. **Etapa 2:** Implementação do `InflationService` com integração inicial via **API do Banco Central (SGS)** para IPCA.
3. **Etapa 3:** Criação de rotas na API para que o Frontend possa consultar o valor real de qualquer montante.
4. **Etapa 4:** Atualização do Frontend para exibir selos de "Valor Real" ao lado dos saldos nominais em telas de Relatórios e Metas.
