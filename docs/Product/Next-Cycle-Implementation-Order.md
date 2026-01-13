# Ordem de Implementação - Ciclo V1.1 (Premium & Expansion)

Com base na auditoria final da V1.0 e nas novas requisições estratégicas, este ciclo foca em **Profissionalização (UI/Auth)** e **Expansão de Escopo (Investimentos/Orçamento)**.

## Fases de Implementação

A ordem abaixo prioriza dependências lógicas (ex: Categorias são necessárias para Orçamento; Auth é necessário para perfis).

### Fase 1: Fundação e Segurança (Semana 1)

**Objetivo:** Preparar a aplicação para o "mundo real" e criar estruturas de dados base.

1.  **[Plan-022] Autenticação & Segurança**

    -   _Feature Relacionada:_ Segurança / Multi-usuário.
    -   _Justificativa:_ Requisito crítico para deploy e para proteger os novos dados sensíveis (Investimentos).
    -   _Escopo:_ NextAuth.js, Login Page, Proteção de Rotas.

2.  **[Plan-023] Configurações, Categorias & Despesas Fixas**
    -   _Feature Relacionada:_ Gestão de Categorias, Despesas Fixas, Projeções.
    -   _Justificativa:_ Requisito fundamental para os módulos de Orçamento e para precisão do Fluxo de Caixa previsto.
    -   _Escopo:_ Página de Settings (Geral), Páginas independentes para Categorias e Despesas Fixas, Integração no motor de Projeção.

### Fase 2: Expansão do Motor Financeiro (Semana 2)

**Objetivo:** Preencher as lacunas funcionais apontadas (Dívidas, Investimentos).

3.  **[Plan-024] Controle Avançado de Dívidas**

    -   _Feature Relacionada:_ Debt Engine.
    -   _Justificativa:_ O controle atual carece de precisão sobre parcelas.
    -   _Escopo:_ Controle de parcelas pagas/pendentes, projeção real.

4.  **[Plan-025] Módulo de Investimentos & Metas**
    -   _Feature Relacionada:_ Wealth Management (Novo).
    -   _Justificativa:_ Transforma o app de um "gerenciador de dívidas" para um "gerenciador de patrimônio".
    -   _Escopo:_ Contas de Investimento, Metas de Economia.

### Fase 3: Inteligência e Gestão (Semana 3)

**Objetivo:** Transformar dados em insights e controle.

5.  **[Plan-026] Orçamento & Saúde Financeira**
    -   _Feature Relacionada:_ Financial Health / Budgeting.
    -   _Justificativa:_ O usuário precisa definir limites e saber sua nota geral.
    -   _Escopo:_ Orçamento por Categoria, Health Score Engine (0-1000), Gráfico de Velocímetro.

### Fase 4: Experiência Premium & Performance (Semana 4)

**Objetivo:** "Wow Factor", consistência de layout e escalabilidade.

6.  **[Plan-027] UI Premium & Layout 2.0 (Legibilidade e UX)**

    -   _Feature Relacionada:_ Dashboard / UI-UX.
    -   _Justificativa:_ A interface precisa de coerência visual e hierarquia clara para ser profissional.
    -   _Escopo:_ Sidebar Navigation, Application Shell, Skeletons, padronização de tipografia e espaçamento em todas as telas.

7.  **[Plan-028] Otimização de Performance (Server-Side)**
    -   _Feature Relacionada:_ Transaction Manager.
    -   _Justificativa:_ Garantir escalabilidade para usuários com milhares de registros sem lentidão.
    -   _Escopo:_ Server-side Filtering & Pagination em tabelas densas.

### Fase 5: Refinamento e Localização (Semana 5)

**Objetivo:** Personalização profunda e suporte global.

8.  **[Plan-029] Personalização e Branding Dinâmico**

    -   _Feature Relacionada:_ UI-UX / Personalização.
    -   _Justificativa:_ Permitir que o usuário adapte a interface ao seu estilo pessoal (Accent colors, arredondamento).
    -   _Escopo:_ Theme Engine (HSL), Accent Color Picker, salvamento de preferências de estilo no perfil.

9.  **[Plan-030] Internacionalização & Localização (i18n)**
    -   _Feature Relacionada:_ Core Foundation / Global Reach.
    -   _Justificativa:_ Preparar o app para múltiplos mercados com suporte a idiomas, moedas e formatos de data dinâmicos.
    -   _Escopo:_ react-i18next, Localização de moedas (BRL/USD/EUR), Extração de strings e formatos regionais.
