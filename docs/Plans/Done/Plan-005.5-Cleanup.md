# Plan 005.5 - Cleanup & Preparation (Transition to Phase 2)

## Objetivo

Preparar o terreno para o **Plan 006 (Debt Engine)**.
Conforme identificado no `Report-001`, houve uma implementação prematura de funcionalidades de Dívida e Cartão de Crédito dentro do módulo `Account`.
Este plano visa **remover** essa implementação acoplada ("Erroneous Implementation") preservando a lógica de negócio valiosa (Cálculos de Simuladores) para ser reintegrada corretamente nos módulos futuros.

## Arquivos Afetados

-   `packages/database/schema.prisma`
-   `apps/api/src/modules/account/*`
-   `apps/api/src/modules/simulator/*`
-   `apps/web/src/components/CreateAccountDialog.tsx`
-   `apps/web/src/pages/Dashboard.tsx`

## Passo a Passo

### 1. Refatoração do Banco de Dados (Schema)

-   [ ] **Remover campos de Dívida de `Account`:**
    -   Remover `interestRate`.
    -   Remover `minimumPayment`.
    -   Remover `dueDateDay`.
    -   _Justificativa:_ Estes campos pertencem à entidade `Debt` (Plan 006), não a `Account` (que deve representar apenas disponibilidade/liquidez).
-   [ ] **Atualizar Tipos:**
    -   Remover `DEBT` e `CREDIT_CARD` do enum de tipos de conta (se houver enum no banco ou validação via código), mantendo apenas `WALLET`, `BANK`, `INVESTMENT`.
-   [ ] **Criar Migration:** `npx prisma migrate dev --name cleanup_account_schema`.

### 2. Limpeza do Frontend (Account)

-   [ ] **Atualizar `CreateAccountDialog.tsx`:**
    -   Remover campos de input Juros, Vencimento e Pagamento Mínimo.
    -   Remover opções "Cartão de Crédito" e "Dívida" do Select de tipos.
-   [ ] **Atualizar `Dashboard.tsx`:**
    -   Remover widgets de Simuladores (`SimulatorsDemo`, `TimeCostBadge`) temporariamente. Eles dependem dos dados que estamos removendo.
    -   _Nota:_ O código dos componentes _não será deletado_, apenas desconectado da visualização até o Plan 008.

### 3. Preservação de Lógica (Simuladores)

-   [ ] **Refatorar `apps/api/src/modules/simulator`:**
    -   Desconectar `SimulatorService` de `Account`. Garantir que os métodos de cálculo (`calculateDelayCost`, etc.) sejam funções puras ou dependam de interfaces genéricas, não do Prisma Model `Account`.
    -   Estamos "guardando" a lógica matemática na gaveta para o Plan 008.

## Verificação

-   [ ] O build do Backend (`npm run build`) passa sem erros de tipo (referências a campos deletados removidas).
-   [ ] O build do Frontend passa.
-   [ ] Ao criar uma Nova Conta, não aparecem mais opções de Dívida.
-   [ ] O Dashboard carrega limpo, apenas com o Gráfico e Cards de Saldo (Fase 1 pura).
