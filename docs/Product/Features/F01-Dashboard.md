# Feature: F01 - Dashboard & Hub Financeiro

## 1. Visão Geral

**User Story:** "Como um usuário endividado, eu quero ver se tenho dinheiro para pagar as contas da semana e qual é o próximo passo da minha estratégia de dívida, para reduzir minha ansiedade."

O Dashboard não é apenas um relatório; é um **Centro de Comando**. Ele ignora métricas de vaidade e foca em _solvência_ e _ação imediata_.

## 2. Descrição Detalhada

A tela é dividida em 3 camadas de informação prioritária:

1.  **Sinais Vitais (Topo):** Saldo Real Disponível (Descontando faturas de cartão já comprometidas).
2.  **Action Feed (Centro):** O "Google Now" financeiro. Cards de ação sugerida pelo sistema.
3.  **Big Picture (Base):** Gráfico de tendência de saldo para os próximos 30 dias.

## 3. Requisitos Funcionais

### A. Sinais Vitais

-   [x] Exibir "Saldo Total" (Soma de todas as contas correntes conectadas).
-   [ ] Exibir "Comprometido no Cartão" (Soma das faturas em aberto fechando nos próximos 30 dias).
-   [!] Exibir "Saldo Livre Real" (Saldo Total - Contas a Pagar Imediatas - Faturas Imediatas).
    -   _Nota de Auditoria:_ Atualmente exibe "Receitas vs Despesas" (Fluxo de Caixa) e Saldo Total. A lógica de "Saldo Livre Futuro" requer o módulo de faturas de cartão (V1.1).

### B. Action Feed (Motor de Recomendação)

-   [x] Card "Alerta de Vencimento": Contas vencendo em 48h (via Income Gap / Debt Alerts).
-   [x] Card "Oportunidade de Dívida": "Sobraram R$ 200. Pague a dívida X para economizar Juros." (Link para F04).
-   [x] Card "Meta de Renda": "Faltam R$ 300 para fechar o mês no azul. Pegue 2 Jobs de Ilustração." (Link para F03).

### C. Navegação Rápida

-   [x] Botão flutuante (FAB) para "Transação Rápida" (Gasto ou Renda manual).
-   [x] Atalho para "Sincronizar Agora" (Header).

## 4. Regras de Negócio

-   **RN01 - Saldo Livre:** Se o Saldo Livre (ou Fluxo de Caixa) for negativo, o Dashboard deve entrar em "Modo de Alerta" (Tema Vermelho/Laranja). **[IMPLEMENTADO]**
-   **RN02 - Privacidade:** Deve haver um botão "Eye" para ocultar valores numéricos (Modo Discreto). **[IMPLEMENTADO - via Context]**
-   **RN03 - Cache:** Os dados do dashboard devem carregar instantaneamente do cache local (Offline-first) e atualizar em background. **[IMPLEMENTADO - React Query]**

## 5. Critérios de Aceite

-   [x] O usuário consegue entender seu estado financeiro ("Azul" ou "Vermelho") sem rolar a tela.
-   [x] O Action Feed mostra pelo menos uma ação recomendada se houver dívidas ou contas próximas.
-   [x] O botão de sincronização atualiza os saldos.

## 6. Status de Implementação (V1.0 Audit)

O módulo F01 foi entregue com foco em **Fluxo de Caixa** e **Ação Imediata**.

### Funcionalidades Adicionais Entregues

-   **Time Cost Badge:** Exibe o custo das despesas em "Horas de Trabalho" baseadas no Income Engine.
-   **Sync Manual:** Botão de sincronização forçada com feedback visual (`toast` e `spin`).
-   **Chart Evolution:** Gráfico de saldo com gradiente dinâmico (Verde/Vermelho) baseado na positividade do saldo.

### Pendências (V1.1)

-   **Gestão de Cartões de Crédito:** O cálculo "Comprometido no Cartão" não foi implementado pois depende de um módulo de gestão de faturas (invoice management) que ficou para a V1.1.
