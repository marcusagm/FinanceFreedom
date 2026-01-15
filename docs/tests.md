# Relatório de Cobertura de Testes

Listagem de arquivos identificados sem cobertura de testes ou com cobertura zero (0%).

## Backend (`apps/api`)

### Core & Config

-   [ ] `src/app.module.ts`
-   [ ] `src/main.ts`
-   [ ] `src/config/mail.config.ts`

### Modules (Controllers, Services & Modules)

**Account**

-   [ ] `src/modules/account/account.module.ts`

**Analytics**

-   [ ] `src/modules/analytics/analytics.controller.ts`
-   [ ] `src/modules/analytics/analytics.module.ts`
-   [ ] `src/modules/analytics/budget.service.ts`

**Auth**

-   [ ] `src/modules/auth/auth.controller.ts`
-   [ ] `src/modules/auth/auth.module.ts`
-   [ ] `src/modules/auth/guards/jwt-auth.guard.ts`
-   [ ] `src/modules/auth/guards/local-auth.guard.ts`
-   [ ] `src/modules/auth/strategies/jwt.strategy.ts`
-   [ ] `src/modules/auth/strategies/local.strategy.ts`

**Category**

-   [ ] `src/modules/category/category.controller.ts`
-   [ ] `src/modules/category/category.module.ts`
-   [ ] `src/modules/category/category.service.ts`

**Dashboard**

-   [ ] `src/modules/dashboard/dashboard.controller.ts`
-   [ ] `src/modules/dashboard/dashboard.module.ts`

**Debt**

-   [ ] `src/modules/debt/debt.controller.ts`
-   [ ] `src/modules/debt/debt.module.ts`

**Fixed Expense**

-   [ ] `src/modules/fixed-expense/fixed-expense.controller.ts`
-   [ ] `src/modules/fixed-expense/fixed-expense.module.ts`

**Import**

-   [ ] `src/modules/import/import.module.ts`
-   [ ] `src/modules/import/import.processor.ts`

**Income**

-   [ ] `src/modules/income/income.module.ts`

**Investment**

-   [ ] `src/modules/investment-account/investment-account.module.ts`

**Mail**

-   [ ] `src/modules/mail/mail.module.ts`

**Savings Goal**

-   [ ] `src/modules/savings-goal/savings-goal.module.ts`

**Simulator**

-   [ ] `src/modules/simulator/simulator.controller.ts`
-   [ ] `src/modules/simulator/simulator.module.ts`

**System Config**

-   [ ] `src/modules/system-config/system-config.controller.ts`
-   [ ] `src/modules/system-config/system-config.module.ts`

**Transaction**

-   [ ] `src/modules/transaction/transaction.module.ts`

---

## Frontend (`apps/web`)

### Widgets & Dialogs

-   [ ] `src/components/dashboard/ExpenseSummaryWidget.tsx`
-   [ ] `src/components/dashboard/HealthScoreWidget.tsx`
-   [ ] `src/components/dashboard/IncomeSummaryWidget.tsx`
-   [ ] `src/components/dashboard/UpcomingInstallmentsWidget.tsx`
-   [ ] `src/components/dashboard/WealthWidget.tsx`
-   [ ] `src/components/fixed-expense/DeleteFixedExpenseDialog.tsx`
-   [ ] `src/components/import/SyncTransactionsDialog.tsx`
-   [ ] `src/components/investment/DeleteInvestmentDialog.tsx`
-   [ ] `src/components/savings-goal/DeleteGoalDialog.tsx`
-   [ ] `src/components/common/QuickActionFAB.tsx`

### UI Primitives (Shadcn/UI)

> Componentes de UI muitas vezes não requerem testes unitários complexos se apenas renderizam estilos, mas é boa prática ter testes de snapshot ou renderização básica.

-   [ ] `src/components/ui/Calendar.tsx`
-   [ ] `src/components/ui/DatePicker.tsx`
-   [ ] `src/components/ui/Label.tsx`
-   [ ] `src/components/ui/Popover.tsx`
-   [ ] `src/components/ui/Progress.tsx`
-   [ ] `src/components/ui/Sheet.tsx`
-   [ ] `src/components/ui/Sonner.tsx`

### Pages

-   [ ] `src/pages/InvestmentAccounts.tsx`
-   [ ] `src/pages/SavingsGoals.tsx`
-   [ ] `src/main.tsx`

### Services & Libs

> Muitos serviços no frontend são testados indiretamente através dos componentes que os consomem, mas testes unitários diretos aumentam a robustez.

-   [ ] `src/services/*.service.ts` (Validar cobertura de serviços sem mocks nos testes de componentes)
-   [ ] `src/lib/api.ts`
-   [ ] `src/lib/notification.ts`
-   [ ] `src/lib/utils.ts`
-   [ ] `src/utils/format.ts`
-   [ ] `src/hooks/useHourlyRate.ts`
