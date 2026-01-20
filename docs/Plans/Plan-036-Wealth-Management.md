# Plano de Implementação: Wealth Management & Purchasing Power

**ID:** Plan-036
**Feature:** Wealth Management (Patrimônio)
**Status:** 🔴 Planejado

## 1. Objetivo

Expandir o escopo do sistema de "Controle de Gastos" para "Gestão de Ativos". Permitir o cadastro detalhado de investimentos (Ações, RF, Crypto, Imóveis), calcular a alocação de carteira e ajustar valores pela inflação (Poder de Compra Real).

## 2. Arquivos Afetados

- `apps/api/prisma/schema.prisma`
- `apps/api/src/modules/wealth/*` (Novo Módulo)
- `apps/api/src/modules/inflation/*` (Novo Módulo)

## 3. Passo a Passo de Implementação

### 3.1. Schema

- [ ] Atualizar `schema.prisma`:
    - [ ] **InvestmentAccount** (upgrade): assetClass (Enum), targetPercent (Decimal), expectedReturn (Decimal).
    - [ ] **InflationIndex:** name, value, date.

### 3.2. Inflation Service (Poder de Compra)

- [ ] Implementar integração com API do Banco Central (SGS) para buscar histórico do IPCA.
- [ ] Criar utilitário `calculateRealValue(nominalValue, fromDate, toDate)`.

### 3.3. Wealth Service (Alocação)

- [ ] Método `getPortfolioDistribution(userId)`: Agrupar saldos por Classe de Ativo.
- [ ] Método `getRebalancingPlan(userId)`: Comparar Atual vs Meta (%) e sugerir onde aportar.

### 3.4. Interfaces de Riqueza

- [ ] **Wealth Dashboard:** Gráfico de Pizza (Atuais) vs Gráfico de Pizza (Meta).
- [ ] **Calculadora de Inflação:** Widget onde o usuário digita "Ano 2020, R$ 100" e vê quanto vale hoje.
- [ ] **Indicadores Reais:** Nas telas de metas, exibir "Valor Real (IPCA)" ao lado do valor nominal acumulado.

### 3.5. Qualidade e Internacionalização

- [ ] **Testes:**
    - [ ] Unitários `InflationService`: Mock do Banco Central. Testar cálculo de valor real (fórmulas).
    - [ ] Unitários `WealthService`: Testar lógica de rebalanceamento (matemática).
    - [ ] Componentes: Gráficos de Pizza (Recharts) renderizando corretamente com dados mockados.
- [ ] **i18n:**
    - [ ] Nomes de Classes de Ativos: "Fixed Income", "Stocks", "Real Estate".
    - [ ] Labels: "Inflation Adjusted", "Purchasing Power", "Portfolio Distribution".

- [ ] **Rebalanceamento:** Se tenho 50% Ações e meta é 40%, o sistema deve sugerir aporte em Renda Fixa.
- [ ] **Inflação:** R$ 100,00 de Jan/2000 deve valer muito mais que R$ 100,00 hoje. A API do BC deve ser consultada corretamente.
- [ ] **QA:** Testes unitários de matemática financeira cobrindo edge cases.
- [ ] **i18n:** Gráficos e legendas totalmente traduzidos.

## 5. Referências

- [Wealth-management-asset-growth.md](../New%20features/Wealth-management-asset-growth.md)
- [Real-purchasing-power-calculator.md](../New%20features/Real-purchasing-power-calculator.md)
