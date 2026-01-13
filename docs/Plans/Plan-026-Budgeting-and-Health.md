# Plan-026 - Orçamento & Saúde Financeira

**Objetivo:** Implementar limites de gastos por categoria e score de saúde financeira gamificado.

## 1. Arquivos Afetados

-   `apps/web/src/pages/Budget.tsx` (Opcional, ou aba em Settings/Dashboard)
-   `apps/web/src/components/dashboard/HealthScore.tsx` (Novo Widget)
-   `apps/api/src/modules/analytics/...`

## 2. Passo a Passo

### A. Orçamento (Budgeting)

-   [ ] **Definição:** Na edição de Categoria (Plan-023), permitir setar `budgetLimit`.
-   [ ] **Visualização:** Relatório "Orçado vs Realizado" por categoria. Barras de progresso que mudam de cor (Verde -> Amarelo -> Vermelho) conforme gasto se aproxima do limite.

### B. Health Score Engine

-   [ ] **Algoritmo (Backend/Frontend):**
    -   Pontuação base 1000.
    -   Descontos: Dívidas em atraso, Dívidas > 50% renda.
    -   Bônus: Reserva de emergência > 3 meses, Investimentos ativos.
-   [ ] **Histórico:** Salvar score diário (`DailyScore`) para gráfico de evolução.
-   [ ] **UI:** Widget estilo "Velocímetro" no Dashboard.

## 3. Critérios de Aceite

-   [ ] Definir limite de R$ 500 para Alimentação.
-   [ ] Gastar R$ 400 -> Barra amarela.
-   [ ] Velocímetro mostra pontuação baseada nos dados atuais (ex: 750 "Bom").
