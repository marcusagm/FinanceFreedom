# Feature: F04 - Debt Strategy Engine (O Estrategista)

## 1. Visão Geral

**User Story:** "Como usuário, quero saber qual dívida pagar primeiro para sair do buraco o mais rápido possível, sem precisar fazer contas complexas de juros compostos."

## 2. Descrição Detalhada

O cérebro do sistema. Ele ingere todas as dívidas, analisa as taxas de juros (CET) e o fluxo de caixa disponível (do F01 e F03) para montar um "Plano de Ataque".

## 3. Requisitos Funcionais

### A. Cadastro de Dívidas (Passivo)

-   [ ] Dados Obrigatórios: Nome Credor, Saldo Devedor Total, Taxa de Juros Mensal (%), Valor da Parcela Mínima, Dia de Vencimento.
-   [ ] Tipo de Dívida: Cartão de Crédito (Rotativo), Empréstimo Pessoal, Financiamento (Imóvel/Carro), Cheque Especial.

### B. Simulador de Estratégia (O Plano)

-   [ ] **Comparador Snowball vs Avalanche:**
    -   _Snowball:_ Ordena da menor dívida para a maior (Ganho Psicológico).
    -   _Avalanche:_ Ordena da maior taxa de juros para a menor (Ganho Matemático).
    -   O sistema mostra: "Com Snowball você quita em 12 meses. Com Avalanche em 10 meses e economiza R$ 5.000".
-   [ ] **Definição do "Valor de Ataque":** Quanto dinheiro extra (além das parcelas mínimas) o usuário vai dedicar mensalmente para abater dívidas? (Vem automaticamente do superávit do F01).

### C. Execução do Pagamento

-   [ ] Sugestão Mensal: "Dia 05: Pague o mínimo do Santander (R$ 100) e coloque TODO o resto (R$ 450) no Nubank."
-   [ ] Registro de Amortização: Ao pagar, o usuário marca se foi "Parcela Curricular" ou "Amortização Extra". O sistema recalcula a curva de juros instantaneamente.

## 4. Regras de Negócio

-   **RN01 - Recálculo Dinâmico:** Se o usuário gastar o dinheiro "de ataque" em uma pizza (registrado no F05), o Debt Engine deve recalcular o prazo imediatamente ("Você adiou sua liberdade em 2 dias").
-   **RN02 - Prioridade Absoluta:** O "Valor de Ataque" só existe se as Despesas Essenciais (Luz, Aluguel, Comida) estiverem cobertas. Dívida não se paga com dinheiro de comida.

## 5. Critérios de Aceite

-   [ ] Cadastrar 2 dívidas com juros diferentes.
-   [ ] Ver a sugestão de ordem mudar ao alternar entre Snowball e Avalanche.
-   [ ] Registrar um pagamento antecipado e ver o gráfico de "Data da Liberdade" encurtar.
