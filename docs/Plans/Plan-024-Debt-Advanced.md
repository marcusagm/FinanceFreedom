# Plan-024 - Controle Avançado de Dívidas

**Objetivo:** Adicionar precisão ao controle de dívidas, suportando parcelamentos com datas específicas (1ª parcela e dia de vencimento) e projeções reais.

## 1. Arquivos Afetados

-   `apps/api/prisma/schema.prisma`
-   `apps/web/src/components/debt/DebtCard.tsx`
-   `apps/web/src/components/debt/DebtForm.tsx`
-   `apps/api/src/modules/debt/debt.service.ts` (Lógica de projeção)

## 2. Passo a Passo

### A. Modelagem de Dados

-   [ ] **Atualizar Schema:**
    -   Adicionar `installmentsTotal` (Int, opcional).
    -   Adicionar `installmentsPaid` (Int, default 0).
    -   Adicionar `originalAmount` (Decimal, para histórico).
    -   Adicionar `firstInstallmentDate` (DateTime, data da 1ª parcela).
    -   Adicionar `dueDay` (Int, dia de vencimento mensal).

### B. Interface de Gestão

-   [ ] **Formulário de Dívida (`DebtForm`):**
    -   Adicionar inputs para: "Número de Parcelas", "Data da 1ª Parcela" e "Dia de Vencimento".
-   [ ] **Indicador Visual:** Progress Bar nos cards de dívida (Parcela X de Y).
-   [ ] **Ação de Pagamento:** Ao registrar pagamento (Plan-016), dar opção: "Este pagamento quita uma parcela?".
-   [ ] **Edição:** Permitir ajustar número de parcelas restantes e datas.

### C. Lógica e Dashboards

-   [ ] **Lógica de Projeção:**
    -   Parcela 1: Usa `firstInstallmentDate`.
    -   Parcela 2+: Usa o `dueDay` nos meses subsequentes.
-   [ ] **Projeção:** Atualizar cálculo de "Meses restantes" para considerar as datas reais de vencimento.

## 3. Critérios de Aceite

-   [ ] Cadastrar compra "TV" em 10x de R$ 100.
    -   1ª Parcela: 20/Jan.
    -   Vencimento mensal: Dia 10.
-   [ ] Verificar projeção de pagamentos:
    -   Mês 1: 20/Jan (R$ 100)
    -   Mês 2: 10/Fev (R$ 100)
    -   ...
-   [ ] Card mostra "0/10".
-   [ ] Pagar 1 parcela -> Card atualiza "1/10" e saldo devedor cai R$ 100.
