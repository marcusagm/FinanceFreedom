# Plan-017 - Filtros de Transações

**Objetivo:** Adicionar filtros e busca textual à lista de transações.

## 1. Arquivos Afetados

-   `apps/web/src/pages/Transactions.tsx`
-   `apps/web/src/components/transactions/TransactionFilters.tsx` (Novo)
-   `apps/web/src/components/ui/DatePicker.tsx` (Refatorado para permitir input manual)
-   `apps/web/src/components/transactions/TransactionFilters.test.tsx` (Novo - Testes Unitários)

## 2. Passo a Passo

### A. Componente de Filtros

-   [x] **Criar `TransactionFilters`:**
    -   [x] Input de Texto: Busca por descrição.
    -   [x] Select: Conta (Todas ou Específica).
    -   [x] Select: Categoria.
    -   [x] Date Range Picker: Filtrar por período (Duas instâncias de DatePicker independentes).
    -   [x] **[EXTRA]** Adicionado botão de limpar filtros com feedback visual.

### B. Integração

-   [x] **Atualizar `Transactions.tsx`:**
    -   [x] Adicionar estado para os filtros (`startDate`, `endDate`, `search`, `accountId`, `category`).
    -   [x] Integrar componente `TransactionFilters`.
    -   [x] Implementar lógica de filtragem local (Client-side filtering para performance imediata).

### C. Melhorias e Correções (Extras)

-   [x] **Refatoração DatePicker:** Implementada digitação manual de datas (DD/MM/YYYY) com máscara.
-   [x] **Correção de Timezone:** Resolvido bug de "off-by-one" (dia anterior) forçando parse/format local (`T00:00:00`).
-   [x] **Testes Automatizados:**
    -   Criado suite de testes para `TransactionFilters.tsx` (100% pass e isolado com mocks).
    -   Atualizado testes de `NewTransactionDialog` e `Transactions` para garantir integridade.
    -   Resolvido conflitos de dependência (`jest-dom`/`date-fns`) nos testes.
-   [x] **UI/UX:**
    -   Layout responsivo (Mobile: Stack vertical / Desktop: Linha horizontal).
    -   Ícones e Placeholders intuitivos.
    -   Padronização de espaçamento com Tailwind.

## 3. Critérios de Aceite

-   [x] Digitar "Mercado" na busca filtra a lista.
-   [x] Selecionar uma data específica filtra a lista.
-   [x] Resetar filtros restaura a lista completa.
-   [x] Visualização responsiva em mobile/desktop.
-   [x] Testes passando sem erros.
