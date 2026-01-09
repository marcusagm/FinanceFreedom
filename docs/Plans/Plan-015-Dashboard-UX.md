# Plan-015 - Melhorias de UX no Dashboard

**Objetivo:** Implementar os elementos de navegação rápida ausentes no Dashboard.

## 1. Arquivos Afetados

-   `apps/web/src/pages/Dashboard.tsx`
-   `apps/web/src/components/layout/AppLayout.tsx` (para posicionamento global do FAB, se necessário)
-   `apps/web/src/components/common/QuickActionFAB.tsx` (Novo)

## 2. Passo a Passo

### A. Dashboard: Ações Rápidas (F01)

-   [ ] **Criar componente `QuickActionFAB`:**
    -   Botão flutuante no canto inferior direito.
    -   Ao clicar, expande opções: "Nova transação", "Nova dívida".
    -   Ao selecionar, abrir os respectivos modais já existentes (`NewTransactionDialog`, `DebtForm` - este último pode precisar ser exportado ou acessado via contexto/props).
-   [ ] **Implementar Botão "Sync Now":**
    -   Adicionar botão de ícone (Refresh) no `PageHeader` do Dashboard.
    -   Verificar se existem configurações IMAP cadastradas (via service). Se sim, exibir o botão.
    -   Conectar à ação de `syncAllAccounts` (necessário criar/expor no service) para sincronização via imap para todas as contas configuradas.
    -   Adicionar estado de loading (spin) durante a sincronização.

## 3. Critérios de Aceite

-   [ ] O FAB aparece no Dashboard.
-   [ ] Clicar no FAB > Nova Transação abre o modal corretamente.
-   [ ] O botão Sync aparece apenas se houver configuração IMAP.
-   [ ] Clicar no Sync dispara a sincronização e mostra feedback visual.
