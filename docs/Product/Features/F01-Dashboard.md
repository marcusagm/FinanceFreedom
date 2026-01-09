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

-   [ ] Exibir "Saldo Total" (Soma de todas as contas correntes conectadas).
-   [ ] Exibir "Comprometido no Cartão" (Soma das faturas em aberto fechando nos próximos 30 dias).
-   [ ] Exibir "Saldo Livre Real" (Saldo Total - Contas a Pagar Imediatas - Faturas Imediatas). **Este é o número que importa.**

### B. Action Feed (Motor de Recomendação)

-   [ ] Card "Alerta de Vencimento": Contas vencendo em 48h.
-   [ ] Card "Oportunidade de Dívida": "Sobraram R$ 200. Pague a dívida X para economizar Juros." (Link para F04).
-   [ ] Card "Meta de Renda": "Faltam R$ 300 para fechar o mês no azul. Pegue 2 Jobs de Ilustração." (Link para F03).

### C. Navegação Rápida

-   [ ] Botão flutuante (FAB) para "Transação Rápida" (Gasto ou Renda manual).
-   [ ] Atalho para "Sincronizar Agora".

## 4. Regras de Negócio

-   **RN01 - Saldo Livre:** Se o Saldo Livre for negativo, o Dashboard deve entrar em "Modo de Alerta" (Tema Vermelho/Laranja).
-   **RN02 - Privacidade:** Deve haver um botão "Eye" para ocultar valores numéricos (Modo Discreto).
-   **RN03 - Cache:** Os dados do dashboard devem carregar instantaneamente do cache local (Offline-first) e atualizar em background.

## 5. Critérios de Aceite

-   [ ] O usuário consegue entender seu estado financeiro ("Azul" ou "Vermelho") sem rolar a tela.
-   [ ] O Action Feed mostra pelo menos uma ação recomendada se houver dívidas ou contas próximas.
-   [ ] O botão de sincronização atualiza os saldos.
