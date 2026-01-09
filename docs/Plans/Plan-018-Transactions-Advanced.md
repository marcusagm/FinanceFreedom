# Plan-018 - Transações Avançadas (Split e Recorrência)

**Objetivo:** Implementar funcionalidades avançadas de edição de transações.

## 1. Arquivos Afetados

-   `apps/web/src/components/transactions/SplitTransactionDialog.tsx` (Novo)
-   `apps/web/src/components/transactions/TransactionList.tsx`
-   `apps/web/src/components/transactions/NewTransactionDialog.tsx`

## 2. Passo a Passo

### A. Split de Transação

-   [ ] **Criar `SplitTransactionDialog`:**
    -   Interface para dividir o valor total em N partes.
    -   Validação: Soma das partes deve ser igual ao total original.
-   [ ] **Ação na Lista:**
    -   Adicionar botão "Dividir" no menu de ações de cada transação.
    -   Ao confirmar split, o sistema deve (logicamente):
        -   Criar N novas transações com os valores parciais.
        -   Excluir/Arquivar a transação original.

### B. Recorrência

-   [ ] **Interface de Criação:**
    -   No `NewTransactionDialog`, adicionar checkbox "Repetir mensalmente".
    -   Input: Número de vezes (ex: 12) ou Indeterminado (fixo).
-   [ ] **Lógica de Geração:**
    -   Se "Repetir" marcado, o backend deve gerar as transações futuras com datas incrementadas (Data + 1 mês).
    -   (MVP: Gerar registros reais no banco. Futuro: Gerar regra de recorrência).

## 3. Critérios de Aceite

-   [ ] Dividir uma transação de R$ 100 em duas de R$ 50.
-   [ ] Criar uma despesa "Netflix" repetindo 12x e ver 12 lançamentos futuros criados.
