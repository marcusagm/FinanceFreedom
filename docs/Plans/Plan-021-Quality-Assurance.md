# Plan-021 - Garantia de Qualidade (E2E)

**Objetivo:** Estabelecer uma rede de segurança contra regressões usando testes End-to-End.

## 1. Passo a Passo

### A. Setup

-   [ ] Instalar Playwright: `npm init playwright@latest`.
-   [ ] Configurar para ambiente local e Docker.

### B. Cenários de Teste

-   [ ] **Smoke Test:** Dashboard carrega.
-   [ ] **CRUD Transação:** Criar, Listar, Editar, Excluir em todos os cadastros.
-   [ ] **Fluxo Renda:** Arrastar item no calendário.

## 2. Critérios de Aceite

-   [ ] Testes rodando com `npx playwright test`.
-   [ ] Relatório de sucesso.
