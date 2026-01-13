# Plan-025 - Módulo de Investimentos & Metas

**Objetivo:** Criar a seção de gestão de patrimônio (Wealth).

## 1. Arquivos Afetados

-   `apps/web/src/pages/Investments.tsx` (Novo)
-   `apps/api/src/modules/investment/...` (Novo)
-   `apps/web/src/components/dashboard/WealthWidget.tsx` (Novo)

## 2. Passo a Passo

### A. Contas de Investimento

-   [ ] **Schema:** `InvestmentAccount` { id, name, type (Fixed, Variable, Crypto), balance, profitability (%)... }.
-   [ ] **CRUD:** Criar/Editar/Excluir contas de investimento.
-   [ ] **Atualização:** Botão p/ atualizar saldo atual e registrar rendimento (cria transação de "Income" tipo rendimento).

### B. Metas de Economia (Savings Goals)

-   [ ] **Schema:** `SavingsGoal` { id, name, targetAmount, currentAmount, deadline, priority }.
-   [ ] **UI:** Cards com barra de progresso circular.
-   [ ] **Vínculo:** Associar saldo de uma `InvestmentAccount` a uma ou mais metas (opcional) ou apenas tracking manual.

## 3. Critérios de Aceite

-   [ ] Cadastrar "Reserva de Emergência" (Conta) com R$ 10k.
-   [ ] Cadastrar Meta "Viagem" (Alvo R$ 5k).
-   [ ] Dashboard mostra Total Investido somado ao Patrimônio.
