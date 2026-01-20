# Plano de Implementação: Reconciliation - Logic Engine

**ID:** Plan-042
**Feature:** Reconciliation (Backend)
**Status:** 🔴 Planejado

## 1. Objetivo

Implementar a lógica matemática e de persistência para as sessões de conciliação bancária ("Bater o saldo").

## 2. Arquivos Afetados

- `apps/api/prisma/schema.prisma`
- `apps/api/src/modules/reconciliation/*` (Novo Módulo)

## 3. Passo a Passo de Implementação

### 3.1. Schema e Modelagem

- [ ] Atualizar `schema.prisma`:
    - [ ] `ReconciliationSession`: id, accountId, status (OPEN, FINISHED), dateReference, declaredBalance, systemBalance, difference.

### 3.2. ReconciliationService

- [ ] **Start Session:** Recebe `accountId` e `balance`.
    - [ ] Calcula saldo do sistema até a data (soma transações).
    - [ ] Salva sessão.
- [ ] **Audit Transactions:**
    - [ ] Retorna transações do período que não foram conciliadas anteriormente.
- [ ] **Resolve Session:**
    - [ ] Se `difference != 0`, criar transação de ajuste (Income ou Expense) vinculada à sessão.
    - [ ] Atualizar `Account.lastReconciledAt`.

### 3.3. Qualidade e Internacionalização

- [ ] **Testes:**
    - [ ] Cenário: Sistema tem 100, Usuário diz 90. Diferença -10. Resolver deve criar despesa de 10.
    - [ ] Cenário: Sistema tem 90, Usuário diz 100. Diferença +10. Resolver deve criar receita de 10.
- [ ] **i18n:**
    - [ ] Descrição da transação de ajuste: "Reconciliation Adjustment".

## 4. Critérios de Verificação

- [ ] Rodar teste unitário cobrindo os cenários acima.

## 5. Referências

- [Reconciliation-audit-mode.md](../New%20features/Reconciliation-audit-mode.md)
