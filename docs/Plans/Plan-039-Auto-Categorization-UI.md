# Plano de Implementação: Auto Categorization - User Interface

**ID:** Plan-039
**Feature:** Auto Categorization (Frontend)
**Status:** 🔴 Planejado

## 1. Objetivo

Fornecer interfaces para que o usuário gerencie suas regras de categorização e criar um fluxo de feedback rápido ao editar uma transação.

## 2. Arquivos Afetados

- `apps/web/src/components/Category/Rules.tsx`
- `apps/web/src/components/Transactions/TransactionEditHistory.tsx` (ou similar)

## 3. Passo a Passo de Implementação

### 3.1. Gestão de Regras

- [ ] Tela em Configurações para listar, criar, editar e excluir `CategoryRules`.
- [ ] Tabela simples: Palavra-chave | Categoria | Ações.

### 3.2. Feedback Loop (Inteligente)

- [ ] Ao editar a categoria de uma transação existente:
    - [ ] Exibir Toast/Snackbar com botão "Criar Regra para 'XYZ'?".
    - [ ] Ao clicar, abrir modal pré-preenchido.

### 3.3. Qualidade e Internacionalização

- [ ] **Testes:**
    - [ ] Testar criação de regra via CategoryRules.
    - [ ] Testar fluxo de feedback via Toast.
- [ ] **i18n:**
    - [ ] "Create Rule", "Keyword", "If description contains...", "Auto-assign to".

## 4. Critérios de Verificação

- [ ] Alterar categoria de "Uber" para "Viagem". Clicar em "Criar Regra" no toast. Verificar se a regra apareceu em CategoryRules.

## 5. Referências

- [Plan-038-Auto-Categorization-Engine.md](./Plan-038-Auto-Categorization-Engine.md)
