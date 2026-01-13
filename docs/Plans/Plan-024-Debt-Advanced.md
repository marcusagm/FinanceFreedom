# Plan-024 - Controle Avançado de Dívidas

**Objetivo:** Adicionar precisão ao controle de dívidas, suportando parcelamentos e projeções reais.

## 1. Arquivos Afetados

-   `apps/api/prisma/schema.prisma`
-   `apps/web/src/components/debt/DebtCard.tsx`
-   `apps/web/src/components/debt/DebtForm.tsx`

## 2. Passo a Passo

### A. Modelagem de Dados

-   [ ] **Atualizar Schema:**
    -   Adicionar `installmentsTotal` (Int, opcional).
    -   Adicionar `installmentsPaid` (Int, default 0).
    -   Adicionar `originalAmount` (para histórico).

### B. Interface de Gestão

-   [ ] **Indicador Visual:** Progress Bar nos cards de dívida (Parcela X de Y).
-   [ ] **Ação de Pagamento:** Ao registrar pagamento (Plan-016), dar opção: "Este pagamento quita uma parcela?".
-   [ ] **Edição:** Permitir ajustar número de parcelas restantes.

### C. Dashboards

-   [ ] **Projeção:** Atualizar cálculo de "Meses restantes" para considerar o _limite_ das parcelas (se for dívida fixa) vs. juros rotativos.

## 3. Critérios de Aceite

-   [ ] Cadastrar compra "TV" em 10x de R$ 100.
-   [ ] Card mostra "0/10".
-   [ ] Pagar 1 parcela -> Card atualiza "1/10" e saldo devedor cai R$ 100.
