# Plan-021 - Garantia de Qualidade (E2E)

**Objetivo:** Estabelecer uma rede de segurança contra regressões usando testes End-to-End.

## 1. Passo a Passo

### A. Setup

-   [x] Instalar Playwright: `npm init playwright@latest`.
-   [x] Configurar para ambiente local e Docker.

### B. Cenários de Teste

-   [x] **Smoke Test:** Dashboard carrega.
-   [x] **CRUDs Completo:** Contas, Dívidas, Transações, Renda (Fontes e Serviços).
-   [x] **Fluxo Renda:** Arrastar item no calendário.

## 2. Critérios de Aceite

-   [x] Testes rodando com `npx playwright test`.
-   [x] Relatório de sucesso.
