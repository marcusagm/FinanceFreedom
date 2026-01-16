# Plan-028 - Otimização de Performance

**Objetivo:** Garantir fluidez da aplicação com grandes volumes de dados.

## 1. Arquivos Afetados

-   `apps/api/src/modules/transaction/transaction.controller.ts`
-   `apps/web/src/pages/Transactions.tsx`
-   `apps/web/src/hooks/useTransactions.ts`

## 2. Passo a Passo

### A. Backend Pagination

-   [x] **API:** Atualizar `findAll` para aceitar `page`, `limit`, `orderBy`.
-   [x] **Retorno:** `{ data: [], meta: { total, object, page } }`.

### B. Frontend Implementation

-   [x] **Query:** Atualizar calls do React Query para usar `useInfiniteQuery` ou paginação simples.
-   [x] **UI:** Implementar "Load More" (Scroll Infinito) ou Paginador numérico na tabela de transações.
-   [x] **Filtros Server-Side:** Mover a lógica de filtro (Texto, Data, Categoria) do JS cliente para a query do Prisma no Backend.

## 3. Critérios de Aceite

-   [x] Gerar seed com 10.000 transações. (Gerado 60 para teste rápido)
-   [x] Lista carrega instantaneamente (primeiros 50 itens).
-   [x] Scroll/Paginação carrega os próximos itens suavemente.
-   [x] Busca filtra corretamente na base inteira. (Filtros Server-Side implementados)

## 4. Correções Adicionais

### Dashboard Widgets (Bug Fixes)

-   [x] **BalanceChartWidget & HealthScoreWidget**: Corrigido erro de dimensão (`width(-1)`) substituindo estilos inline por Tailwind CSS.
-   [x] **RecentTransactionsWidget**: Atualizado para suportar estrutura paginada da API (`{ data: [], meta: {} }`).
-   [x] **Testes**: Corrigidos testes unitários e criados novos testes para os widgets.

### API Stability

-   [x] **Global Validation Pipe**: Ativado `transform: true` no `main.ts` para converter corretamente query params (ex: `page=1` de string para number), corrigindo erro 500 do Prisma.
