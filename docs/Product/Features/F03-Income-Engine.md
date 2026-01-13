# Feature: F03 - Income Engine (Renda & Capacidade)

## 1. Visão Geral

**User Story:** "Como freelancer, quero saber exatamente quanto preciso trabalhar a mais para pagar a dívida deste mês, transformando horas livres em liberdade financeira."

Diferente de sistemas que apenas registram "Salário", este motor entende a _natureza_ da renda: Fixa (Salário) ou Variável (Baseada em Esforço).

## 2. Descrição Detalhada

O sistema permite cadastrar "Produtos de Trabalho" (ex: "Hora de Consultoria", "Ilustração Completa") e projetar a renda futura alocando esses produtos no calendário.

## 3. Requisitos Funcionais

### A. Cadastro de Fontes de Renda

### A. Cadastro de Fontes de Renda

-   [x] **Tipo Salário:** Valor fixo, data recorrente (ex: Dia 05). Previsibilidade 100%. (Via `IncomeSourceCard` / `IncomePage`).
-   [x] **Tipo Variável (Unitário):**
    -   Nome da Unidade (ex: "Ilustração").
    -   Valor Unitário Líquido (ex: R$ 500).
    -   Tempo Médio de Execução (ex: 10h ou 5 dias).
    -   Capacidade Simultânea (ex: Consigo fazer 2 ao mesmo tempo). (Campo `estimatedTime` implementado).

### B. Planejador de Capacidade (The Grind)

-   [x] Painel "Projeção de Renda": O usuário arrasta "Unidades" para o mês.
    -   Ex: "Vou pegar 3 ilustrações em Janeiro".
    -   Sistema calcula: 3 x R$ 500 = **+R$ 1.500 projetados**.
-   [x] Status do Job: "A Fazer" -> "Em Andamento" -> "Entregue (A Receber)" -> "Recebido".
    -   Só entra no Fluxo de Caixa Real quando "Recebido".
    -   Entra no Fluxo Projetado quando "A Fazer/Em Andamento".

### C. Gamificação da Meta

-   [x] O sistema integra com o F04 (Dívidas): "Faltam R$ 1.000 para a meta do mês." (Via `TimeCostBadge` nos cards de despesa/dívida, mostrando quanto tempo de trabalho custa aquela dívida).

## 4. Regras de Negócio

-   **RN01 - Conservadorismo:** A renda variável projetada deve ser mostrada separada da renda garantida no Dashboard principal. **[IMPLEMENTADO - IncomeProjection Page]**
-   **RN02 - Impostos:** Campo opcional de "% de Imposto" para descontar automaticamente do valor unitário. **[IMPLEMENTADO - Plan-020]**

## 5. Critérios de Aceite

-   [x] Cadastrar uma unidade de trabalho "Freelance".
-   [x] Adicionar 3 unidades ao mês atual e ver a "Renda Projetada" aumentar.
-   [x] Marcar um job como "Recebido" e ver o saldo da conta aumentar automaticamente.

## 6. Status de Implementação (V1.0 Audit)

O módulo F03 foi implementado integralmente, oferecendo um motor de projeção de renda poderoso.

### Funcionalidades Adicionais Entregues

-   **Tax Engine:** Cálculo automático de imposto (Tax Rate) por unidade de trabalho, exibindo valores Líquidos na projeção.
-   **Distribuição de Carga:** Ferramenta "Tesoura" para dividir jobs longos em múltiplos dias no calendário.
-   **Status Bidirecional:** Marcar como "Pago" gera transação; Desmarcar remove transação ou estorna, mantendo integridade.
-   **Visual Drag & Drop:** Interface rica com Dnd-Kit e calendário responsivo.
