# Plan-016 - Execução de Dívidas

**Objetivo:** Habilitar o fluxo de pagamento de dívidas diretamente da visualização de estratégia.

## 1. Arquivos Afetados

-   `apps/web/src/pages/Debts.tsx`
-   `apps/web/src/components/debt/StrategyComparison.tsx`
-   `apps/web/src/components/debt/DebtPaymentDialog.tsx` (Novo)

## 2. Passo a Passo

### A. Definição de Valor de Ataque

-   [ ] **Input de Valor Extra:**
    -   Adicionar input "Valor Extra Mensal" no topo do `StrategyComparison`.
    -   Persistir esse valor (Local Storage ou User Preferences) para recalcular a projeção de tempo.

### B. Fluxo de Pagamento

-   [ ] **Botão Registrar Pagamento:**
    -   Adicionar botão "Registrar Pagamento" ao lado da dívida "Foco" (a primeira da lista na estratégia).
-   [ ] **Criar Modal `DebtPaymentDialog`:**
    -   Campos: Valor do Pagamento (sugere o mínimo ou saldo total), Data, Conta de Origem.
    -   **Lógica:**
        1.  Cria uma transação do tipo `EXPENSE` (Categoria: "Pagamento de Dívida").
        2.  (Opcional) Abater o saldo da dívida automaticamente se a API suportar, ou apenas registrar a saída.

## 3. Critérios de Aceite

-   [ ] Definir R$ 500 de valor extra atualiza a projeção de tempo.
-   [ ] Clicar em "Pagar" abre o modal com os dados da dívida preenchidos.
-   [ ] Confirmar pagamento gera uma Despesa no extrato.
