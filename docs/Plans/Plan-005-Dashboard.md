# Plan 005 - Dashboard Basic (Visibilidade)

## Objetivo

Consolidar os dados das contas (F02) e transações (F05) em uma tela inicial de alto impacto. Implementação do F01.

## Arquivos Afetados

-   `apps/web/src/pages/Dashboard.tsx`
-   `apps/api/src/modules/dashboard/*`

## Passo a Passo

### 1. Backend: Agregação

-   [ ] Criar endpoint `GET /dashboard/summary`: Retorna Saldo Total, Receitas Mês, Despesas Mês.
-   [ ] Otimizar query SQL para agregar sem pesar o banco.

### 2. Frontend: UI

-   [ ] Criar Cards de Topo (Saldo Total, Entradas, Saídas).
-   [ ] Criar Gráfico de Linha (Evolução do Saldo - 30 dias).
-   [ ] Montar layout responsivo (Grid).

## Verificação

-   Acessar a Home.
-   Verificar se a soma dos saldos bate calculadora.
-   Verificar se o gráfico reflete as transações lançadas nos planos anteriores.
