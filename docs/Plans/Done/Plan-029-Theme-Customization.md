# Plan-029 - Personalização e Branding Dinâmico

**Objetivo:** Permitir que o usuário "se sinta em casa" personalizando as cores, modos de visualização e identidade visual da aplicação.

## 1. Arquivos Afetados

-   `apps/web/src/components/providers/ThemeProvider.tsx` (Lógica de temas dinâmicos)
-   `apps/web/src/pages/Settings.tsx` (Interface de personalização)
-   `apps/api/src/modules/settings/...` (Persistência no perfil)

## 2. Passo a Passo

### A. Sistema de Accent Colors

-   [x] **CSS Variables:** Mapear a cor `--primary` para uma variável HSL controlada por JS/Context, tanto para o modo light quanto para o modo dark.
-   [x] **Theme Engine:** Implementar lógica para aplicar presets (ex: "Safe Haven" - Emerald, "Royal Finance" - Purple, "Midnight" - Deep Blue).
    -   Ter pastas de estilos para cada preset.
    -   Ter um arquivo de configuração para cada preset.
    -   Theme Engine deve ser capaz de aplicar os presets de forma dinâmica, subscrevendo o arquivo theme.css atual.

### B. Interface de Customização (Personalização)

-   [x] **Color Picker/Presets:** Adicionar galeria de cores de destaque na página de Configurações.
-   [x] **Modos de Cartões:** Opção para bordas mais arredondadas ou quadradas, sombras sutis ou modo flat.
-   [x] **Privacidade Visual:** Configuração para definir se o "Privacy Mode" inicia ativado por padrão.

### C. Persistência de Branding

-   [x] **User Profile:** Salvar as preferências de estilo no banco de dados para que o branding seja aplicado imediatamente após o login em qualquer dispositivo.

## 3. Critérios de Aceite

-   [x] Usuário altera a "Accent Color" e toda a UI (botões, links, bordas) reflete a escolha instantaneamente.
-   [x] As preferências de estilo persistem entre sessões.
-   [x] O sistema suporta combinações de Light/Dark Mode + Cores de Destaque sem perda de acessibilidade.

## 4. Implementações Adicionais & Detalhes Técnicos

### Refatoração do Registro de Temas

Implementamos uma arquitetura modular para os temas, permitindo a adição de novos presets sem alterar o código principal.

-   **Estrutura:** `src/registry/themes/*.ts` - Cada tema é um arquivo isolado.
-   **Dynamic Import:** Utilizamos `import.meta.glob` em `themes.ts` para carregar automaticamente qualquer arquivo adicionado a esta pasta.
-   **Types:** Definição de tipos em `types.ts` para evitar dependências circulares.

### Integração com Autenticação e Segurança

-   **Public Pages:** Páginas públicas (Login, Registro) forçam o tema padrão ("Zinc") para manter a consistência da marca antes do login.
-   **User Preferences:** As configurações de tema e privacidade do usuário só são carregadas e aplicadas após a autenticação bem-sucedida.

### Componentes e UI

-   **Componente Switch:** Adicionado `@radix-ui/react-switch` para o controle de privacidade.
-   **Correções de Layout:** Resolvidos problemas de scroll global e posicionamento absoluto de elementos de acessibilidade na página de configurações.
-   **Sincronização de Privacidade:** Correção da lógica de estado para garantir que o modo de privacidade visual respeite a configuração padrão do usuário ao iniciar a sessão.
