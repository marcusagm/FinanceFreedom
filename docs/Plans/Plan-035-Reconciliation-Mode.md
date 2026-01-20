# Plano de Implementação: Reconciliation & Audit Mode

**ID:** Plan-035
**Feature:** Reconciliation (Conciliação Bancária)
**Status:** 🔴 Planejado

## 1. Objetivo

Criar um mecanismo formal de auditoria para garantir que o saldo apresentado no Finance Freedom corresponda exatamente ao saldo real nas contas bancárias do usuário. O sistema deve identificar discrepâncias e facilitar o ajuste.

## 2. Arquivos Afetados

- `apps/api/prisma/schema.prisma`
- `apps/api/src/modules/reconciliation/*` (Novo Módulo)
- `apps/web/src/pages/Reconciliation/*` (Wizard UI)

## 3. Passo a Passo de Implementação

### 3.1. Schema

- [ ] Atualizar `schema.prisma`:
    - [ ] **ReconciliationSession:** id, accountId, reconciledDate, expectedBalance, actualBalance, difference, status.
    - [ ] **Account:** campo `lastReconciledAt`.

### 3.2. Reconciliation Engine

- [ ] Criar endpoint `POST /reconciliation/start`:
    - [ ] Recebe `{ accountId, date, actualBalance }`.
    - [ ] Calcula `expectedBalance`: Soma de todas transações CONFIRMED dessa conta até a data.
    - [ ] Retorna a diferença e uma lista de transações "suspeitas" (não conciliadas ou recentes).
- [ ] Criar endpoint `POST /reconciliation/resolve`:
    - [ ] Opção: Criar transação de ajuste automático (Tipo: AJUSTE, Valor: Diferença) para zerar o erro.

### 3.3. Wizard UI (Frontend)

- [ ] Criar fluxo passo a passo:
    1.  **Seleção:** Escolher Conta e Saldo Real (input manual).
    2.  **Conferência:** Exibir lista de transações do período. Usuário pode marcar/desmarcar o que de fato ocorreu.
    3.  **Resultado:** Mostrar "Bateu!" (Verde) ou "Diferença de R$ XX" (Vermelho).
    4.  **Ação:** Botão "Ajustar automaticamente" ou "Investigar mais".

### 3.4. Qualidade e Internacionalização

- [ ] **Testes:**
    - [ ] Unitários `ReconciliationService`: Cenários de saldo igual, saldo maior e saldo menor.
    - [ ] Frontend: Testar o Wizard step-by-step.
- [ ] **i18n:**
    - [ ] Traduzir Wizard: "Start Reconciliation", "Expected Balance", "Actual Balance", "Discrepancy".
    - [ ] Tooltips explicativos sobre o que é conciliação.

- [ ] **Cálculo:** Se o sistema diz R$ 100 e eu digo R$ 90, a diferença mostrada deve ser R$ -10.
- [ ] **Ajuste:** Ao clicar em Ajustar, uma transação de despesa de R$ 10 deve ser criada, e o saldo da conta deve virar R$ 90.
- [ ] **Histórico:** Deve ser possível ver sessões de auditoria passadas.
- [ ] **QA:** Cobertura de testes garantida para lógica de cálculo de saldo.
- [ ] **i18n:** Mensagens de erro e sucesso traduzidas.

## 5. Referências

- [Reconciliation-audit-mode.md](../New%20features/Reconciliation-audit-mode.md)
