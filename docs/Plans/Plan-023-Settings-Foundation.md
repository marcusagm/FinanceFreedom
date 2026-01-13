# Plan-023 - Configurações Gerais & Categorias

**Objetivo:** Centralizar configurações do sistema e permitir gestão dinâmica de categorias e despesas fixas.

## 1. Arquivos Afetados

-   `apps/web/src/pages/Settings.tsx` (Novo)
-   `apps/web/src/components/settings/CategoryManager.tsx` (Novo)
-   `apps/web/src/components/settings/FixedExpensesManager.tsx` (Novo)
-   `apps/api/src/modules/category/...`
-   `apps/api/src/modules/recursive-expense/...` (Novo)

## 2. Passo a Passo

### A. Página de Configurações

-   [ ] **Estrutura:** Criar página com abas: "Geral", "Categorias", "Despesas Fixas".
-   [ ] **Configs Gerais:** Inputs para "Dia Padrão de Fechamento", "Juros Padrão (%)", etc. persistidos em tabela `SystemConfig` ou LocalStorage (início).

### B. Gestão de Categorias

-   [ ] **Backend:** Atualizar `Category` schema para incluir `color`, `icon`, `budgetLimit`.
-   [ ] **Frontend:** CRUD completo (Lista editável, Color Picker).
-   [ ] **Migração:** Garantir que categorias existentes ganhem cores padrão.

### C. Despesas Fixas

-   [ ] **Schema:** Criar `FixedExpense` { id, name, amount, dueDay, categoryId, accountId, autoCreate (bool) }.
-   [ ] **Backend:** Service para gerar transações automaticamente (Schedule/Cron ou Trigger no Login).
-   [ ] **Frontend:** CRUD Visual.

## 3. Critérios de Aceite

-   [ ] Criar nova categoria "Lazer" com cor Azul.
-   [ ] Essa categoria aparece no dropdown de Nova Transação.
-   [ ] Cadastrar Despesa Fixa "Aluguel" (Dia 10).
-   [ ] Sistema sugere ou cria a transação de Aluguel quando chega o dia.
