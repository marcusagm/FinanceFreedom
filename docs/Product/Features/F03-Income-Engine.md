# Feature: F03 - Income Engine (Renda & Capacidade)

## 1. Visão Geral

**User Story:** "Como freelancer, quero saber exatamente quanto preciso trabalhar a mais para pagar a dívida deste mês, transformando horas livres em liberdade financeira."

Diferente de sistemas que apenas registram "Salário", este motor entende a _natureza_ da renda: Fixa (Salário) ou Variável (Baseada em Esforço).

## 2. Descrição Detalhada

O sistema permite cadastrar "Produtos de Trabalho" (ex: "Hora de Consultoria", "Ilustração Completa") e projetar a renda futura alocando esses produtos no calendário.

## 3. Requisitos Funcionais

### A. Cadastro de Fontes de Renda

-   [ ] **Tipo Salário:** Valor fixo, data recorrente (ex: Dia 05). Previsibilidade 100%.
-   [ ] **Tipo Variável (Unitário):**
    -   Nome da Unidade (ex: "Ilustração").
    -   Valor Unitário Líquido (ex: R$ 500).
    -   Tempo Médio de Execução (ex: 10h ou 5 dias).
    -   Capacidade Simultânea (ex: Consigo fazer 2 ao mesmo tempo).

### B. Planejador de Capacidade (The Grind)

-   [ ] Painel "Projeção de Renda": O usuário arrasta "Unidades" para o mês.
    -   Ex: "Vou pegar 3 ilustrações em Janeiro".
    -   Sistema calcula: 3 x R$ 500 = **+R$ 1.500 projetados**.
-   [ ] Status do Job: "A Fazer" -> "Em Andamento" -> "Entregue (A Receber)" -> "Recebido".
    -   Só entra no Fluxo de Caixa Real quando "Recebido".
    -   Entra no Fluxo Projetado quando "A Fazer/Em Andamento".

### C. Gamificação da Meta

-   [ ] O sistema integra com o F04 (Dívidas): "Faltam R$ 1.000 para a meta do mês. Isso equivale a **2 Ilustrações**. Você tem 20h livres na agenda. Aceita o desafio?"

## 4. Regras de Negócio

-   **RN01 - Conservadorismo:** A renda variável projetada deve ser mostrada separada da renda garantida no Dashboard principal, para não gerar falsa segurança.
-   **RN02 - Impostos:** Campo opcional de "% de Imposto" para descontar automaticamente do valor unitário (ex: MEI/Simples).

## 5. Critérios de Aceite

-   [ ] Cadastrar uma unidade de trabalho "Freelance".
-   [ ] Adicionar 3 unidades ao mês atual e ver a "Renda Projetada" aumentar.
-   [ ] Marcar um job como "Recebido" e ver o saldo da conta aumentar automaticamente.
