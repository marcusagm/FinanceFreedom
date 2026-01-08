# Plan 011 - Dashboard Inteligente (Action Feed)

## Objetivo

Fechar o loop. O Dashboard deve deixar de ser passivo e passar a recomendar ações baseadas no cruzamento de Dívida (F04) e Renda (F03).

## Arquivos Afetados

-   `apps/api/src/modules/dashboard/dashboard.service.ts`
-   `apps/web/src/components/dashboard/ActionFeed.tsx`
-   `apps/web/src/components/dashboard/ActionCard.tsx`

## Passo a Passo

### 1. Backend: Recomendação

-   [x] Atualizar `DashboardService.getSummary`:
    -   Calcular `freeCashFlow` (Receita - Despesas Essenciais).
    -   Se `freeCashFlow > 0` e houver `Debts`:
        -   Gerar Recomendação: "Pagar Dívida X" (Baseado na estratégia do Plan 007).
    -   Se `freeCashFlow < 0`:
        -   Gerar Recomendação: "Faltam R$ X. Faça Y unidades do job Z para cobrir."

### 2. Frontend: Action Feed

-   [x] Criar componente `ActionFeed` na Home.
-   [x] Renderizar cards dinâmicos baseados na resposta da API.
-   [x] Botão de Ação Rápida no Card (ex: "Pagar Agora" joga para tela de Dívida).

## Verificação

-   Deixar o usuário com saldo positivo de R$ 500 e uma dívida de R$ 1000.
-   Dashboard deve recomendar: "Use seus R$ 500 para abater Nubank".
-   Deixar o usuário com saldo negativo (-R$ 200).
-   Dashboard deve recomendar: "Faça 1 Freela Design para cobrir o rombo".

## Relatório de Implementação (Feito)

Além dos itens planejados, foram realizadas as seguintes melhorias e correções para garantir a qualidade (Quality.md):

### Extras & Correções

1.  **Testes de Alta Cobertura**:
    -   Backend: `dashboard.service.spec.ts` com **100% de cobertura** na lógica de recomendação.
    -   Frontend: Criados testes unitários para `ActionCard` e `ActionFeed`.
    -   Integração: Testes do `Dashboard.tsx` atualizados para verificar a presença das recomendações.
2.  **Correção de Navegação**:
    -   Ajustado link de ação da dívida para `/debts` (ao invés de rotas inexistentes), garantindo fluxo contínuo.
3.  **Build System**:
    -   Correção de imports case-sensitive (`Card` vs `card`) que quebravam o build em ambientes Linux/Docker.
4.  **Integração Modular**:
    -   Refatoração limpa com `DebtModule` exportando `DebtService` para ser injetado no `Dashboard`.
