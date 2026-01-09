# Plan 006 - Debt Engine (Cadastro)

## Objetivo

Implementar a "Memória da Dívida". Permitir que o usuário cadastre suas dívidas com detalhes cruciais para a estratégia (Juros, Vencimento, Mínimo).

## Arquivos Afetados

-   `packages/database/schema.prisma`
-   `apps/api/src/modules/debt/*`
-   `apps/web/src/pages/Debts.tsx`
-   `apps/web/src/components/debt/DebtForm.tsx`

## Passo a Passo

### 0. Pré-requisito

-   [x] Executar **Plan 005.5** para garantir que o schema `Account` esteja limpo.

### 1. Backend: Modelagem & CRUD

-   [x] Definir modelo `Debt` no Prisma.
    -   Campos: `id`, `name`, `totalAmount` (Saldo Devedor), `interestRate` (Mensal %), `minimumPayment`, `dueDate` (Dia), `categoryId` (opcional), `priority` (opcional).
-   [x] Criar migração SQL.
-   [x] Criar módulo `DebtModule`.
-   [x] Implementar `DebtService` (CRUD básico).
-   [x] Implementar `DebtController` (Endpoints POST, GET, PUT, DELETE).

### 2. Frontend: Tela de Cadastro

-   [x] Criar página `Debts.tsx`.
-   [x] Criar formulário `DebtForm` com validação (Zod).
    -   Validar que Juros aceita casas decimais.
    -   Validar que Dia de Vencimento é 1-31.
-   [x] Listar dívidas cadastradas em Cards simples.
    -   _Standardization Update:_ Cards implementados seguindo padrão `AccountCard` (BEM).
    -   _Extra:_ Implementada exclusão com `DeleteDebtDialog`.

## Verificação

-   Acessar rota `/debts`.
-   Clicar em "Nova Dívida".
-   Cadastrar "Nubank" / R$ 5.000 / 12% a.m / Vence dia 10.
-   Salvar e recarregar a página. A dívida deve persistir.
