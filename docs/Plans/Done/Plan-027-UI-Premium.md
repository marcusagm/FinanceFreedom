# Plan-027 - UI Premium & Layout 2.0 (Legibilidade e UX)

**Objetivo:** Elevar o nível estético e funcional de todas as telas, focando em legibilidade, hierarquia visual, um layout "SaaS Premium" consistente, e possibilidade de criação de temas.

**Notas**

-   Garanta uma paleta de cores moderna e agradável para o usuário.
-   O layout deve ser responsivo e adaptável para todos os dispositivos.
-   O layout deve ser consistente em todas as telas.
-   Os modos dark e light devem estar completos e consistentes.

## 1. Arquivos Afetados

-   `apps/web/src/components/layout/Sidebar.tsx` (Substitui Navbar superior)
-   `apps/web/src/pages/*.tsx` (Revisão de UI em todas as páginas)
-   `apps/web/src/components/ui/*.tsx` (Refinamento de componentes base)
-   `apps/web/src/index.css` (Tipografia e Spacing tokens)
-   `apps/web/src/theme.css` (Variáveis de cores temas, tipografia, espaçamentos, bordas, etc)

## 2. Passo a Passo

### A. Reestruturação do Layout Base

-   [x] **Sidebar:** Implementar barra lateral colapsável com ícones claros e estados ativos/hover sofisticados.
    -   _Menu:_ Links para novos módulos (Investimentos, Configurações). Organizar links de forma coerente e prática melhorando a experiência do usuário.
    -   _Perfil:_ Avatar do usuário (integrado com Plan-022) no rodapé da sidebar.
-   [x] **Shell:** Criar um "Application Shell" que fornece consistência em todas as páginas (Margens, Page Headers, Breadcrumbs).

### B. Legibilidade e Hierarquia Visual

-   [x] **Tipografia:** Implementar escala tipográfica profissional (inter-font/outfit) com contrastes claros entre títulos e corpo.
-   [x] **Micro-interações:** Adicionar transitions suaves, estados de focus/active e esqueletos de carregamento (Skeletons) consistentes.
-   [x] **Empty States:** Padronizar ilustrações e CTAs para telas sem dados.

### C. Refinamento Funcional por Tela

-   [x] **Dashboard:** Refatorar para grid modular com widgets visualmente distintos (Cards com padding generoso e sombras suaves).
-   [x] **Novos Widgets:**
    -   _Upcoming Transactions:_ Lista compacta de contas a vencer.
-   [x] **Tabelas (Transactions/Accounts):** Melhorar densidade de informação, alinhamento de colunas e clareza de badges/tags.
-   [x] **Formulários:** Padronizar labels, helpers e feedbacks de erro para reduzir carga cognitiva.
-   [x] **Fluxos de Autenticação:** Tornar as telas de Login/Register mais convidativas e modernas.
-   [x] **Formatar componentes:** Dialog para que o conteúdo não estrapole a tela, deixando sempre o cabeçalho e o rodapé visível, criando barra de rolagem para a area de conteúdo.

## 3. Critérios de Aceite

-   [x] Navegação fluida via Sidebar em Desktop e Drawer em Mobile.
-   [x] Todas as telas seguem a mesma regra de espaçamento e tipografia (coerência visual).
-   [x] Melhora perceptível na clareza das informações (menos ruído visual).
-   [x] Feedback visual imediato em interações (hover, click, loading).
-   [x] Dashboard exibe Widgets de Investimento e Próximas Contas.
-   [x] Verificar aparencia da tela de Login, Register, Reset Password, Forgot Password
-   [x] Verificar aparencia da tela de Dashboard
-   [x] Verificar aparencia da tela de Transactions
-   [x] Verificar aparencia da tela de Accounts
-   [x] Verificar aparencia da tela de Income
-   [x] Verificar aparencia da tela de IncomeProjection
-   [x] Verificar aparencia da tela de Debts
-   [x] Verificar aparencia da tela de Settings
-   [x] Verificar aparencia da tela de Profile
-   [x] Verificar aparencia da tela de ImportPage
-   [x] Verificar aparencia da tela de ImapConfigPage
-   [x] Verificar aparencia da tela de Categories
-   [x] Verificar aparencia da tela de Investments
-   [x] Verificar aparencia da tela de FixedExpenses
-   [x] Verificar aparencia da tela de Reports

## 4. Implementações Adicionais (Realizadas)

-   [x] **Mobile Navigation:** Criação de componente `MobileNav` dedicado para melhor experiência em dispositivos móveis, com acesso rápido ao menu e ocultação automática da Sidebar.
-   [x] **Dialog Migration:** Substituição completa do componente legado `Modal` por `Dialog` (Radix UI) em toda a aplicação, garantindo melhor acessibilidade e controle de foco.
-   [x] **Responsive Income Projection:** Correção de problemas de "clipping" na tela de Projeção de Renda em dispositivos móveis. Implementação de scroll horizontal na grid e layout flexível (stacked) para os status cards.
-   [x] **Quick Action FAB:** Ajuste de posicionamento do botão flutuante para evitar sobreposição com a navegação móvel.
-   [x] **Clean Code:** Remoção de valores arbitrários do Tailwind (ex: `min-w-[140px]`) substituindo por utility classes padrão (`min-w-35`) para conformidade com o design system.
