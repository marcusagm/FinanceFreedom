# Plano de Implementação: Behavioral Engine

**ID:** Plan-049
**Feature:** Assistant (Backend)
**Status:** 🔴 Planejado

## 1. Objetivo

Motor de análise de padrões para gerar insights proativos.

## 2. Arquivos Afetados

- `apps/api/src/modules/assistant/*` (Novo Módulo)

## 3. Passo a Passo de Implementação

### 3.1. Analyzers

- [ ] **VampireSpendAnalyzer:** Busca transações recorrentes que subiram valor > inflação.
- [ ] **OpportunityAnalyzer:** Compara saldo parado vs dívida ativa (Juros).

### 3.2. Integration

- [ ] Rodar via Cron (Plan-040).
- [ ] Salvar resultados em `AssistantInsight` (tabela Schema do Plan-041/Notifications ou dedicada).

### 3.3. Qualidade e Internacionalização

- [ ] Logar detecções.
- [ ] Gerar chaves i18n para os insights (`insight.vampire.title`).

## 4. Critérios de Verificação

- [ ] Mock transactions. Rodar analyzer. Verificar se Insight foi criado no banco.

## 5. Referências

- [Behavioral-intelligence.md](../New%20features/Behavioral-intelligence.md)
