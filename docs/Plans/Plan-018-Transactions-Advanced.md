# Plan-018 - Transações Avançadas (Split e Recorrência)

**Objetivo:** Implementar funcionalidades avançadas de edição de transações.

## 1. Arquivos Afetados

### Frontend

-   `apps/web/src/components/transactions/SplitTransactionDialog.tsx` (Novo)
-   `apps/web/src/components/transactions/TransactionList.tsx`
-   `apps/web/src/components/transactions/NewTransactionDialog.tsx`
-   `apps/web/src/pages/Transactions.tsx` (Atualizado para refresh)

### Backend

-   `apps/api/src/modules/transaction/transaction.service.ts` (Lógica de Recorrência e Split)
-   `apps/api/src/modules/transaction/transaction.controller.ts` (Endpoint Split)
-   `apps/api/src/modules/transaction/dto/create-transaction.dto.ts` (Campos de Recorrência)
-   `apps/api/src/modules/transaction/dto/split-transaction.dto.ts` (Novo DTO)

## 2. Passo a Passo Implementado

### A. Split de Transação

-   [x] **Criar `SplitTransactionDialog`:**
    -   Interface para dividir o valor total em N partes.
    -   Validação: Soma das partes deve ser igual ao total original.
    -   _Melhoria_: Uso de `sonner` para feedback visual (Toasts).
-   [x] **Ação na Lista:**
    -   Adicionado botão "Dividir" no menu de ações.
-   [x] **Backend (API):**
    -   Endpoint `POST /transactions/:id/split`.
    -   Lógica transacional: Cria N novas, deleta original.

### B. Recorrência

-   [x] **Interface de Criação:**
    -   Checkbox "Repetir mensalmente" e Input "Número de vezes" no `NewTransactionDialog`.
-   [x] **Lógica de Geração (Backend):**
    -   Loop de geração no `TransactionService.create`.
    -   _Melhoria_: Uso de `date-fns/addMonths` para garantir cálculo exato de datas (evitando bugs de fim de mês).

## 3. Qualidade e Testes

### Cobertura de Testes (Implementada)

-   [x] **Backend Unit Tests (`transaction.split.spec.ts`):**
    -   Verificação da criação de múltiplas transações (Datas corretas).
    -   Verificação do fluxo de Split (Soma, Deleção, Criação).
-   [x] **Frontend Component Tests:**
    -   `SplitTransactionDialog.test.tsx`: Renderização, Validação e Envio.
    -   `NewTransactionDialog.test.tsx`: Toggle de campos de recorrência.
    -   `TransactionList.test.tsx`: Interação com botão de split.

## 4. Critérios de Aceite

-   [x] Dividir uma transação de R$ 100 em duas de R$ 50.
-   [x] Criar uma despesa "Netflix" repetindo 12x e ver 12 lançamentos futuros criados.
