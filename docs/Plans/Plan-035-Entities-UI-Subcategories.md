# Plano de Implementação: Entities UI - Subcategories & Budgets

**ID:** Plan-035
**Feature:** Core UI Adoption (Categories)
**Status:** 🔴 Planejado

## 1. Objetivo

Atualizar a interface de categorias para suportar a hierarquia (Subcategorias) definida no Plan-031 e implementar a nova gestão de orçamentos históricos.

## 2. Arquivos Afetados

- `apps/web/src/pages/Categories.tsx`
- `apps/web/src/components/Categories/*`
- `apps/web/src/components/TransactionForm.tsx`

## 3. Passo a Passo de Implementação

### 3.1. Árvore de Categorias

- [ ] Refatorar lista de categorias para usar `Accordion` ou `Tree View`.
- [ ] Subcategorias aparecem indentadas dentro da categoria pai.

### 3.2. Seletor de Categoria

- [ ] Atualizar `CategorySelect` em `TransactionForm`:
    - [ ] Permitir selecionar subcategorias.
    - [ ] Visualização agrupada (Ex: "Transporte > Uber").

### 3.3. Gestão de Orçamento (Budget)

- [ ] Nova aba em Planejamento > Orçamentos.
- [ ] Tabela editável para definir limite mensal por categoria.
- [ ] Salvar em `BudgetHistory` (Mês/Ano).

### 3.4. Qualidade e Internacionalização

- [ ] **Testes:**
    - [ ] Testar renderização da árvore.
    - [ ] Garantir que o orçamento de um mês não sobrescreve o histórico do mês anterior.
- [ ] **i18n:**
    - [ ] "Subcategory", "Budget Limit", "Parent Category".

## 4. Critérios de Verificação

- [ ] Criar "Alimentação" > "iFood".
- [ ] Criar transação em "iFood".
- [ ] Definir orçamento de R$ 500 para "Alimentação".

## 5. Referências

- [Plan-031-Core-Evolution.md](./Plan-031-Core-Evolution.md)
