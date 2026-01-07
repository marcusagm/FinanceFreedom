# Plan 011 - Dashboard Inteligente (Action Feed)

## Objetivo

Fechar o loop. O Dashboard deve deixar de ser passivo e passar a recomendar ações baseadas no cruzamento de Dívida (F04) e Renda (F03).

## Arquivos Afetados

-   `apps/api/src/modules/dashboard/dashboard.service.ts`
-   `apps/web/src/components/dashboard/ActionFeed.tsx`
-   `apps/web/src/components/dashboard/ActionCard.tsx`

## Passo a Passo

### 1. Backend: Recomendação

-   [ ] Atualizar `DashboardService.getSummary`:
    -   Calcular `freeCashFlow` (Receita - Despesas Essenciais).
    -   Se `freeCashFlow > 0` e houver `Debts`:
        -   Gerar Recomendação: "Pagar Dívida X" (Baseado na estratégia do Plan 007).
    -   Se `freeCashFlow < 0`:
        -   Gerar Recomendação: "Faltam R$ X. Faça Y unidades do job Z para cobrir."

### 2. Frontend: Action Feed

-   [ ] Criar componente `ActionFeed` na Home.
-   [ ] Renderizar cards dinâmicos baseados na resposta da API.
-   [ ] Botão de Ação Rápida no Card (ex: "Pagar Agora" joga para tela de Dívida).

## Verificação

-   Deixar o usuário com saldo positivo de R$ 500 e uma dívida de R$ 1000.
-   Dashboard deve recomendar: "Use seus R$ 500 para abater Nubank".
-   Deixar o usuário com saldo negativo (-R$ 200).
-   Dashboard deve recomendar: "Faça 1 Freela Design para cobrir o rombo".
