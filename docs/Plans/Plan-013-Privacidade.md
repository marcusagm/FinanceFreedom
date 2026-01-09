# Plan 013 - Privacidade (Blur Mode)

## Objetivo

Permitir que o usuário use o app em locais públicos (café, trabalho) sem expor seus valores financeiros.

## Arquivos Afetados

-   `apps/web/src/contexts/PrivacyContext.tsx`
-   `apps/web/src/components/ui/MoneyDisplay.tsx`

## Passo a Passo

### 1. Contexto de Privacidade

-   [x] Criar `PrivacyContext` (isObfuscated: boolean).
-   [x] Persistir estado no `localStorage`.
-   [x] Adicionar botão "Olho" no Header global.

### 2. Componente Seguro

-   [x] Refatorar todas as exibições de dinheiro para usar um componente `<MoneyDisplay value={100} />`.
-   [x] Se `isObfuscated` for true, renderizar `••••••` ou efeito de blur CSS.

### 3. Melhorias e Refatorações Adicionais (Realizado)

-   **Refatoração Completa**: Aplicação do `MoneyDisplay` em:
    -   `Dashboard` (Cards e Gráfico - TickFormatter corrigido).
    -   `Accounts` (Cards de conta).
    -   `TransactionList` (Lista de transações).
    -   `Debts` (`DebtCard`).
    -   `Income` (`IncomeSourceCard`, `DraggableWorkUnit`, `CalendarDay`).
    -   `IncomeProjection`.
-   **Testes**:
    -   Criação de `src/utils/test-utils.tsx` para simplificar testes com `PrivacyProvider` e `BrowserRouter`.
    -   Atualização de testes de página afetados pela nova dependência de contexto.
    -   Novos testes para `MoneyDisplay` e `PrivacyContext`.

## Verificação

-   [x] Clicar no ícone de "Olho".
-   [x] Todos os valores de saldo e transações devem ficar ilegíveis.
-   [x] Recarregar a página. O estado deve se manter.
