# Plano de Implementação: Reconciliation - Wizard UI

**ID:** Plan-043
**Feature:** Reconciliation (Frontend)
**Status:** 🔴 Planejado

## 1. Objetivo

Interface guiada para realizar a conciliação bancária de forma amigável.

## 2. Arquivos Afetados

- `apps/web/src/pages/Reconciliation/*`

## 3. Passo a Passo de Implementação

### 3.1. Wizard Steps

- [ ] **Passo 1: Setup.** Escolher Conta, Data e Saldo do Extrato.
- [ ] **Passo 2: Review.** Lista de transações "suspeitas" (ex: não marcadas como confirmadas, ou recentes). Usuário pode desmarcar transações que não cairam no banco ainda.
- [ ] **Passo 3: Result.** Exibe a diferença.
    - [ ] Se Zero: "Parabéns".
    - [ ] Se Diferente: Botão "Criar Ajuste Automático".

### 3.2. Histórico

- [ ] Lista de conciliações passadas.

### 3.3. Qualidade e Internacionalização

- [ ] **Testes:**
    - [ ] Navegação do Wizard (Next/Back).
    - [ ] Input de valores monetários.
- [ ] **i18n:**
    - [ ] "Bank Statement Balance", "Discrepancy", "System Balance".
    - [ ] Tooltip: "This allows you to align the app balance with your real bank account."

## 4. Critérios de Verificação

- [ ] Realizar um fluxo completo. Verificar se a transação ajustada aparece no extrato.

## 5. Referências

- [Plan-042-Reconciliation-Logic.md](./Plan-042-Reconciliation-Logic.md)
