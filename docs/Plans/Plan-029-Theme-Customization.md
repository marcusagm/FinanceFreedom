# Plan-029 - Personalização e Branding Dinâmico

**Objetivo:** Permitir que o usuário "se sinta em casa" personalizando as cores, modos de visualização e identidade visual da aplicação.

## 1. Arquivos Afetados

-   `apps/web/src/components/providers/ThemeProvider.tsx` (Lógica de temas dinâmicos)
-   `apps/web/src/pages/Settings.tsx` (Interface de personalização)
-   `apps/api/src/modules/settings/...` (Persistência no perfil)

## 2. Passo a Passo

### A. Sistema de Accent Colors

-   [ ] **CSS Variables:** Mapear a cor `--primary` para uma variável HSL controlada por JS/Context.
-   [ ] **Theme Engine:** Implementar lógica para aplicar presets (ex: "Safe Haven" - Emerald, "Royal Finance" - Purple, "Midnight" - Deep Blue).

### B. Interface de Customização (Personalização)

-   [ ] **Color Picker/Presets:** Adicionar galeria de cores de destaque na página de Configurações.
-   [ ] **Modos de Cartões:** Opção para bordas mais arredondadas ou quadradas, sombras sutis ou modo flat.
-   [ ] **Privacidade Visual:** Configuração para definir se o "Privacy Mode" inicia ativado por padrão.

### C. Persistência de Branding

-   [ ] **User Profile:** Salvar as preferências de estilo no banco de dados para que o branding seja aplicado imediatamente após o login em qualquer dispositivo.

## 3. Critérios de Aceite

-   [ ] Usuário altera a "Accent Color" e toda a UI (botões, links, bordas) reflete a escolha instantaneamente.
-   [ ] As preferências de estilo persistem entre sessões.
-   [ ] O sistema suporta combinações de Dark Mode + Cores de Destaque sem perda de acessibilidade.
