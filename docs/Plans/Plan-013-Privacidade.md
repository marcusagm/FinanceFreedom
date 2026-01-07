# Plan 013 - Privacidade (Blur Mode)

## Objetivo

Permitir que o usuário use o app em locais públicos (café, trabalho) sem expor seus valores financeiros.

## Arquivos Afetados

-   `apps/web/src/contexts/PrivacyContext.tsx`
-   `apps/web/src/components/ui/MoneyDisplay.tsx`

## Passo a Passo

### 1. Contexto de Privacidade

-   [ ] Criar `PrivacyContext` (isObfuscated: boolean).
-   [ ] Persistir estado no `localStorage`.
-   [ ] Adicionar botão "Olho" no Header global.

### 2. Componente Seguro

-   [ ] Refatorar todas as exibições de dinheiro para usar um componente `<MoneyDisplay value={100} />`.
-   [ ] Se `isObfuscated` for true, renderizar `••••••` ou efeito de blur CSS.

## Verificação

-   Clicar no ícone de "Olho".
-   Todos os valores de saldo e transações devem ficar ilegíveis.
-   Recarregar a página. O estado deve se manter.
