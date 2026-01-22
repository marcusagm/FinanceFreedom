# Plano de Implementação: Transaction Batch Operations

**ID:** Plan-036
**Feature:** Batch Operations (UI)
**Status:** 🔴 Planejado

## 1. Objetivo

Permitir que o usuário realize ações em massa na lista de transações, resolvendo a fricção de editar categorizações manuais uma a uma.

## 2. Arquivos Afetados

- `apps/web/src/pages/Transactions.tsx`
- `apps/web/src/components/TransactionList.tsx`
- `apps/web/src/components/NewTransactionDialog.tsx`
- `apps/api/src/modules/transaction/transaction.controller.ts`

## 3. Passo a Passo de Implementação

### 3.1. Backend (Batch Endpoint)

- [ ] Criar rota `PATCH /transactions/batch`:
    - [ ] Body: `{ ids: string[], action: 'UPDATE|DELETE', payload?: { categoryId?, ... } }`.
    - [ ] Executar em transação do banco.

### 3.2. Frontend (Selection Mode)

- [ ] Adicionar campo de status em `NewTransactionDialog.tsx` (PENDING, CONFIRMED, CONSOLIDATED).
- [ ] Adicionar coluna de status em `TransactionList`.
- [ ] Garantir que o nome das categorias seja exibido corretamente em `TransactionList`, isto é, nome vindo da tabela de categorias, garantindo que quando o nome for atualizado, apareça corretamente em `TransactionList`.
- [ ] Remover campo `category` da tabela `Transaction`.
- [ ] Adicionar Checkbox em cada linha da `TransactionList`.
- [ ] Header Checkbox para "Selecionar Tudo" (da página atual).
- [ ] **Floating Action Bar:** Habilita quando `selected.length > 0`.
    - [ ] Botões: "Alterar Categoria", "Marcar Consolidado", "Excluir".

### 3.3. Qualidade e Internacionalização

- [ ] **Testes:**
    - [ ] Backend: Testar update em massa garantindo que todos updates ocorram ou rollback.
    - [ ] Frontend: Testar seleção múltipla e persistência do estado ao paginar (ou limpar seleção).
- [ ] **i18n:**
    - [ ] "Selected {{count}} items", "Bulk Edit", "Delete selected".

## 4. Critérios de Verificação

- [ ] Selecionar 5 transações. Clicar em Categorizar. Escolher "Casa". Todas devem mudar para "Casa".

## 5. Referências

- [Others.md](../New%20features/Others.md)
