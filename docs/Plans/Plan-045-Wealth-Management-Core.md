# Plano de Implementação: Wealth Management - Core Logic

**ID:** Plan-045
**Feature:** Wealth (Logic)
**Status:** 🔴 Planejado

## 1. Objetivo

Implementar a lógica de alocação de ativos e rebalanceamento de carteira.

## 2. Arquivos Afetados

- `apps/api/prisma/schema.prisma`
- `apps/api/src/modules/wealth/*` (Novo Módulo)

## 3. Passo a Passo de Implementação

### 3.1. Schema

- [ ] Atualizar `InvestmentAccount`:
    - [ ] `assetClass`: Enum (FIXED_INCOME, STOCKS, REAL_ESTATE, CRYPTO, CASH, OTHER).
    - [ ] `targetPercent`: Decimal (0-100).

### 3.2. WealthService

- [ ] **Portfolio Analysis:** Agrupar saldo total por `assetClass`.
- [ ] **Rebalancing Logic:**
    - [ ] Comparar `Current %` vs `Target %`.
    - [ ] Gerar ação: "Buy X amount of Stocks" ou "Sell Y amount of Crypto".

### 3.3. Qualidade e Internacionalização

- [ ] **Testes:**
    - [ ] Cenário: Target 50/50. Atual 60/40. Sugestão deve ser aportar no 40.

## 4. Critérios de Verificação

- [ ] Criar conta "Ações" (Class: STOCKS, Target: 50%). Criar conta "CDB" (Class: FIXED, Target: 50%).
- [ ] Add saldo 1000 em Ações. Serviço deve sugerir aportar 1000 em CDB.

## 5. Referências

- [Wealth-management-asset-growth.md](../New%20features/Wealth-management-asset-growth.md)
