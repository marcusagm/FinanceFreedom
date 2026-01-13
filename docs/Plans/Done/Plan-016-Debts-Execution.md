# Plan-016 - Execução de Dívidas

**Objetivo:** Habilitar o fluxo de pagamento de dívidas diretamente da visualização de estratégia.

## 1. Arquivos Afetados

-   `apps/web/src/pages/Debts.tsx`
-   `apps/web/src/components/debt/StrategyComparison.tsx`
-   `apps/web/src/components/debt/DebtPaymentDialog.tsx` (Novo)

## 2. Passo a Passo

### A. Definição de Valor de Ataque

-   [x] **Input de Valor Extra:**
    -   Adicionar input "Valor Extra Mensal" no topo do `StrategyComparison`.
    -   Persistir esse valor (Local Storage ou User Preferences) para recalcular a projeção de tempo.

### B. Fluxo de Pagamento

-   [x] **Botão Registrar Pagamento:**
    -   Adicionar botão "Registrar Pagamento" ao lado da dívida "Foco" (a primeira da lista na estratégia).
-   [x] **Criar Modal `DebtPaymentDialog`:**
    -   Campos: Valor do Pagamento (sugere o mínimo ou saldo total), Data, Conta de Origem.
    -   **Lógica:**
        1.  Cria uma transação do tipo `EXPENSE` (Categoria: "Pagamento de Dívida").
        2.  (Implementado) Abater o saldo da dívida automaticamente.

## 3. Critérios de Aceite

-   [x] Definir R$ 500 de valor extra atualiza a projeção de tempo (Backend implementado com engine de projeção completa).
-   [x] Clicar em "Pagar" abre o modal com os dados da dívida preenchidos.
-   [x] Confirmar pagamento gera uma Despesa no extrato e atualiza o saldo da dívida.

## 4. Implementações Adicionais (Extras)

-   **Engine de Projeção no Backend (`DebtService`):**
    -   Implementada lógica robusta (`calculateProjection`) que simula o pagamento mês a mês.
    -   Considera: Juros compostos, Pagamentos Mínimos e a Estratégia selecionada (Bola de Neve vs Avalanche) para alocar o valor extra.
    -   Retorna: `monthsToPayoff` (Meses até quitar) e `totalInterest` (Total de juros pagos no período).
-   **Atualização Automática de Saldo:**
    -   Alteração no Schema do Prisma para vincular `Transaction` a `Debt` (`debtId`).
    -   `TransactionService` atualiza automaticamente o `totalAmount` da dívida ao criar uma despesa vinculada.
-   **Dashboard de Projeção na UI:**
    -   Adicionado painel visual em `StrategyComparison` exibindo o tempo estimado (Anos/Meses) e a economia estimada.
