# Plan-017 - Filtros de Transações

**Objetivo:** Adicionar filtros e busca textual à lista de transações.

## 1. Arquivos Afetados

-   `apps/web/src/pages/Transactions.tsx`
-   `apps/web/src/components/transactions/TransactionFilters.tsx` (Novo)

## 2. Passo a Passo

### A. Componente de Filtros

-   [ ] **Criar `TransactionFilters`:**
    -   Input de Texto: Busca por descrição.
    -   Select: Conta (Todas ou Específica).
    -   Select: Categoria.
    -   Date Range Picker: Filtrar por período (Início/Fim).

### B. Integração

-   [ ] **Atualizar `Transactions.tsx`:**
    -   Adicionar estado para os filtros.
    -   Integrar componente `TransactionFilters`.
    -   Implementar lógica de filtragem (client-side `filter` no array `transactions` existente ou nova chamada de API com query params se necessário). Para v1.1 client-side é suficiente se volume < 1000. Preferir backend filtering se possível (`GET /transactions?search=...&from=...`).

## 3. Critérios de Aceite

-   [ ] Digitar "Mercado" na busca filtra a lista.
-   [ ] Selecionar uma data específica filtra a lista.
-   [ ] Resetar filtros restaura a lista completa.
