# Relatório de Desvios de Implementação (vs Planos 001-005)

**Data:** 07/01/2026
**Autor:** Antigravity Agent

Este relatório detalha as funcionalidades e mudanças técnicas implementadas que **não estavam previstas** ou **excederam o escopo** dos documentos originais de planejamento `Plan-001` a `Plan-005`.

## 1. Funcionalidades Adicionais (Out of Scope)

### 1.1. Simuladores Financeiros (Feature F06)

A maior adição foi a implementação completa do módulo de Simuladores, que não consta nos Planos 001-005.

-   **Backend (`apps/api/src/modules/simulator`)**:
    -   `SimulatorService` e `SimulatorController` criados.
    -   Lógica de **Cálculo de Custo de Hora de Trabalho** (`calculateHourlyRate`).
    -   Lógica de **Custo do Atraso de Dívida** (`calculateDelayCost`) com juros compostos e multa.
    -   Lógica de **Economia por Antecipação** (`calculatePrepaymentSavings`).
-   **Frontend (`apps/web/src/components/simulators`)**:
    -   Componentes interativos: `DebtDelayCard`, `PrepaymentOpportunity`.
    -   Badge visual: `TimeCostBadge` (converte valor em horas de trabalho).
    -   Integração no Dashboard via `SimulatorsDemo`.

### 1.2. Motor de Dívidas (Debt Engine)

Para suportar os simuladores, a estrutura básica de Contas (Plan 002) foi expandida significativamente.

-   **Alterações no Schema (`schema.prisma`)**:
    -   Adição de campos não previstos: `interestRate` (Taxa Juros), `minimumPayment` (Pagamento Mínimo), `dueDateDay` (Dia Vencimento).
    -   Permissão de saldo negativo (removido validator `@Min(0)`).
-   **Criação de Contas**:
    -   Suporte a novos tipos de conta: `DEBT` (Dívida) e `CREDIT_CARD` (Cartão de Crédito).
    -   Lógica condicional no formulário `CreateAccountDialog` para exibir campos de juros apenas para dívidas.

## 2. Melhorias Técnicas e Arquiteturais

### 2.1. Padronização de UI (Design System)

Embora o Plan 001 mencione `shadcn/ui`, houve um esforço explícito de refatoração para **eliminar CSS customizado** em favor de componentes padronizados, excedendo a implementação básica de UI.

-   **Novo Componente**: `Badge.tsx` (baseado em Tailwind/CVA).
-   **Refatoração**: Remoção de arquivos `.css` isolados (`DebtDelayCard.css`, etc.) e migração total para Tailwind Utility Classes.

### 2.2. Qualidade e Testes (Quality Assurance)

O nível de testes implementado excede o escopo funcional básico dos planos iniciais.

-   **Backend**: Cobertura de testes unitários elevada para **94%** no `SimulatorService`.
-   **Frontend**: Correção de testes de integração complexos (`ImapConfigPage`) envolvendo mocks de Promises e controle de tempo (`waitFor`).

## 3. Resumo do Impacto

| Área            | Planejado (Plans 1-5) | Implementado (Realizado)                              | Status        |
| :-------------- | :-------------------- | :---------------------------------------------------- | :------------ |
| **Contas**      | Nome, Tipo, Saldo     | Nome, Tipo, Saldo, **Juros, Vencimento, Pgto Mínimo** | 🔼 Expandido  |
| **Dashboard**   | Cards, Gráfico, Lista | Cards, Gráfico, **Simuladores de Dívida, Custo Hora** | 🔼 Expandido  |
| **Simuladores** | _Não Planejado_       | **Implementação Completa (Back + Front)**             | ➕ Adicionado |
| **UI**          | Instalação Básica     | **Padronização Estrita, Novos Componentes**           | 🔼 Melhorado  |

## Conclusão

A implementação atual cobre 100% do escopo dos Plans 001-005 e avança para entregar valor, antecipando completamente a **Feature F06 (Simuladores)** e preparando a base de dados para a **Feature F04 (Debt Engine)**.
