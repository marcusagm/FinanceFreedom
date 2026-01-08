# Plan 010 - Income Engine (Projeção)

## Objetivo

Implementar o "Grind Mode". Permitir que o usuário arraste trabalhos para o calendário para projetar quanto vai ganhar no mês.

## Arquivos Afetados

-   `apps/api/src/modules/income/income.service.ts`
-   `apps/web/src/pages/IncomeProjection.tsx`
-   `apps/web/src/components/income/CalendarDroppable.tsx`

## Passo a Passo

### 1. Backend: Projeção

-   [x] Criar modelo `ProjectedIncome` (Vincula uma `WorkUnit` a uma Data/Mês).
    -   Status: `PLANNED`, `IN_PROGRESS`, `DONE`, `PAID`.
-   [x] Endpoint `GET /income/projection`: Retorna o planejado vs realizado do mês.

### 2. Frontend: Drag & Drop

-   [x] Criar área de "Disponíveis" (Lista de `WorkUnits` cadastradas no Plan 009).
-   [x] Criar área de "Mês Atual" (Dropzone).
-   [x] Ao arrastar um Job para o mês, somar ao "Total Projetado" no topo da tela.

## Implementações Adicionais (Enhancements & Quality)

### 3. Funcionalidades Avançadas

-   [x] **Status Interativo**: Clicar no item alterna entre Status (PLANNED -> DONE -> PAID).
-   [x] **Integração Financeira**: Ao marcar como `PAID`, cria automaticamente uma Transação de Receita.
-   [x] **Prevenção de Duplicatas**: Lógica robusta para garantir que alternar status não duplique transações (bidirectional linking).
-   [x] **Distribuição de Carga**: Funcionalidade "Distribuir" (Ícone Tesoura) para dividir Jobs longos (ex: 120h) em múltiplos dias.

### 4. Qualidade e Testes

-   [x] **Backend Coverage**: 100% de cobertura em `ProjectedIncomeService` e `ProjectedIncomeController`.
-   [x] **Frontend Coverage**: Testes de integração para `IncomeProjection` e unitários para `CalendarDay`/`DistributeIncomeDialog`.

## Verificação

-   [x] Arrastar 5 "Freela Designs" (R$ 200 cada) para o mês atual.
-   [x] O Total Projetado deve subir para R$ 1.000.
-   [x] Marcar 1 deles como "PAID".
-   [x] Verificar se o Saldo da Conta Principal (Plan 002) aumentou em R$ 200.
