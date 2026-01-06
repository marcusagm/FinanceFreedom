# Plan 003 - Transaction Manager (Core)

## Objetivo

Permitir o lançamento de despesas e receitas manuais, afetando o saldo das contas criadas no Plan 002. Implementação do F05 (Básico).

## Arquivos Afetados

-   `apps/api/src/modules/transaction/*`
-   `apps/web/src/pages/Transactions.tsx`
-   `packages/database/schema.prisma`

## Passo a Passo

### 1. Backend: Transações

-   [ ] Definir modelo `Transaction` no Prisma (amount, date, description, type, category, accountId).
-   [ ] Implementar lógica de atualização de saldo: Criar transação -> Atualizar `Account.balance`. (Transaction Atomic).
-   [ ] Criar endpoints `POST /transactions` e `GET /transactions`.

### 2. Frontend: Lista e Cadastro

-   [ ] Criar componente `TransactionList` (Tabela simples).
-   [ ] Criar modal `NewTransactionDialog`.
    -   Select de Conta (busca do Plan 002).
    -   Input de Valor e Data.
    -   Radio Income/Expense.

## Verificação

-   Criar uma conta com R$ 100.
-   Lançar despesa de R$ 20.
-   Verificar na lista a transação.
-   Verificar no Card da Conta que o saldo caiu para R$ 80.
