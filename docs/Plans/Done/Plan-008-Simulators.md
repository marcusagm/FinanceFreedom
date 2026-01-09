# Plan 008 - Simuladores (Contexto)

## Objetivo

Implementar widgets que traduzem dinheiro em tempo e esforço, gerando "dor de pagamento" ou "esperança de quitação".

## Arquivos Afetados

-   `apps/api/src/modules/simulator/simulator.service.ts`
-   `apps/web/src/components/simulators/TimeCostWidget.tsx`
-   `apps/web/src/components/simulators/DelayCostWidget.tsx`

### 0. Contexto

-   A lógica matemática ("Cálculos") já existe (preservada no Plan 005.5).
-   Os componentes visuais já existem (desconectados no Plan 005.5).
-   **Missão:** Conectar isso à nova entidade `Debt` (Plan 006).

### 1. Backend: Service Integration

-   [x] Implementar `SimulatorService`.
    -   `calculateTimeCost(amount, hourlyRate)`: Retorna horas de trabalho necessárias.
    -   `calculateDelayCost(debtBalance, interestRate, days)`: Refatorado para ser "pure logic" (não depende de DB).

### 2. Frontend: Widgets

-   [x] Criar `TimeCostBadge`:
    -   Recebe um valor Monetário.
    -   Busca `hourlyRate` (calculado da renda dos últimos 30 dias).
    -   Exibe: "Isso custa X horas de trabalho".
    -   Adicionado na lista de Transações (Expansível ou badge direto).
-   [x] Criar `DelayCostWidget` (Renomeado para `DebtDelayCard`):
    -   Adicionado na tela de Dívidas (Dentro do `DebtCard`).
    -   Slider de dias de atraso (1 a 60).
    -   Mostra o prejuízo em tempo real (Juros + Multa).

## Melhorias Adicionais Realizadas

-   **Integração Direta no Card:** Em vez de widgets isolados, os simuladores foram embutidos no component `DebtCard` com botões de ação (Timer para Atraso, TrendingUp para Antecipação).
-   **Prepayment Opportunity:** O recurso de antecipação (originalmente parte de um demo) foi refatorado e integrado como um "Simulador de Esperança" no Card de Dívida.
-   **Cleanup:** Remoção de arquivos obsoletos (`SimulatorsDemo.tsx`) e limpeza de código no Dashboard e Página de Dívidas.

## Verificação

-   [x] Definir renda mensal (cálculo automático baseado em transações).
-   [x] Visualizar despesa de R$ 125,00 -> Badge "2 horas de vida" (verificado como "2h of work").
-   [x] No detalhe de uma Dívida de 12% a.m (R$ 1000), simular 30 dias de atraso -> Mostra +R$ 140 (Juros + Multa).
