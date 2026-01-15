# Plan-026 - Orçamento & Saúde Financeira

**Objetivo:** Implementar limites de gastos por categoria e score de saúde financeira gamificado.

## 1. Arquivos Afetados

-   `apps/web/src/pages/Budget.tsx` (Opcional, ou aba em Settings/Dashboard)
-   `apps/web/src/components/dashboard/HealthScore.tsx` (Novo Widget)
-   `apps/api/src/modules/analytics/...`

## 2. Passo a Passo

### A. Orçamento (Budgeting)

-   [x] **Definição:** Na edição de Categoria (Plan-023), permitir setar `budgetLimit`.
-   [x] **Visualização:** Relatório "Orçado vs Realizado" por categoria. Gráfico de Pizza no `BudgetWidget` visualizando limites e uso.

### B. Health Score Engine

-   [x] **Algoritmo (Backend/Frontend):**
    -   Pontuação base 1000.
    -   Descontos: Dívidas em atraso, Dívidas > 3x renda mensal.
    -   Bônus: Reserva de emergência > 3 meses, Investimentos ativos.
-   [x] **Histórico:** Salvar score diário (`DailyScore`) para gráfico de evolução (Implementado em `health-score.service.ts`).
-   [x] **UI:** Widget estilo "Velocímetro" no Dashboard (`HealthScoreWidget`).

## 3. Critérios de Aceite

-   [x] Definir limite de R$ 500 para Alimentação.
-   [x] Gastar R$ 400 -> Barra colorida indicativa (implementado no gráfico).
-   [x] Velocímetro mostra pontuação baseada nos dados atuais (ex: 750 "Bom").

## 4. Melhorias Adicionais Implementadas

### A. Dashboard Refactoring

-   **Componentização:** O `Dashboard.tsx` foi quebrado em múltiplos widgets menores para melhor manutenção:
    -   `IncomeSummaryWidget`
    -   `ExpenseSummaryWidget`
    -   `BalanceChartWidget`
    -   `UpcomingInstallmentsWidget`
    -   `WealthWidget`
-   **Padronização Visual:** Todos os widgets agora seguem o padrão de `Card` e `ChartTooltip` do design system.

### B. Income Widget

-   **Funcionalidade:** Adicionado gráfico de distribuição de receitas por categoria (`IncomeWidget`).
-   **Categorização:** Adicionado suporte para categorias do tipo "Receita" na criação de fontes de renda.

### C. Privacidade e UX

-   **Modo Privacidade:** Implementado `MoneyDisplay` em todos os widgets para ofuscação de valores sensíveis.
-   **Tipagem Forte:** Melhorias nas definições de tipos (`Transaction`, `IncomeSource`, `Category`) para garantir robustez.
