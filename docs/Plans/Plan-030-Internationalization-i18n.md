# Plan-030 - Internacionalização & Localização Completa (i18n)

**Objetivo:** Implementar suporte multi-idioma total, incluindo tradução de textos, formatos de data, moedas e fusos horários.

**Feature Relacionada:** [Core Foundation], [Quality]

## 1. Arquivos Afetados

- `apps/web/src/i18n.ts` (Novo - Configuração `react-i18next`)
- `apps/web/public/locales/{en,pt-br}/translation.json` (Traduções)
- `apps/web/src/lib/utils.ts` (Formatadores de Moeda/Data)
- `apps/web/src/main.tsx` (Init i18n)
- `apps/web/src/pages/Settings.tsx`
- Componentes e páginas diversos para substituição de strings.

## 2. Passo a Passo

### A. Setup e Estrutura

- [x] **Instalação:** Adicionar `i18next` e `react-i18next`.
- [x] **Configuração:** Detectar idioma do navegador (`i18n.ts` já implementado com `i18next-browser-languagedetector` e Backend).
- [x] **Configuração Extra:** Adicionado idioma `pt` como suportado para evitar warnings.

### B. Tradução e Adaptação (Em Andamento)

- [x] **Dicionários Base:** Arquivos `translation.json` criados para `pt-br` e `en`.
- [x] **Páginas Já Migradas:**
    - [x] Dashboard (Parcial/Maioria)
    - [x] Transactions (Lista, Filtros, Nova Transação, Split)
    - [x] Debts (Lista, Dialogs, Estratégias)
    - [x] Income (Fontes, Unidades de Trabalho, Calendário)
    - [x] Savings Goals
    - [x] Fixed Expenses
    - [x] ImapConfigPage & ImapConfigForm
    - [x] Auth Pages (Login, Register, Forgot/Reset Password)
    - [x] `ImportPage.tsx`
    - [x] `Settings.tsx`
    - [x] `InvestmentAccounts.tsx`
    - [x] `Profile.tsx`
    - [x] `Accounts.tsx`
    - [x] `Categories.tsx`

### C. Localização de Dados (L10n)

- [x] **Datas:**
    - [x] Implementado `DatePicker` customizado com suporte a input manual (PatternFormat) e seleção por calendário via `date-fns` com locale dinâmico.
- [x] **Moedas:** Implementar suporte dinâmico (Hoje é fixo via `translation.json` keys como `currencyPlaceholder`, precisa evoluir para formatação real via `Intl`).
    - [x] Implementar suporte dinâmico para várias moedas padrão, como `BRL`, `USD`, `EUR`, (gerar lista de moedas mundiais completa) usando `Intl.NumberFormat`. O símbolo deve mudar conforme a preferência do usuário.
- [x] **Configuração de localização** Adicionar compos de moeda, formato de data e formatação de moeda. Na tela de `Settings`, deve ter opção de selecionar a moeda e o formato de data.
- [x] **Atualização de telas:** Atualizar todas as telas para ter suporte ao L10N (Account, Categories, Dashboard, Debts, FixedExpenses, ForgotPassword, ImapConfigPage, ImportPage, IncomeProjection, Login, Profile, Register, ResetPassword, SavingGoals, Settings e Transactions).
    - [x] `Settings.tsx` (Moeda/Data)
    - [x] `Dashboard` (BalanceChart, Widgets: ActionCard, RecentTransactions, UpcomingInstallments, BudgetWidget)
    - [x] Transações (`TransactionList`, `SplitTransactionDialog`)
    - [x] Dívidas (`InstallmentsModal`, `StrategyComparison`)
    - [x] Investimentos (`InvestmentAccountCard`)
    - [x] Metas (`SavingsGoalCard`)
    - [x] Importação (`ImportReviewTable`)
- [x] **Atualização de componentes:** Atualizar todos os componentes para ter suporte ao L10N (DatePicker, Input, Select, etc).

### E. API Internacionalization (Backend)

- [x] **Setup Inicial:**
    - [x] Instalado `nestjs-i18n`.
    - [x] Configurado `I18nModule` no `AppModule` com `AcceptLanguageResolver`.
    - [x] Configurado `nest-cli.json` para copiar assets `i18n`.
- [x] **Modules:**
    - [x] `Dashboard`: Serviço e Controller refatorados para aceitar `lang` e traduzir recomendações e avisos ("ActionRecommendations").
    - [x] `Web Interceptor`: Adicionado interceptor no Axios (`api.ts`) para enviar header `Accept-Language` automaticamente.

### D. Melhorias e Correções Realizadas (Adicional)

- [x] **Correções de Testes:**
    - [x] `ImapConfigForm.test.tsx` corrigido (Mock de i18n, setup de ambiente JSDOM).
    - [x] `ImapConfigPage.test.tsx` e `ImapConfigList.test.tsx` atualizados.
    - [x] Adicionado `@vitest-environment jsdom` e helpers necessários.
- [x] **Correções de Bugs UI:**
    - [x] `DatePicker`: Funcionalidade de digitar data restaurada.
    - [x] `ImapConfigForm`: Corrigido erro `ReferenceError: useTranslation is not defined`.
- [x] **Sanitização de Console:**
    - [x] Adicionadas chaves de validação faltantes (`dateRequired`, `accountRequired`) para limpar warnings no console.

### E. Validação e Teste (Via Browser Agent)

- [x] **Verificação de Idioma:**
    - [x] Login inicial em Português confirmado.
    - [x] Troca para Inglês (US) altera sidebar, headers e labels.
    - [x] Reversão para Português bem sucedida.
- [x] **Verificação de Moeda:**
    - [x] Alteração para USD reflete prefixo `$` em Dashboard e Transações.
    - [x] Reversão para BRL restaura prefixo `R$`.
- [x] **Verificação de Data:**
    - [x] Alteração para formato `yyyy-MM-dd` aplicada com sucesso em inputs de data (Nova Transação).

## 3. Critérios de Aceite

- [x] Trocar o idioma para Português em Settings e ver todos os textos, placeholders e toasts mudarem.
- [x] Alterar a moeda para USD e ver os valores formatados como `$ 1,000.00`.
- [x] O sistema deve carregar o idioma salvo automaticamente no próximo acesso (via detector de navegador/cookie).

## 4. Próximos Passos Imediatos

1.  Verificar fluxo completo de cadastro em diferentes idiomas.
2.  Validar formatação de moeda em `IncomeProjection` e tabelas de transação.
3.  Expandir i18n para mensagens de erro da API (ValidationPipes).
