# Roadmap do Próximo Ciclo de Implementação (V1.1 -> V2.0 Foundation)

Este documento define a ordem de implementação para o novo ciclo de desenvolvimento do **Finance Freedom**. O foco é evoluir a arquitetura "Release Candidate" para uma plataforma de **Inteligência Financeira Proativa**, cobrindo dívidas técnicas, segurança e novos módulos de gestão patrimonial e cartões.

## Priorização Estratégica

A ordem de execução foi definida para priorizar alterações estruturais no Banco de Dados (Schema) e na Fundação do sistema, evitando retrabalho em funcionalidades dependentes.

1.  **Fundação e Core (Critical):** Alterações massivas no Schema (Multi-moeda, Cartões Dedicados, Pessoas, Subcategorias) e Segurança.
2.  **Automação e Confiabilidade (High):** Categorização automática e Conciliação para garantir dados confiáveis e reduzir trabalho manual.
3.  **Novos Motores de Produto (Medium):** Gestão de Patrimônio (Wealth), Inflação e Estratégias de Sobrevivência (Dívidas).
4.  **Camada de Inteligência (Low/Bonus):** O "Assistente" comportamental que atua sobre os dados consolidados.

---

## Ordem de Implementação

### Fase 1: Fundação, Segurança e Core Evolution

Esta fase prepara o terreno para todas as outras. Focada em Backend e Migrações de Banco de Dados.

#### **[Plan-031] Core Evolution & Security**

- **Foco:** Reestruturação do Schema e Segurança.
- **Escopo:**
    - **Segurança:** Criptografia de senhas IMAP e credenciais sensíveis (AES-256).
    - **Multi-moeda Core:** Adição de colunas `currency`, `originalAmount`, `exchangeRate` em Transações e Contas. Integração básica com APIs de Câmbio.
    - **Entidades Estendidas:** Criação de `Person` (Mapas de Pessoas/Contatos), `BudgetHistory` e Suporte a Subcategorias (`parentId`).
    - **Transaction Workflow:** Adição de status (`PENDING`, `CONFIRMED`) para transações.

#### **[Plan-032] Credit Card Manager Full**

- **Foco:** Módulo dedicado para Cartões de Crédito (separando de Contas/Dívidas).
- **Escopo:**
    - Nova entidade `CreditCard` com controle de ciclos (Fechamento/Vencimento).
    - Lógica de gestão de faturas, projeção de parcelas futuras e cálculo de limite disponível.
    - Modos de pagamento: Vinculado (Débito aut.) vs Independente.
    - Interface de UI específica para gestão de cartões.

### Fase 2: Automação e "Zero-Touch" Experience

Reduzir o atrito do usuário com a plataforma.

#### **[Plan-033] Automatic Categorization Engine**

- **Foco:** Motor de regras para categorização sem intervenção humana.
- **Escopo:**
    - Tabela `CategoryRule` e serviço de `CategorizerService`.
    - Lógica de aprendizado baseada em regex e histórico do usuário.
    - Interface de gestão de regras e "Feedback Loop".

#### **[Plan-034] Automation & Notifications Hub**

- **Foco:** Background Jobs e Proatividade.
- **Escopo:**
    - Implementação de Cron Jobs (NestJS Schedule) para Sync IMAP automático.
    - Sistema de Notificações (Lembretes de vencimento, Alertas de sistema).
    - Refatoração do `Smart Import` para rodar em background.

#### **[Plan-035] Reconciliation & Audit Mode**

- **Foco:** Integridade e Confiança nos Dados.
- **Escopo:**
    - Entidade `ReconciliationSession`.
    - Wizard de Auditoria (Saldo Real vs Saldo Sistema).
    - Geração automática de transações de ajuste e detecção de anomalias.

### Fase 3: Novos Motores de Inteligência Financeira

Transformação de "Planilhão" para "Gestor Patrimonial".

#### **[Plan-036] Wealth Management & Purchasing Power**

- **Foco:** Crescimento Patrimonial e Realidade Econômica.
- **Escopo:**
    - Evolução de Investimentos (Classes de Ativos, Rebalanceamento).
    - Serviço de Inflação (Integração BCB/IPCA) e Calculadora de Poder de Compra Real.
    - Projeções de Longo Prazo (Independência Financeira).

#### **[Plan-037] Advanced Debt Strategy (Survival Mode)**

- **Foco:** Gestão de Crise e Psicologia Financeira.
- **Escopo:**
    - Estratégia "Paz Mental" (Ranking de Stress).
    - Rastreador de Negociações e Alertas de Prescrição.
    - Fluxos de "Sobrevivência" (Redirecionamento para Reserva de Emergência).

#### **[Plan-038] Behavioral Assistant (The Guide)**

- **Foco:** Insights proativos e "Nudges".
- **Escopo:**
    - Detecção de "Gastos Vampiros" (Assinaturas esquecidas).
    - Custo de Oportunidade Contextual.
    - Health Score 2.0 (Resiliência financeira).

---

## Observações Gerais

- **Testes:** Cada plano deve incluir a criação/atualização de testes unitários e de integração para os novos serviços.
- **UI/UX:** A implementação de UI deve seguir estritamente o Design System (Temas, Componentes) já estabelecido na V1.0.
