# Plan 012 - UI Temas & Mobile

## Objetivo

Polimento visual para garantir que o app pareça profissional e funcione bem no celular (PWA).

## Arquivos Afetados

-   `apps/web/src/index.css` (Variáveis de Tema)
-   `apps/web/src/components/layout/*`
-   `apps/web/manifest.json`

## Passo a Passo

### 1. Temas (Dark/Light)

-   [x] Implementar Contexto de Tema (`ThemeProvider`).
-   [x] Definir paleta de cores para modo Escuro (Slate/Emerald/Rose).
-   [x] Adicionar Toggle de tema no Header.

### 2. Mobile First

-   [x] Adicionar `manifest.json` para instalação PWA.
-   [x] Ajustar Grid do Dashboard para 1 coluna no Mobile.
-   [x] Transformar Menu Lateral em "Bottom Navigation" no Mobile (opcional, ou Drawer).

## Verificação

-   Abrir no Celular (Chrome DevTools).
-   Verificar se o layout não quebra.
-   [x] Alternar para Dark Mode e verificar contraste.
-   [x] Lighthouse score > 90 em Acessibilidade e PWA.

## Melhorias Adicionais (Realizadas)

### 1. Refatoração de Componentes

-   Reorganização de componentes de `Accounts` e `Import` em pastas dedicadas (`src/components/account`, `src/components/import`).
-   Remoção de CSS customizado (`Accounts.css`) em favor de classes utilitárias do Tailwind CSS.
-   Criação de `AccountCard` component reutilizável e limpo.
-   Implementação de `Checkbox` component dependency-free para resolver problemas de build.

### 2. Cobertura de Testes (Quality Assurance)

-   Implementação de suíte completa de testes unitários e de integração (Vitest + React Testing Library).
-   Cobertura para:
    -   **Core UI**: `Checkbox`, `PageHeader`, `ThemeProvider`, `Layout`, `Header`.
    -   **Accounts**: `AccountCard`, `CreateAccountDialog`, `DeleteAccountDialog`, `Accounts Page`.
    -   **Transactions**: `TransactionList`, `NewTransactionDialog`, `DeleteTransactionDialog`, `Transactions Page`.
    -   **Income/Debt**: `IncomeSourceCard`, `WorkUnitCard`, `DebtCard`, `Simulators`.
-   Correção de erros de ambiente de teste (`ReferenceError: React`, `document not defined`).
