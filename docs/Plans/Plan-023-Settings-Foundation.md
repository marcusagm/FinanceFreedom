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

-   [ ] **Geral (Parâmetros do Sistema):**
    -   Dia Padrão de Fechamento (Faturas/Relatórios).
    -   Juros Médios Padrão (%) para novas dívidas.
    -   Valor Extra Mensal Padrão (Estratégia de Dívidas).
    -   Limite de Projeção (Meses) - default: 360.
    -   Horas Diárias Padrão (Distribuição de Renda) - default: 8.
    -   Trabalhar nos Fins de Semana (Sim/Não) - default: Não.
    -   Categoria Padrão p/ Recebimentos - default: "Trabalho".
    -   Número Padrão de Recorrências - default: 12.
    -   Conta Padrão p/ Lançamentos Automáticos.
-   [ ] **Preferências (Apenas Placeholders Visuais):**
    -   [ ] _Aparência (Design System - Ver Plan-029)_
    -   [ ] _Idioma e Localização (i18n - Ver Plan-030)_
-   [ ] **Persistência:** Criar tabela `SystemConfig` { key: string, value: string, userId: string } no Backend.

### B. Gestão de Categorias (Nova Página `/categories`)

-   [ ] **Backend:** Atualizar `Category` schema para incluir `color`, `icon`, `budgetLimit`.
-   [ ] **Frontend:** CRUD completo com Color Picker e Icons.
-   [ ] **Migração:** Garantir que categorias existentes ganhem cores padrão.

### C. Gestão de Despesas Fixas (Nova Página `/fixed-expenses`)

-   [ ] **Schema:** Criar `FixedExpense` { id, name, amount, dueDay, categoryId, accountId, autoCreate (bool) }.
-   [ ] **Backend:** Service para gerar transações automaticamente e fornecer dados para projeção.
-   [ ] **Frontend:** CRUD Visual para gerenciar o que "sai todo mês`.

### D. Integração com Projeções e Relatórios

-   [ ] **Motor de Projeção:** Atualizar o backend para que o cálculo de "Saldo Previsto" subtraia as `FixedExpense` recorrentes nos meses futuros.
-   [ ] **Relatórios:** Criar visão de "Comprometimento de Renda" (Quanto do que ganho já está carimbado por despesas fixas).

## 3. Critérios de Aceite

-   [ ] Acessar "Categorias" e "Despesas Fixas" como links independentes no menu.
-   [ ] Criar nova categoria "Lazer" com cor Azul na página de Categorias.
-   [ ] Cadastrar Despesa Fixa "Aluguel" (Dia 10) de R$ 2.000,00 na página de Despesas Fixas.
-   [ ] Visualizar na tela de **Projeções** que o saldo estimado para o próximo mês já considera a saída do "Aluguel", mesmo sem transação criada ainda.
-   [ ] Sistema sugere ou cria a transação de Aluguel quando chega o dia configurado.
