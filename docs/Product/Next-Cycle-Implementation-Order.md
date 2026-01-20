# Roadmap de Implementação Detalhado (V2.0 Cycle)

Este documento redefine a ordem de implementação para o ciclo V2.0, focando em entregas granulares e completas, garantindo que cada plano resulte em uma parte funcional e testada do sistema.

> **Status Plan-031:** ✅ Concluído (Foundation Core).
> **Foco Agora:** Implementação funcional sobre a fundação, dividida em Back-end (Lógica/Dados) e Front-end (Interface/Experiência).

---

## Fase 2: Gestão de Crédito (Credit Card Manager)

A gestão de cartões é complexa o suficiente para ser separada em lógica de serviço e interface de usuário.

1.  **[Plan-032] Credit Card - Backend Core**
    - Serviços de limite, ciclo de fatura (Fechamento/Vencimento) e parcelamento.
    - Testes unitários e integração de cálculo de faturas.
2.  **[Plan-033] Credit Card - UI & Experience**
    - Telas de listagem, detalhe de fatura (Timeline), gestão de pagamentos.
    - Widgets de cartão.

## Fase 3: Core UI Adoption (Entidades do Plan-031)

O plano 031 criou a fundação de dados, agora é necessário expor isso na interface.

3.  **[Plan-034] Entities UI - Person Management**
    - Gestão de Contatos/Pessoas.
    - Vincular transações e dívidas a pessoas (Empréstimos P2P).
4.  **[Plan-035] Entities UI - Subcategories & Budgets**
    - Interface de gerenciamento de hierarquia de categorias.
    - Gestão de orçamentos históricos (BudgetHistory).
5.  **[Plan-036] Transaction Batch Operations**
    - Interface para edição em lote (Bulk Actions) de transações (Categorizar, Status, Deletar).
6.  **[Plan-037] Multi-Currency UI Integration**
    - Atualizar Dashboard e Listas para exibir valores convertidos (BRL) e originais.
    - Indicadores de múltiplas moedas nas contas.

## Fase 4: Automação e "Zero-Touch"

7.  **[Plan-038] Auto Categorization - Engine**
    - Lógica de backend, regex, e aplicação de regras no `create/import`.
8.  **[Plan-039] Auto Categorization - User Interface**
    - Tela de gestão de regras.
    - Feedback loop na edição de transação ("Criar regra para isso?").
9.  **[Plan-040] Automation Backend (Cron & Sync)**
    - Setup de Cron Jobs (NestJS Schedule).
    - Serviço de Sincronização em background (Headless).
10. **[Plan-041] Notifications System**
    - Serviço de Notificações, Templates de E-mail (i18n).
    - Central de Notificações no Frontend (Badges, Listas).

## Fase 5: Integridade e Conciliação

11. **[Plan-042] Reconciliation - Logic Engine**
    - Cálculo de discrepâncias e geração de ajustes.
12. **[Plan-043] Reconciliation - Wizard UI**
    - Interface passo a passo para auditoria de contas.

## Fase 6: Gestão Patrimonial (Wealth)

13. **[Plan-044] Inflation Engine**
    - Serviço de índices econômicos (IPCA/IGP-M) e calculadora de valor real.
14. **[Plan-045] Wealth Management - Core Logic**
    - Classes de ativos, targets de alocação e cálculo de rebalanceamento.
15. **[Plan-046] Wealth Dashboard**
    - Visualização de portfólio, sugestões de rebalanceamento e poder de compra real.

## Fase 7: Estratégias Avançadas (Debt & Behavior)

16. **[Plan-047] Debt Strategy - Negotiation & Mental Peace**
    - Lógica de "Paz Mental", alertas de prescrição e registro de negociações.
17. **[Plan-048] Survival Mode UI**
    - Interface focada em crise, logs de negociação e toggle "Modo Sobrevivência".
18. **[Plan-049] Behavioral Engine**
    - Detecção de padrões (Gastos Vampiros) e Custo de Oportunidade.
19. **[Plan-050] Assistant UI & Insights**
    - Widgets proativos, Health Score 2.0 e Cards de Insight.

---

## Critérios Globais para Todos os Planos

- **QA:** Cobertura de testes unitários > 80% para novos serviços. Testes de Integração para endpoints críticos.
- **i18n:** Todas as strings de UI e mensagens de erro traduzidas (PT-BR / EN). Formatação (Data/Moeda) dinâmica.
