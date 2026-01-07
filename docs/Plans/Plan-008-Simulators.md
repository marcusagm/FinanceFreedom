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

-   [ ] Implementar `SimulatorService`.
    -   `calculateTimeCost(amount, hourlyRate)`: Retorna horas de trabalho necessárias.
    -   `calculateDelayCost(debtId, days)`: Retorna juros acumulados por atraso.

### 2. Frontend: Widgets

-   [ ] Criar `TimeCostBadge`:
    -   Recebe um valor Monetário.
    -   Busca `hourlyRate` (mockado ou calculado da renda).
    -   Exibe: "Isso custa X horas de trabalho".
    -   Adicionar nos detalhes da Transação.
-   [ ] Criar `DelayCostWidget`:
    -   Adicionar na tela de Detalhes da Dívida.
    -   Slider de dias de atraso (1 a 30).
    -   Mostra o prejuízo em tempo real.

## Verificação

-   Definir renda mensal R$ 10.000 / 160h = R$ 62,50/h.
-   Visualizar despesa de R$ 125,00.
-   Badge deve mostrar: "2 horas de vida".
-   No detalhe de uma Dívida de 10% a.m (R$ 1000), simular 30 dias de atraso.
-   Widget deve mostrar +R$ 100 de juros.
