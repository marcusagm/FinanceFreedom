# Plan-020 - Imposto de Renda (Engine)

**Objetivo:** Adicionar campo de imposto nas WorkUnits para projeção líquida.

## 1. Arquivos Afetados

-   `apps/web/src/components/income/CreateWorkUnitDialog.tsx`
-   `apps/web/src/pages/IncomeProjection.tsx`
-   `apps/api/src/modules/income/...`

## 2. Passo a Passo

### A. Cadastro de WorkUnit

-   [x] **Schema/Backend:** Adicionar `taxRate` (float/decimal) na entidade `WorkUnit`.
-   [x] **Frontend UI:** Adicionar campo "Imposto (%)" no formulário de criação/edição.

### B. Projeção Líquida

-   [x] **Cálculo:** `Valor Líquido = Valor Bruto * (1 - (taxRate / 100))`.
-   [x] **Visualização:**
    -   Nos cards de projeção (Dashboard e IncomeProjection), exibir o valor Líquido como destaque.
    -   (Opcional) Mostrar tooltip: "Bruto: R$ X, Imposto: R$ Y".

## 3. Critérios de Aceite

-   [x] Cadastrar Job "Freelance" de R$ 1000 com 10% de imposto.
-   [x] Ao arrastar para o calendário, o total projetado aumenta em R$ 900.

## 4. Implementações Adicionais e Qualidade

-   [x] **Cobertura de Testes (Backend):** Adicionados testes unitários em `income.service.spec.ts` e `income.controller.spec.ts` para validar persistência e fluxo do `taxRate`.
-   [x] **Cobertura de Testes (Frontend):**
    -   Atualizado `CreateWorkUnitDialog.test.tsx` para simular input de imposto.
    -   Atualizado `IncomeProjection.test.tsx` para validar cálculo de valor líquido na interface.
-   [x] **Badge Visual:** Adicionado badge indicativo de taxa (ex: "-10%") nos cards arrastáveis (`DraggableWorkUnit`).
