# Plano de Implementação: Inflation Engine

**ID:** Plan-044
**Feature:** Wealth (Inflation)
**Status:** 🔴 Planejado

## 1. Objetivo

Criar o serviço responsável por buscar índices econômicos (IPCA, IGP-M) e calcular a correção monetária de valores ao longo do tempo.

## 2. Arquivos Afetados

- `apps/api/prisma/schema.prisma`
- `apps/api/src/modules/inflation/*` (Novo Módulo)

## 3. Passo a Passo de Implementação

### 3.1. Schema

- [ ] Atualizar `schema.prisma`:
    - [ ] `InflationIndex`: id, name (IPCA), date (01/2024), value (0.56).

### 3.2. InflationService

- [ ] **Data Fetching:** Integração com API do Banco Central (SGS) ou IBGE.
- [ ] **Caching:** Salvar no banco para evitar requests repetidos.
- [ ] **Calculation:** `calcRealValue(amount, fromDate, toDate)`.

### 3.3. Qualidade e Internacionalização

- [ ] **Testes:**
    - [ ] Unitário: Mock da API externa. Validar fórmula de juros compostos/acumulados.
- [ ] **i18n:** n/a (backend).

## 4. Critérios de Verificação

- [ ] Chamar `calcRealValue(100, '2020-01-01', '2024-01-01')`. Deve retornar valor > 100 (aprox 125-130).

## 5. Referências

- [Real-purchasing-power-calculator.md](../New%20features/Real-purchasing-power-calculator.md)
