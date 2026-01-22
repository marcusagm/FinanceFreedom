# Plano de Implementação: Multi-Currency UI Integration

**ID:** Plan-037
**Feature:** Core UI Adoption (Multi-currency)
**Status:** 🔴 Planejado

## 1. Objetivo

Integrar o suporte a múltiplas moedas (Backend implementado no Plan-031) na interface do usuário, exibindo conversões e indicadores de moeda original.

## 2. Arquivos Afetados

- `apps/web/src/components/Account/*`
- `apps/web/src/components/Investment/*`
- `apps/web/src/components/Income/*`
- `apps/web/src/components/Simulators/*`
- `apps/web/src/components/Dashboard/*`
- `apps/web/src/components/Transaction/*`
- `apps/web/src/components/ui/MoneyDisplay.tsx`
- `apps/web/src/components/ui/Input.tsx`
- `apps/web/src/pages/Settings.tsx`
- `apps/web/src/utils/formatters.ts`

## 3. Passo a Passo de Implementação

### 3.1. Formatadores

- [ ] Atualizar `formatCurrency(value, currency)` para suportar qualquer ISO Code (não só BRL).
- [ ] Adicionar na Página `Settings` a opção de formatação de moeda base (separador decimal (vírgula/ponto).
- [ ] Atualizar MoneyDisplay.tsx para suportar moedas externas e a formatação baseada no locale do usuário.
- [ ] Atualizar Input.tsx para suportar moedas externas e a formatação baseada no locale do usuário.

### 3.2. Dashboard Unificado

- [ ] Os widgets de saldo total devem somar os valores _convertidos_ (usando a cotação do dia ou cacheada).
- [ ] Tooltip: "Valor aproximado em BRL. Original: $ 100 USD".

### 3.3. Lista de Transações

- [ ] Se `originalCurrency` != `userBaseCurrency`:
    - [ ] Exibir valor convertido em destaque.
    - [ ] Exibir valor original menor abaixo (ex: "$ 20.00").
    - [ ] Ícone de bandeira ou ISO code.

### 3.4. Qualidade e Internacionalização

- [ ] **Testes:**
    - [ ] Testar função de formatação com 'USD', 'EUR', 'JPY'.
    - [ ] Verificar renderização visual.
- [ ] **i18n:**
    - [ ] Garantir que o separador decimal (vírgula/ponto) respeite o locale do usuário, independente da moeda.

## 4. Critérios de Verificação

- [ ] Visualizar conta em Dólar. O saldo total do dashboard deve refletir a conversão para Reais.
- [ ] Transação em Euro exibe "€" na lista.

## 5. Referências

- [Plan-031-Core-Evolution.md](./Plan-031-Core-Evolution.md)
