# Plan 010 - Income Engine (Projeção)

## Objetivo

Implementar o "Grind Mode". Permitir que o usuário arraste trabalhos para o calendário para projetar quanto vai ganhar no mês.

## Arquivos Afetados

-   `apps/api/src/modules/income/income.service.ts`
-   `apps/web/src/pages/IncomeProjection.tsx`
-   `apps/web/src/components/income/CalendarDroppable.tsx`

## Passo a Passo

### 1. Backend: Projeção

-   [ ] Criar modelo `ProjectedIncome` (Vincula uma `WorkUnit` a uma Data/Mês).
    -   Status: `PLANNED`, `IN_PROGRESS`, `DONE`, `PAID`.
-   [ ] Endpoint `GET /income/projection`: Retorna o planejado vs realizado do mês.

### 2. Frontend: Drag & Drop

-   [ ] Criar área de "Disponíveis" (Lista de `WorkUnits` cadastradas no Plan 009).
-   [ ] Criar área de "Mês Atual" (Dropzone).
-   [ ] Ao arrastar um Job para o mês, somar ao "Total Projetado" no topo da tela.

## Verificação

-   Arrastar 5 "Freela Designs" (R$ 200 cada) para o mês atual.
-   O Total Projetado deve subir para R$ 1.000.
-   Marcar 1 deles como "PAID".
-   Verificar se o Saldo da Conta Principal (Plan 002) aumentou em R$ 200.
