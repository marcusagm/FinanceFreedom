# Plano de Implementação: Entities UI - Person Management

**ID:** Plan-034
**Feature:** Core UI Adoption (Persons)
**Status:** 🔴 Planejado

## 1. Objetivo

Implementar a interface para gestão (CRUD) de "Pessoas" (Contatos) e permitir vincular transações e dívidas a elas (Empréstimos P2P).

## 2. Arquivos Afetados

- `apps/web/src/pages/Persons/*`
- `apps/web/src/components/Persons/*`
- `apps/web/src/components/TransactionForm.tsx`

## 3. Passo a Passo de Implementação

### 3.1. Gestão de Pessoas

- [ ] Tela CRUD de Pessoas (Nome, Email, Telefone, Avatar).
- [ ] Integração com serviço `PersonService` (criado no Plan-031).

### 3.2. Vínculo em Transações

- [ ] Atualizar `NewTransactionDialog`:
    - [ ] Adicionar campo "Pessoa" (Combobox/Autocomplete).
    - [ ] Se tipo == TRANSFER, rótulo muda para "Beneficiário".
    - [ ] Adicionar checkbox "Empréstimo?" (Se marcado, gera uma Dívida/Credit a receber automática? Definir escopo. Inicialmente apenas vínculo visual).

### 3.3. Qualidade e Internacionalização

- [ ] **Testes:**
    - [ ] Testar validação do formulário de pessoa.
    - [ ] Testar filtro de busca no combobox.
- [ ] **i18n:**
    - [ ] Termos: "Contact", "Beneficiary", "Lent to", "Borrowed from".

## 4. Critérios de Verificação

- [ ] Criar pessoa "João".
- [ ] Criar Despesa de R$ 50 vinculada a "João".
- [ ] No report, filtrar por Pessoa = João (Future improvement, check filters).

## 5. Referências

- [Plan-031-Core-Evolution.md](./Plan-031-Core-Evolution.md) (Schema)
