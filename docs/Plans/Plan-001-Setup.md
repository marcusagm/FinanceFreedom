# Plan 001 - Project Setup & Foundation

## Objetivo

Inicializar o repositório Monorepo, configurar o Docker com Node.js + SQLite, instalar as dependências base (NestJS, React) e garantir que o ambiente de desenvolvimento esteja rodando ("Hello World" nos dois lados).

## Arquivos Afetados

-   `/` (Root Configs)
-   `/apps/api`
-   `/apps/web`
-   `/docker-compose.yml`

## Passo a Passo

### 1. Inicialização do Monorepo

-   [ ] Iniciar projeto com TurboRepo ou NPM Workspaces.
-   [ ] Configurar `package.json` raiz.
-   [ ] Configurar `biome.json` para linting global.

### 2. Configuração do Backend (API)

-   [ ] Criar app NestJS em `apps/api`.
-   [ ] Instalar Prisma e inicializar SQLite (`prisma init`).
-   [ ] Criar Dockerfile para API (Dev e Prod).

### 3. Configuração do Frontend (Web)

-   [ ] Criar app React+Vite em `apps/web`.
-   [ ] Instalar TailwindCSS e configurar `postcss`.
-   [ ] Inicializar `shadcn/ui`.
-   [ ] Criar Dockerfile para Web.

### 4. Orquestração (Docker Compose)

-   [ ] Criar `docker-compose.yml` na raiz.
-   [ ] Definir serviços `api` e `web` com hot-reload (volumes).
-   [ ] Testar subida dos containers.

## Verificação

-   Executar `docker-compose up`.
-   Acessar `http://localhost:3000` (Web) e ver "Vite + React".
-   Acessar `http://localhost:3001/api` (API) e ver "Hello World".
