# Plan-015 - Melhorias de UX no Dashboard

**Objetivo:** Implementar os elementos de navegação rápida ausentes no Dashboard.

## 1. Arquivos Afetados

-   `apps/web/src/pages/Dashboard.tsx`
-   `apps/web/src/components/layout/AppLayout.tsx` (para posicionamento global do FAB, se necessário)
-   `apps/web/src/components/common/QuickActionFAB.tsx` (Novo)

## 2. Passo a Passo

### A. Dashboard: Ações Rápidas (F01)

-   [x] **Criar componente `QuickActionFAB`:**
    -   Botão flutuante no canto inferior direito.
    -   Ao clicar, expande opções: "Nova transação", "Nova dívida".
    -   Ao selecionar, abrir os respectivos modais já existentes (`NewTransactionDialog`, `DebtForm` - este último pode precisar ser exportado ou acessado via contexto/props).
-   [x] **Implementar Botão "Sync Now":**
    -   Adicionar botão de ícone (Refresh) no `PageHeader` do Dashboard.
    -   Verificar se existem configurações IMAP cadastradas (via service). Se sim, exibir o botão.
    -   Conectar à ação de `syncAllAccounts` (necessário criar/expor no service) para sincronização via imap para todas as contas configuradas.
    -   Adicionar estado de loading (spin) durante a sincronização.

## 3. Critérios de Aceite

-   [x] O FAB aparece no Dashboard.
-   [x] Clicar no FAB > Nova Transação abre o modal corretamente.
-   [x] O botão Sync aparece apenas se houver configuração IMAP.
-   [x] Clicar no Sync dispara a sincronização e mostra feedback visual.

## 4. Melhorias Adicionais Implementadas

Durante a execução deste plano, foram realizadas melhorias técnicas e visuais significativas para garantir a qualidade da UX:

### Restauração do Tema Emerald

-   **Migração para Tailwind CSS v4:** A configuração foi atualizada para ser compatível com Tailwind v4 (detectado no projeto).
-   **Configuração de Tema (@theme):** Migração das variáveis de tema para o bloco `@theme` no `index.css`, garantindo integração nativa com o engine v4.
-   **Variáveis HSL:** Padronização das variáveis de cor (`theme.css`) para o formato `hsl(H, S%, L%)` (coma-separated) para máxima compatibilidade e resolução de problemas de opacidade (transparência indesejada em modais).

### Refatoração de Componentes

-   **Remoção de CSS Modules:** Os arquivos `Button.css` e `Modal.css` foram removidos.
-   **Button.tsx:** Refatorado para usar `class-variance-authority` (cva) e classes utilitárias do Tailwind, alinhado com o padrão shadcn/ui.
-   **Modal.tsx / Dialog.tsx:** Refatorados para usar classes utilitárias e corrigir problemas de transparência (background opaco em light/dark mode).
-   **Sonner:** Substituição do sistema de toast anterior pelo `Sonner` para notificações mais modernas e responsivas.

### Dark Mode

-   Correção completa da alternância de temas (Light/Dark).
-   Ajuste de variáveis de cor para garantir contraste adequado e fundos sólidos em ambos os modos.
