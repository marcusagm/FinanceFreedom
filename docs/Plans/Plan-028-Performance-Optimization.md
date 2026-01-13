# Plan-028 - Otimização de Performance

**Objetivo:** Garantir fluidez da aplicação com grandes volumes de dados.

## 1. Arquivos Afetados

-   `apps/api/src/modules/transaction/transaction.controller.ts`
-   `apps/web/src/pages/Transactions.tsx`
-   `apps/web/src/hooks/useTransactions.ts`

## 2. Passo a Passo

### A. Backend Pagination

-   [ ] **API:** Atualizar `findAll` para aceitar `page`, `limit`, `orderBy`.
-   [ ] **Retorno:** `{ data: [], meta: { total, object, page } }`.

### B. Frontend Implementation

-   [ ] **Query:** Atualizar calls do React Query para usar `useInfiniteQuery` ou paginação simples.
-   [ ] **UI:** Implementar "Load More" (Scroll Infinito) ou Paginador numérico na tabela de transações.
-   [ ] **Filtros Server-Side:** Mover a lógica de filtro (Texto, Data, Categoria) do JS cliente para a query do Prisma no Backend.

## 3. Critérios de Aceite

-   [ ] Gerar seed com 10.000 transações.
-   [ ] Lista carrega instantaneamente (primeiros 50 itens).
-   [ ] Scroll/Paginação carrega os próximos itens suavemente.
-   [ ] Busca filtra corretamente na base inteira.
