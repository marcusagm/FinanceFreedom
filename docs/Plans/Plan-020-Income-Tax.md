# Plan-020 - Imposto de Renda (Engine)

**Objetivo:** Adicionar campo de imposto nas WorkUnits para projeção líquida.

## 1. Arquivos Afetados

-   `apps/web/src/components/income/CreateWorkUnitDialog.tsx`
-   `apps/web/src/pages/IncomeProjection.tsx`
-   `apps/api/src/modules/income/...`

## 2. Passo a Passo

### A. Cadastro de WorkUnit

-   [ ] **Schema/Backend:** Adicionar `taxRate` (float/decimal) na entidade `WorkUnit`.
-   [ ] **Frontend UI:** Adicionar campo "Imposto (%)" no formulário de criação/edição.

### B. Projeção Líquida

-   [ ] **Cálculo:** `Valor Líquido = Valor Bruto * (1 - (taxRate / 100))`.
-   [ ] **Visualização:**
    -   Nos cards de projeção (Dashboard e IncomeProjection), exibir o valor Líquido como destaque.
    -   (Opcional) Mostrar tooltip: "Bruto: R$ X, Imposto: R$ Y".

## 3. Critérios de Aceite

-   [ ] Cadastrar Job "Freelance" de R$ 1000 com 10% de imposto.
-   [ ] Ao arrastar para o calendário, o total projetado aumenta em R$ 900.
