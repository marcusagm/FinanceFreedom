# Plan 007 - Debt Engine (Algoritmo)

## Objetivo

Implementar a inteligência que ordena as dívidas. O sistema deve sugerir qual pagar primeiro baseando-se em Matemática (Avalanche) ou Psicologia (Snowball).

## Arquivos Afetados

-   `apps/api/src/modules/debt/debt.service.ts`
-   `apps/api/src/modules/debt/strategies/*`
-   `apps/web/src/pages/Debts.tsx`
-   `apps/web/src/components/debt/StrategyComparison.tsx`

### 1. Backend: Lógica de Ordenação

-   [x] Criar Pattern Strategy no Backend.
    -   Interface `DebtStrategy`: método `sort(debts: Debt[]): Debt[]`.
    -   Implementação `SnowballStrategy`: Ordena por `totalAmount` ASC.
    -   Implementação `AvalancheStrategy`: Ordena por `interestRate` DESC.
-   [x] Criar endpoint `GET /debts/strategy`: Recebe `type=SNOWBALL|AVALANCHE` e retorna lista ordenada.

### 2. Frontend: Comparador

-   [x] Criar componente `StrategyComparison`.
    -   Abas "Matemático" vs "Psicológico".
    -   Exibir lista ordenada conforme a aba selecionada.
    -   Destacar a "Dívida Foco" (A primeira da lista).

## Verificação

### Testes Automatizados

-   [x] Backend Unit Tests (`debt.strategy.spec.ts`): Passou (100% de sucesso).

### Verificação Manual (Browser)

-   Cadastrar Dívida A: R$ 1.000 (10% juros).
-   Cadastrar Dívida B: R$ 500 (2% juros).
-   Selecionar "Snowball": Dívida B deve estar em primeiro (Menor valor).
-   Selecionar "Avalanche": Dívida A deve estar em primeiro (Maior juros).
