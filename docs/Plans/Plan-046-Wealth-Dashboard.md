# Plano de Implementação: Wealth Dashboard

**ID:** Plan-046
**Feature:** Wealth (UI)
**Status:** 🔴 Planejado

## 1. Objetivo

Visualizar a distribuição patrimonial e indicadores de inflação.

## 2. Arquivos Afetados

- `apps/web/src/pages/Wealth/*`
- `apps/web/src/components/Wealth/*`

## 3. Passo a Passo de Implementação

### 3.1. Dashboard

- [ ] Gráfico de Pizza (Atuais vs Metas).
- [ ] Cards de sugestão de Rebalanceamento ("Aporte R$ 500 em Renda Fixa").
- [ ] Indicador de "Poder de Compra Real" (usando dados do Plan-044).

### 3.2. Qualidade e Internacionalização

- [ ] **Testes:**
    - [ ] Renderização dos gráficos (Recharts).
- [ ] **i18n:**
    - [ ] "Portfolio Allocation", "Rebalancing Suggestion", "Inflation Impact".

## 4. Critérios de Verificação

- [ ] Navegar para /wealth. Verificar se os gráficos batem com os dados do banco.

## 5. Referências

- [Plan-045-Wealth-Management-Core.md](./Plan-045-Wealth-Management-Core.md)
