# Plan-030 - Internacionalização & Localização Completa (i18n)

**Objetivo:** Implementar suporte multi-idioma total, incluindo tradução de textos, formatos de data, moedas e fusos horários.

**Feature Relacionada:** [Core Foundation], [Quality]

## 1. Arquivos Afetados

-   `apps/web/src/i18n.ts` (Novo - Configuração `react-i18next`)
-   `apps/web/public/locales/{en,pt-br}/translation.json` (Traduções)
-   `apps/web/src/lib/utils.ts` (Formatadores de Moeda/Data)
-   `apps/web/src/main.tsx` (Init i18n)
-   `apps/web/src/pages/Settings.tsx`

## 2. Passo a Passo

### A. Setup e Estrutura

-   [ ] **Instalação:** Adicionar `i18next` e `react-i18next`.
-   [ ] **Configuração:** Detectar idioma do navegador ou carregar do `SystemConfig`.
-   [ ] **Dicionários:** Extrair todas as strings hardcoded das páginas existentes (Dashboard, Accounts, Debts) para arquivos JSON.

### B. Localização de Dados (L10n)

-   [ ] **Moedas:** Implementar suporte dinâmico para `BRL`, `USD`, `EUR` usando `Intl.NumberFormat`. O símbolo deve mudar conforme a preferência do usuário.
-   [ ] **Datas:** Usar `date-fns` com locales dinâmicos para formatos `DD/MM/YYYY` vs `MM/DD/YYYY`.

### C. Backend & Sincronização

-   [ ] **API:** Garantir que erros do backend e mensagens de validação também suportem tradução (se aplicável).
-   [ ] **Configuração do Usuário:** Campo `language` na tabela de perfil ou `SystemConfig`.

## 3. Critérios de Aceite

-   [ ] Trocar o idioma para Português em Settings e ver todos os textos, placeholders e toasts mudarem.
-   [ ] Alterar a moeda para USD e ver os valores formatados como `$ 1,000.00`.
-   [ ] O sistema deve carregar o idioma salvo automaticamente no próximo acesso.
