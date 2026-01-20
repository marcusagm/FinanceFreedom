# Plan-025 - Módulo de Investimentos & Metas

**Objetivo:** Criar a seção de gestão de patrimônio (Wealth).

## 1. Arquivos Afetados

-   `apps/web/src/pages/Investments.tsx` (Novo)
-   `apps/api/src/modules/investment/...` (Novo)
-   `apps/web/src/components/dashboard/WealthWidget.tsx` (Novo)

## 2. Passo a Passo

### A. Contas de Investimento

-   [x] **Schema:** `InvestmentAccount` { id, name, type (Fixed, Variable, Crypto), balance }
-   [x] **CRUD:** Criar/Editar/Excluir contas de investimento.
-   [x] **Atualização:** Botão p/ atualizar saldo atual e registrar rendimento (cria transação de "Income" tipo rendimento).

### B. Metas de Economia (Savings Goals)

-   [x] **Schema:** `SavingsGoal` { id, name, targetAmount, currentAmount, deadline, priority }.
-   [x] **UI:** Cards com barra de progresso.
-   [x] **Vínculo:** Associar saldo de uma `InvestmentAccount` a uma ou mais metas ou apenas tracking manual.

## 3. Critérios de Aceite

-   [x] Cadastrar "Reserva de Emergência" (Conta) com R$ 10k.
-   [x] Cadastrar Meta "Viagem" (Alvo R$ 5k).
-   [x] Dashboard mostra Total Investido somado ao Patrimônio.

## 4. Melhorias Implementadas (Além do Plano Original)

### A. Schema & Backend

-   **Campos Adicionais:** Adicionado `profitability` (Rentabilidade), `profitabilityType` (Tipo: CDI, IPCA, PRE, etc.) e `maturityDate` (Vencimento) ao `InvestmentAccount`.
-   **Tratamento de Erros:** Melhorado logging e tratamento de exceções no `InvestmentAccountController`.

### B. UI/UX & Refatoração

-   **Componentes:** Refatoração da estrutura de pastas, separando componentes de `savings-goal` em diretório próprio.
-   **Inputs:** Padronização de inputs monetários usando `react-number-format` (permitindo input de float direto).
-   **Date Picker:** Padronização do componente `DatePicker` para datas de vencimento e prazos, garantindo consistência com o restante da aplicação.
-   **Visualização:** Cards de investimento mostram detalhes de rentabilidade e vencimento quando disponíveis.
