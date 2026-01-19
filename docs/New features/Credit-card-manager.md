Este relatório detalha o planejamento estratégico e técnico para a implementação do módulo de **Controle de Cartões de Crédito** no ecossistema Finance Freedom. O objetivo é oferecer uma gestão granular de limites, faturas e parcelamentos, integrando-se à arquitetura de monorepo modular e garantindo soberania de dados com custo zero.

---

## 1. Visão Geral do Módulo

O controle de cartões de crédito expande o "Livro Razão" do sistema para lidar com a natureza específica de dívidas de curto prazo e limites compartilhados. Ele deve permitir que o usuário visualize não apenas o que já gastou, mas o comprometimento de sua renda futura através de parcelamentos.

### Recursos Essenciais para a Vida Financeira:

- **Gestão de Ciclo de Fatura:** Monitoramento automático de datas de fechamento e vencimento para otimizar o "melhor dia de compra".
- **Controle de Limite Dinâmico:** Cálculo em tempo real do limite total, utilizado e disponível, considerando compras parceladas ainda não lançadas em faturas atuais.
- **Projeção de Faturas Futuras:** Visualização antecipada do valor das próximas faturas com base em parcelamentos ativos.
- **Alertas de Comprometimento:** Notificações quando o valor da fatura ultrapassa um percentual da renda mensal do usuário.

---

## 2. Flexibilidade na Associação de Pagamento

Um ponto crítico de controle é como a fatura será liquidada. O sistema suportará dois modelos operacionais:

### A. Cartão Associado a uma Conta (Débito Automático/Vínculo Direto)

Neste cenário, o cartão está intrinsecamente ligado a uma `Account` específica.

- **Comportamento:** O sistema sugere automaticamente a conta vinculada como origem dos fundos no fechamento da fatura.
- **Vantagem:** Facilita a conciliação bancária proativa, pois o saldo da conta já "reserva" o valor para o vencimento.

### B. Cartão Independente (Pagamento Flexível)

O cartão não possui uma conta de pagamento pré-definida.

- **Comportamento:** No momento do pagamento da fatura, o usuário seleciona manualmente qual `Account` (ou múltiplas contas) será utilizada para liquidar o débito.
- **Vantagem:** Ideal para usuários que gerenciam o fluxo de caixa de forma dinâmica, decidindo onde há mais liquidez apenas na data do vencimento.

---

## 3. Modelagem de Dados (Prisma Schema)

Abaixo, a expansão necessária no `schema.prisma` para suportar estas entidades.

```prisma
model CreditCard {
  id                String        @id @default(uuid())
  name              String
  brand             String        // Visa, Mastercard, etc.
  limit             Decimal
  closingDay        Int           // Dia de fechamento
  dueDay            Int           // Dia de vencimento
  userId            String
  user              User          @relation(fields: [userId], references: [id])
  paymentAccountId  String?       // Conta associada (opcional)
  paymentAccount    Account?      @relation(fields: [paymentAccountId], references: [id])
  transactions      Transaction[]
  createdAt         DateTime      @default(now())
}

model Transaction {
  // ... campos existentes
  creditCardId      String?
  creditCard        CreditCard?   @relation(fields: [creditCardId], references: [id])
  installmentNumber Int?          // Ex: 1
  totalInstallments Int?          // Ex: 12
}

```

---

## 4. Implementação do Serviço de Cartões

Seguindo as diretrizes de codificação (propriedades privadas, JSDoc completo e uso de `me = this`), a estrutura base do serviço será:

```javascript
/**
 * Description:
 * Manages credit card lifecycles, limits, and statement generation.
 *
 * Properties summary:
 * - _prisma {PrismaService} : Database client instance.
 *
 * Typical usage:
 * const availableLimit = await creditCardService.calculateAvailableLimit(cardId);
 *
 * Business rules implemented:
 * - Available limit must subtract all future installments.
 * - Closing and due days must be between 1 and 31.
 * - Payments can be linked to a default account or selected at runtime.
 *
 * Dependencies:
 * - {import('../../prisma/prisma.service.js').default}
 */
export class CreditCardService {
    /**
     * Database client
     * @type {PrismaService}
     * private
     */
    _prisma;

    constructor(prisma) {
        const me = this;
        me.setPrisma(prisma);
    }

    /**
     * Set the prisma service instance.
     * @param {PrismaService} value
     */
    setPrisma(value) {
        this._prisma = value;
    }

    /**
     * Calculates the current available limit considering installments.
     * @param {string} cardId Credit card identifier.
     * @returns {Promise<number>} Available limit value.
     */
    async calculateAvailableLimit(cardId) {
        const me = this;
        const card = await me._prisma.creditCard.findUnique({
            where: { id: cardId },
            include: { transactions: true },
        });

        if (!card) return 0;

        const usedLimit = card.transactions.reduce((total, transaction) => {
            return total + Number(transaction.amount);
        }, 0);

        return Number(card.limit) - usedLimit;
    }
}
```

---

## 5. Confiabilidade de Dados e Custo Zero

A estratégia para garantir precisão sem custos externos baseia-se em:

1. **Smart Import de Faturas:** Utilização do `OfxParserService` e `ImapService` para ler faturas enviadas por e-mail pelos bancos em formato PDF/OFX, evitando dependência de APIs de agregação bancária pagas.
2. **Cálculo Atômico de Saldo:** Assim como no `TransactionService`, o pagamento de uma fatura é tratado como uma transferência atômica entre a `Account` e a dívida acumulada no `CreditCard`.
3. **Processamento Local:** Toda a lógica de parcelamento e projeção de juros (caso haja atraso, usando o `SimulatorService`) ocorre no container Docker do usuário.

## 6. Próximos Passos

1. **Etapa 1:** Atualizar o `schema.prisma` com os novos modelos de `CreditCard` e relações.
2. **Etapa 2:** Implementar a lógica de parcelamento automático no `TransactionService`.
3. **Etapa 3:** Criar a interface de visualização de faturas (Timeline) no Frontend.
