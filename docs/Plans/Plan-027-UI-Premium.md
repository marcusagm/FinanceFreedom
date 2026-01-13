# Plan-027 - UI Premium & Layout 2.0 (Legibilidade e UX)

**Objetivo:** Elevar o nível estético e funcional de todas as telas, focando em legibilidade, hierarquia visual e um layout "SaaS Premium" consistente.

## 1. Arquivos Afetados

-   `apps/web/src/components/layout/Sidebar.tsx` (Substitui Navbar superior)
-   `apps/web/src/pages/*.tsx` (Revisão de UI em todas as páginas)
-   `apps/web/src/components/ui/*.tsx` (Refinamento de componentes base)
-   `apps/web/src/index.css` (Tipografia e Spacing tokens)

## 2. Passo a Passo

### A. Reestruturação do Layout Base

-   [ ] **Sidebar:** Implementar barra lateral colapsável com ícones claros e estados ativos/hover sofisticados.
    -   _Menu:_ Links para novos módulos (Investimentos, Configurações).
    -   _Perfil:_ Avatar do usuário (integrado com Plan-022) no rodapé da sidebar.
-   [ ] **Shell:** Criar um "Application Shell" que fornece consistência em todas as páginas (Margens, Page Headers, Breadcrumbs).

### B. Legibilidade e Hierarquia Visual

-   [ ] **Tipografia:** Implementar escala tipográfica profissional (inter-font/outfit) com contrastes claros entre títulos e corpo.
-   [ ] **Micro-interações:** Adicionar transitions suaves, estados de focus/active e esqueletos de carregamento (Skeletons) consistentes.
-   [ ] **Empty States:** Padronizar ilustrações e CTAs para telas sem dados.

### C. Refinamento Funcional por Tela

-   [ ] **Dashboard:** Refatorar para grid modular com widgets visualmente distintos (Cards com padding generoso e sombras suaves).
-   [ ] **Novos Widgets:**
    -   _Upcoming Transactions:_ Lista compacta de contas a vencer.
    -   _Budget Overview:_ Mini-barras das top categorias.
    -   _Wealth Summary:_ Total Investido vs Dívidas.
-   [ ] **Tabelas (Transactions/Accounts):** Melhorar densidade de informação, alinhamento de colunas e clareza de badges/tags.
-   [ ] **Formulários:** Padronizar labels, helpers e feedbacks de erro para reduzir carga cognitiva.
-   [ ] **Fluxos de Autenticação:** Tornar as telas de Login/Register mais convidativas e modernas.

## 3. Critérios de Aceite

-   [ ] Navegação fluida via Sidebar em Desktop e Drawer em Mobile.
-   [ ] Todas as telas seguem a mesma regra de espaçamento e tipografia (coerência visual).
-   [ ] Melhora perceptível na clareza das informações (menos ruído visual).
-   [ ] Feedback visual imediato em interações (hover, click, loading).
-   [ ] Dashboard exibe Widgets de Investimento e Próximas Contas.
-   [ ] Verificar aparencia da tela de Login, Register, Reset Password, Forgot Password
-   [ ] Verificar aparencia da tela de Dashboard
-   [ ] Verificar aparencia da tela de Transactions
-   [ ] Verificar aparencia da tela de Accounts
-   [ ] Verificar aparencia da tela de Income
-   [ ] Verificar aparencia da tela de IncomeProjection
-   [ ] Verificar aparencia da tela de Debts
-   [ ] Verificar aparencia da tela de Settings
-   [ ] Verificar aparencia da tela de Profile
-   [ ] Verificar aparencia da tela de ImportPage
-   [ ] Verificar aparencia da tela de ImapConfigPage
-   [ ] Verificar aparencia da tela de Categories
-   [ ] Verificar aparencia da tela de Investments
-   [ ] Verificar aparencia da tela de FixedExpenses
-   [ ] Verificar aparencia da tela de Reports
