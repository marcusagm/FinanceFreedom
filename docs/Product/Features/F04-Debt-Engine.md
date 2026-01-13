# Feature: F04 - Debt Strategy Engine (O Estrategista)

## 1. Visão Geral

**User Story:** "Como usuário, quero saber qual dívida pagar primeiro para sair do buraco o mais rápido possível, sem precisar fazer contas complexas de juros compostos."

## 2. Descrição Detalhada

O cérebro do sistema. Ele ingere todas as dívidas, analisa as taxas de juros (CET) e o fluxo de caixa disponível (do F01 e F03) para montar um "Plano de Ataque".

## 3. Requisitos Funcionais

### A. Cadastro de Dívidas (Passivo)

### A. Cadastro de Dívidas (Passivo)

-   [x] Dados Obrigatórios: Nome Credor, Saldo Devedor Total, Taxa de Juros Mensal (%), Valor da Parcela Mínima, Dia de Vencimento.
-   [!] Tipo de Dívida: Cartão de Crédito (Rotativo), Empréstimo Pessoal, Financiamento (Imóvel/Carro), Cheque Especial.
    -   _Nota:_ O campo `categoryId` existe no backend, mas a UI atual trata todas as dívidas de forma genérica no formulário. A diferenciação visual explícita ficou para V1.1.

### B. Simulador de Estratégia (O Plano)

-   [x] **Comparador Snowball vs Avalanche:**
    -   _Snowball:_ Ordena da menor dívida para a maior (Ganho Psicológico).
    -   _Avalanche:_ Ordena da maior taxa de juros para a menor (Ganho Matemático).
    -   O sistema mostra: "Com Snowball você quita em X anos/meses". (Implementado em `StrategyComparison`).
-   [x] **Definição do "Valor de Ataque":** Quanto dinheiro extra (além das parcelas mínimas) o usuário vai dedicar mensalmente para abater dívidas? (Vem automaticamente do superávit do F01).
    -   Input "Valor Extra Mensal" implementado na tela de estratégia, recalculando a projeção em tempo real.

### C. Execução do Pagamento

-   [x] Sugestão Mensal: O card da primeira dívida é destacado como "Foco Atual" com botão de ação direta.
    -   "Dia 05: Pague o mínimo do Santander (R$ 100) e coloque TODO o resto (R$ 450) no Nubank."
-   [!] Registro de Amortização: Botão "Registrar Pagamento" cria transação de despesa e abate do saldo devedor automaticamente.
    -   Ao pagar, o usuário marca se foi "Parcela Curricular" ou "Amortização Extra". O sistema recalcula a curva de juros instantaneamente.

## 4. Regras de Negócio

-   **RN01 - Recálculo Dinâmico:** O motor de projeção (`debt.service.ts`) recalcula o tempo de quitação sempre que o usuário altera o "Valor Extra" ou registra um pagamento. **[IMPLEMENTADO]**. Se o usuário gastar o dinheiro "de ataque" em uma pizza (registrado no F05), o Debt Engine deve recalcular o prazo imediatamente ("Você adiou sua liberdade em 2 dias").
-   **RN02 - Prioridade Absoluta:** O "Valor de Ataque" é definido manualmente pelo usuário na tela de estratégia, assumindo que ele já cobriu o essencial (F01). O "Valor de Ataque" só existe se as Despesas Essenciais (Luz, Aluguel, Comida) estiverem cobertas. Dívida não se paga com dinheiro de comida.

## 5. Critérios de Aceite

-   [x] Cadastrar 2 dívidas com juros diferentes.
-   [x] Ver a sugestão de ordem mudar ao alternar entre Snowball e Avalanche.
-   [x] Registrar um pagamento antecipado e ver o saldo da dívida diminuir.

## 6. Status de Implementação (V1.0 Audit)

O módulo F04 está completo e funcional, entregando o valor central de "Inteligência Financeira".

### Funcionalidades Adicionais Entregues

-   **Simuladores Integrados:** `DebtDelayCard` (Custo do Atraso) e `PrepaymentOpportunity` (Economia da Antecipação) integrados diretamente nos cards de dívida.
-   **Projeção Real:** O backend simula o pagamento mês a mês (juros compostos) para dar uma data precisa de quitação.
-   **Integração Transaction:** Pagamentos geram histórico financeiro real.

### Pendências (V1.1)

-   **Instalment Control:** Gestão de parcelas específicas (ex: "Faltam 10 de 12"). Atualmente foca no Saldo Devedor Total.
