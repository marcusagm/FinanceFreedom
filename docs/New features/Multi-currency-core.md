Este relatório detalha o planejamento técnico para a implementação do **Motor de Conversão Global (Multi-currency Core)** no ecossistema Finance Freedom. O objetivo é permitir que o sistema gerencie transações e contas em diversas moedas, consolidando o patrimônio líquido em uma moeda base definida pelo usuário, mantendo a soberania de dados e custo zero.

---

## 1. Arquitetura do Motor (Plugin Pattern)

Para garantir flexibilidade e permitir que o usuário customize os provedores de dados, utilizaremos o **Strategy Pattern** aliado a um sistema de **Plugins**. O núcleo do sistema interagirá apenas com uma interface abstrata, enquanto implementações específicas (Frankfurter, BCB, etc.) lidarão com as particularidades de cada API.

### Interface do Provedor

Cada plugin de conversão deve implementar a interface `CurrencyProvider`.

```javascript
/**
 * Description:
 * Interface definition for currency exchange rate providers.
 *
 * Typical usage:
 * class FrankfurterProvider implements CurrencyProvider { ... }
 *
 * Business rules implemented:
 * - Must return rates relative to a base currency.
 * - Must support historical rate fetching for historical transactions.
 *
 * Dependencies:
 * - None
 */
export class CurrencyProvider {
    /**
     * Fetches the exchange rate between two currencies for a specific date.
     * @param {string} fromCurrency Original currency code (ISO 4217).
     * @param {string} toCurrency Target currency code (ISO 4217).
     * @param {Date} date Reference date for the rate.
     * @returns {Promise<number>} The exchange rate value.
     * @throws {Error} If the rate cannot be fetched.
     * @abstract
     */
    async getRate(fromCurrency, toCurrency, date) {
        throw new Error("Method 'getRate()' must be implemented.");
    }
}
```

---

## 2. Modelagem de Dados (Prisma Schema)

Para suportar multimoedas, as tabelas de `Account` e `Transaction` precisam ser atualizadas no arquivo `schema.prisma`.

### Alterações Sugeridas

- **Account:** Adição do campo `currency` para definir a moeda nativa da conta.
- **Transaction:** Adição de `originalAmount`, `originalCurrency` e `exchangeRate`.
- **ExchangeRateCache:** Nova tabela para persistir taxas já consultadas e garantir funcionamento offline/custo zero.

```prisma
model Account {
  // ... campos existentes
  currency String @default("BRL")
}

model Transaction {
  // ... campos existentes
  originalAmount   Decimal? // Valor na moeda da transação
  originalCurrency String?  // Moeda da transação (ex: USD)
  exchangeRate     Decimal? // Taxa aplicada no momento da transação
}

model ExchangeRateCache {
  id        String   @id @default(uuid())
  pair      String   // Ex: "USD-BRL"
  rate      Decimal
  date      DateTime
  provider  String   // Identificador do plugin usado
  createdAt DateTime @default(now())

  @@unique([pair, date])
}

```

---

## 3. Implementação dos Plugins (Provedores)

Seguiremos uma ordem de prioridade baseada na confiabilidade e gratuidade.

### Tabela de Comparação de APIs

| Provedor           | Foco Principal     | Limite Gratuito           | Confiabilidade                       |
| ------------------ | ------------------ | ------------------------- | ------------------------------------ |
| **BCB (Ptax)**     | BRL (Moeda Real)   | Ilimitado (Dados Abertos) | **Crítica** para usuários no Brasil. |
| **Frankfurter**    | EUR/USD/Principais | Ilimitado (Open Data)     | Alta (Dados do ECB).                 |
| **AwesomeAPI**     | Moedas/Crypto/BRL  | Amplo (Sem chaves)        | Alta (Foco em economia BR).          |
| **CurrencyFreaks** | Global/Específicas | 1.000 req/mês             | Média (Necessita API Key).           |

### Lógica de Conversão Matemática

A conversão básica para consolidação do saldo segue a fórmula:

Onde:

- : Valor convertido na moeda base do sistema.
- : Valor original da transação ou saldo da conta.
- : Taxa de câmbio (_Exchange Rate_) obtida via plugin.

---

## 4. Estratégia de Confiabilidade e Custo Zero

Para garantir que o usuário nunca seja cobrado e que o sistema seja resiliente, implementaremos as seguintes regras no `CurrencyService`:

1. **Cache First:** Antes de qualquer chamada externa, o sistema consulta a tabela `ExchangeRateCache`.
2. **Sequência de Fallback:** Se o provedor primário falhar, o sistema tenta o próximo da lista automaticamente.

- _Exemplo:_ Para par USD-BRL: **BCB** **AwesomeAPI** **Frankfurter**.

3. **Normalização de Data:** Como o mercado de câmbio não opera em fins de semana, o motor buscará automaticamente o último dia útil anterior caso a data solicitada não possua cotação.

---

## 5. Exemplo de Implementação: MultiCurrencyService

```javascript
/**
 * Description:
 * Core service for handling multi-currency logic and consolidation.
 *
 * Properties summary:
 * - _prisma {PrismaService} : Database instance.
 * - _providers {Map<string, CurrencyProvider>} : Registered plugins.
 *
 * Typical usage:
 * const value = await me.convert(100, "USD", "BRL", new Date());
 *
 * Business rules implemented:
 * - Check local cache before API calls.
 * - Execute fallback sequence on provider failure.
 * - Precision handling for financial calculations.
 *
 * Dependencies:
 * - {import('../../prisma/prisma.service.js').default}
 */
export class MultiCurrencyService {
    /**
     * Database client
     * @type {PrismaService}
     * private
     */
    _prisma;

    /**
     * Map of available providers
     * @type {Map}
     * private
     */
    _providers = new Map();

    constructor(prisma) {
        this._prisma = prisma;
    }

    /**
     * Converts an amount from one currency to another.
     * @param {number} amount Value to convert.
     * @param {string} from Original currency.
     * @param {string} to Target currency.
     * @param {Date} date Reference date.
     * @returns {Promise<number>} Converted value.
     */
    async convert(amount, from, to, date) {
        const me = this;

        if (from === to) {
            return amount;
        }

        const rate = await me._getExchangeRate(from, to, date);
        return Number(amount) * Number(rate);
    }

    /**
     * Internal method to fetch rates with fallback logic.
     * private
     */
    async _getExchangeRate(from, to, date) {
        const me = this;
        // Logic to check cache, then iterate providers...
        // Use console.warn for recoverable failures during provider fallback.
    }
}
```

---

## 6. Diagnóstico e Próximos Passos

### Pontos Críticos

- **Precisão Decimais:** O uso de `Decimal` no Prisma é essencial para evitar erros de arredondamento em conversões sucessivas.
- **Latência:** Chamadas IMAP assíncronas devem ser coordenadas com a busca de taxas para que o `SmartImport` já registre o valor convertido.

### Plano de Execução Sugerido

1. **Etapa 1:** Atualização do Schema Prisma (Accounts e Transactions).
2. **Etapa 2:** Criação da infraestrutura de Cache e interface `CurrencyProvider`.
3. **Etapa 3:** Implementação do Plugin **BCB (PTAX)** como provedor padrão para BRL.
4. **Etapa 4:** Integração no Frontend para exibição de valores em múltiplas moedas.
