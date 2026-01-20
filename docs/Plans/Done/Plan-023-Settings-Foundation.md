# Plan-023 - Configurações, Categorias & Despesas Fixas

**Objetivo:** Centralizar configurações do sistema, permitir gestão dinâmica de categorias e despesas fixas em páginas dedicadas, e integrar despesas fixas nas projeções financeiras.

## 1. Arquivos Afetados

-   `apps/web/src/pages/Settings.tsx` (Configurações do Sistema)
-   `apps/web/src/pages/Categories.tsx` (Novo - Gestão de Categorias)
-   `apps/web/src/pages/FixedExpenses.tsx` (Novo - Gestão de Despesas Fixas)
-   `apps/web/src/components/category/...` (Novos componentes de Categoria)
-   `apps/web/src/components/fixed-expense/...` (Novos componentes de Despesas Fixas)
-   `apps/api/src/modules/category/...`
-   `apps/api/src/modules/recursive-expense/...` (Novo)
-   `apps/api/src/modules/projections/...` (Atualizar para considerar despesas fixas)

## 2. Passo a Passo

### A. Página de Configurações Gerais

-   [x] **Geral (Parâmetros do Sistema):**
    -   [x] Dia Padrão de Fechamento (Faturas/Relatórios).
    -   [x] Juros Médios Padrão (%) para novas dívidas.
    -   [x] Valor Extra Mensal Padrão (Estratégia de Dívidas).
    -   [x] Limite de Projeção (Meses) - default: 360.
    -   [x] Horas Diárias Padrão (Distribuição de Renda) - default: 8.
    -   [x] Trabalhar nos Fins de Semana (Sim/Não) - default: Não.
    -   [x] Categoria Padrão p/ Recebimentos - default: "Trabalho".
    -   [x] Número Padrão de Recorrências - default: 12.
-   [x] **Preferências (Apenas Placeholders Visuais):**
    -   [x] _Aparência (Design System - Ver Plan-029)_
    -   [x] _Idioma e Localização (i18n - Ver Plan-030)_
-   [x] **Persistência:** Criar tabela `SystemConfig` { key: string, value: string, userId: string } no Backend.

### B. Gestão de Categorias (Nova Página `/categories`)

-   [x] **Backend:** Atualizar `Category` schema para incluir `color`, `icon`, `budgetLimit`.
-   [x] **Frontend:** CRUD completo com Color Picker e Icons.
-   [x] **Migração:** Garantir que categorias existentes ganhem cores padrão.

### C. Gestão de Despesas Fixas (Nova Página `/fixed-expenses`)

-   [x] **Schema:** Criar `FixedExpense` { id, name, amount, dueDay, categoryId, accountId, autoCreate (bool) }.
-   [x] **Backend:** Service para gerar transações automaticamente e fornecer dados para projeção.
-   [x] **Frontend:** CRUD Visual para gerenciar o que "sai todo mês`.

### D. Integração com Projeções e Relatórios

-   [x] **Motor de Projeção:** Atualizar o backend para que o cálculo de "Saldo Previsto" subtraia as `FixedExpense` recorrentes nos meses futuros.
-   [x] **Relatórios:** Criar visão de "Comprometimento de Renda" (Quanto do que ganho já está carimbado por despesas fixas).

## 3. Critérios de Aceite

-   [x] Acessar "Categorias" e "Despesas Fixas" como links independentes no menu.
-   [x] Criar nova categoria "Lazer" com cor Azul na página de Categorias.
-   [x] Cadastrar Despesa Fixa "Aluguel" (Dia 10) de R$ 2.000,00 na página de Despesas Fixas.
-   [x] Visualizar na tela de **Projeções** que o saldo estimado para o próximo mês já considera a saída do "Aluguel", mesmo sem transação criada ainda.
-   [x] Sistema sugere ou cria a transação de Aluguel quando chega o dia configurado.

## 4. Melhorias Técnicas e Testes (Adicional)

-   [x] **Refatoração de Formulários:** Padronização completa utilizando `react-hook-form` e `zod` em:
    -   `Settings` e `GeneralSettingsCard`.
    -   `CategoryDialog`.
    -   `FixedExpenseDialog`.
    -   `NewTransactionDialog` (Correções de data e timezone).
-   [x] **Cobertura de Testes (Frontend):**
    -   Criação de testes unitários e de integração para Categorias (`CategoryDialog.test.tsx`, `CategoryList.test.tsx`, `Categories.test.tsx`).
    -   Criação de testes unitários e de integração para Despesas Fixas (`FixedExpenseDialog.test.tsx`, `FixedExpenseList.test.tsx`, `FixedExpenses.test.tsx`).
    -   Criação de testes de integração para Configurações (`Settings.test.tsx`).
    -   Correção de testes existentes (`NewTransactionDialog`, `IncomeProjection`).
-   [x] **UX/UI:**
    -   Diálogos de confirmação de exclusão (`DeleteCategoryDialog`, `DeleteFixedExpenseDialog`).
    -   Feedback visual aprimorado (Toasts, Spinners).
