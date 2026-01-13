# Plan-027 - UI Premium e Dashboard 2.0

**Objetivo:** Elevar o nível estético e funcional da interface para um padrão "SaaS Premium".

## 1. Arquivos Afetados

-   `apps/web/src/components/layout/Sidebar.tsx` (Novo - substitui Navbar superior se desejado ou complementa)
-   `apps/web/src/pages/Dashboard.tsx`
-   `apps/web/src/index.css` (Temas)

## 2. Passo a Passo

### A. Nova Navegação (Sidebar)

-   [ ] **Layout:** Implementar Sidebar lateral colapsável (Desktop) / Drawer (Mobile).
-   [ ] **Menu:** Links para novos módulos (Investimentos, Configurações).
-   [ ] **Perfil:** Avatar do usuário (integrado com Plan-022) no rodapé da sidebar.

### B. Dashboard Widgets

-   [ ] **Modularidade:** Refatorar Dashboard para usar Grid de Widgets.
-   [ ] **Novos Widgets:**
    -   _Upcoming Transactions:_ Lista compacta de contas a vencer.
    -   _Budget Overview:_ Mini-barras das top categorias.
    -   _Wealth Summary:_ Total Investido vs Dívidas.

### C. Customização (Temas)

-   [ ] **Theme Picker:** Em Settings, permitir escolher entre presets (Emerald, Violet, Corporate Blue, Sunset).
-   [ ] **Variáveis:** Garantir que todas as cores usem variáveis CSS `hsl` dinâmicas.

## 3. Critérios de Aceite

-   [ ] Aplicação abre com menu lateral moderno.
-   [ ] Usuário consegue trocar a cor de destaque do sistema.
-   [ ] Dashboard exibe Widgets de Investimento e Próximas Contas.
