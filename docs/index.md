# Finance Freedom - Documentação do Projeto

Bem-vindo ao repositório do **Finance Freedom**. Este arquivo serve como mapa para Agentes de IA e Desenvolvedores entenderem o contexto, a arquitetura e o plano de execução.

## 🧭 Ordem de Leitura Recomendada (Context Loading)

Para "carregar" o contexto total do projeto, leia os arquivos na seguinte ordem:

1.  **[O Conceito (Idea)](Idea/Idea.md):** Entenda o problema (dívidas), a solução (self-hosted) e o pivot para "Custo Zero".
2.  **[Visão do Produto (Product)](Product/Product-overview.md):** O escopo do MVP V1.0 e os pilares de valor.
3.  **[Arquitetura (Architecture)](Architecture/Architecture.md):** O desenho técnico (NestJS + SQLite + IMAP Worker).
4.  **[Stack & Padrões](Architecture/Development-stack.md):** As ferramentas escolhidas e regras de código.
5.  **[Planos de Execução (Plans)](Plans/):** O passo-a-passo técnico para construção.

---

## 📂 Estrutura de Pastas

### 💡 `/Idea` (Concepção)

-   `Idea.md`: O "Elevator Pitch" e objetivos macro.
-   `Research.md`: Análise de concorrentes e justificativa técnica do pivot (File Import vs Open Finance).
-   `Initial-features.md`: Brainstorming original de funcionalidades.

### 📦 `/Product` (O Que Vamos Construir)

-   `Product-overview.md`: Definição oficial do MVP.
-   `Features-index.md`: Lista de todas as funcionalidades detalhadas.
-   `Features/`: Especificações técnicas de cada módulo (F01 a F06).
    -   _Destaque:_ `F02-Connection-Manager.md` (Especificação do Smart Import).
-   `Implementation-order.md`: O Roadmap de fases (Fundação -> Lógica -> Polimento).

### 🏗️ `/Architecture` (Como Vamos Construir)

-   `Architecture.md`: Diagramas C4, Modelo de Dados (ERD) e Fluxos Críticos.
-   `Development-stack.md`: Node.js, SQLite, React, Docker, BullMQ.
-   `Code-standards.md`: Guia de estilo, linter e convenções de git.
-   `Quality.md`: Estratégia de testes (Unitários, E2E).
-   `Ui-Ux.md`: Diretrizes visuais e biblioteca de componentes (shadcn/ui).

### 📝 `/Plans` (Execução)

Roteiros passo-a-passo para Agentes de Execução.

-   `Plan-001-Setup.md`: Inicialização do Monorepo e Docker.
-   `Plan-002-Connection-Manager.md`: Cadastro de contas.
-   `Plan-003-Transaction-Manager.md`: Lançamento de despesas.
-   `Plan-004-Smart-Import.md`: **(Crítico)** Implementação do parser OFX e IMAP.
-   `Plan-005-Dashboard.md`: UI Principal.

---

## 🚀 Status Atual

-   **Fase:** Planejamento Concluído.
-   **Próximo Passo:** Execução do `Plan-001-Setup.md`.

---

_Gerado automaticamente para orientação de Agentes Antigravity._
