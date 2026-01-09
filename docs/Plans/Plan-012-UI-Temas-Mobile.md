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
-   Alternar para Dark Mode e verificar contraste.
-   Lighthouse score > 90 em Acessibilidade e PWA.
