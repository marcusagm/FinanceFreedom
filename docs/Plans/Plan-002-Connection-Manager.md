# Plan 002 - Connection Manager (Parte A: Manual)

## Objetivo

Implementar a estrutura de dados base (`Account`) e permitir que o usuário crie contas manuais (Carteira, Nubank Manual) e visualize o saldo. É o primeiro passo para o F02.

## Arquivos Afetados

-   `apps/api/src/modules/account/*`
-   `apps/web/src/pages/Accounts.tsx`
-   `packages/database/schema.prisma`

## Passo a Passo

### 1. Backend: Modelagem & CRUD

-   [ ] Definir modelo `Account` no Prisma (id, name, type, balance, color).
-   [ ] Criar migração SQL.
-   [ ] Implementar `AccountService`: `create`, `findAll`, `update`.
-   [ ] Implementar `AccountController` com validação de DTO.

### 2. Frontend: Tela de Contas

-   [ ] Criar componente `AccountCard` (exibe saldo e nome).
-   [ ] Criar modal `CreateAccountDialog` (Formulário com shadcn/ui).
-   [ ] Conectar com API (Axios/React Query) para listar e criar.

## Verificação

-   Abrir a aplicação web.
-   Clicar em "Nova Conta".
-   Preencher "Carteira" / "Dinheiro" / R$ 50,00.
-   Salvar e ver o card aparecer na tela principal com R$ 50,00.
-   Reiniciar o Docker e garantir que o dado persistiu no SQLite.
