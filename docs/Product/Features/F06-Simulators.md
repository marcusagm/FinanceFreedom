# Feature: F06 - Simuladores Contextuais

## 1. Visão Geral

**User Story:** "Como usuário, quero saber o impacto real das minhas decisões diárias (como comprar um café ou adiar uma conta) em termos de tempo de trabalho ou juros, para mudar meus hábitos."

Inspirado no "Me Poupe!", mas integrado aos dados reais do usuário.

## 2. Descrição Detalhada

Pequenos widgets de cálculo que aparecem em momentos de decisão (Dashboard ou Detalhe de Dívida).

## 3. Requisitos Funcionais

### A. Simulador "Custo da Hora" (Time is Money)

-   [ ] Input Automático: Pega a renda média do usuário e divide por horas trabalhadas (do F03).
-   [ ] Exibição: Ao ver uma despesa de R$ 200, mostrar um badge: **"Isso custou 4 horas da sua vida"**.
-   [ ] Objetivo: Gerar consciência de consumo.

### B. Simulador "Custo do Atraso" (Scare Tactics)

-   [ ] Input: Dívida selecionada (F04).
-   [ ] Ação: "Se você pagar essa conta de R$ 1.000 com 5 dias de atraso, vai pagar R$ 50 de juros."
-   [ ] Comparação: "R$ 50 dá para comprar: 2 dias de Almoço". (Materializa a perda).

### C. Simulador "Antecipação Inteligente" (Hope Tactics)

-   [ ] Cenário: Usuário tem R$ 500 sobrando.
-   [ ] Simulação: "Se você usar esses R$ 500 para antecipar as últimas parcelas do Financiamento, você elimina 4 meses de dívida e economiza R$ 2.000 em juros finais."
-   [ ] CTA: Botão "Ver como fazer" (leva à instrução de gerar boleto de amortização).

## 4. Regras de Negócio

-   **RN01 - Contexto:** Os simuladores não devem ser intrusivos (popups chatos). Devem ser "Tips" ou "Badges" discretos que o usuário pode expandir.
-   **RN02 - Precisão:** Se o dado (taxa de juros) não for confiável, o simulador não deve mostrar estimativas para não enganar.

## 5. Critérios de Aceite

-   [ ] O sistema calcula corretamente o valor da hora do usuário baseado no F03.
-   [ ] Ao simular um atraso, o cálculo de juros bate com a taxa cadastrada na dívida.
-   [ ] O simulador de antecipação mostra a redução correta de parcelas (lógica de amortização inversa).
