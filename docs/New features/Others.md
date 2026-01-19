# Relatório de Implementação: Novas Features e Melhorias ("Others")

Este relatório detalha as lacunas entre os requisitos listados e o estado atual da aplicação, propondo um plano técnico para implementação.

## 1. Mapeamento de Pessoas (Nova Feature)

**Estado Atual:**
Não existe entidade `Person` ou `Contact` no sistema. Atualmente, `Transactions`, `Debts` e `Accounts` estão vinculados diretamente ao `User`.

**Necessidades de Implementação:**

- **Schema (Prisma):**
    - Criar modelo `Person` (ou `Contact`):
        ```prisma
        model Person {
          id        String   @id @default(uuid())
          name      String
          email     String?
          phone     String?
          userId    String   // Pertence a um usuário
          createdAt DateTime @default(now())
          updatedAt DateTime @updatedAt
          // Relações
          transactions Transaction[]
          debts        Debt[]
        }
        ```
    - Atualizar modelos `Transaction` e `Debt` para incluir relação opcional `personId`.
    - Para "Conta Conjunta", considerar adicionar `spentByPersonId` na `Transaction` para indicar quem realizou o gasto dentro de uma conta compartilhada.

- **Funcionalidades:**
    - **Transferência para Pessoas:** Criar fluxo na transação onde, ao selecionar tipo "Transferência", permite selecionar uma `Person` como destino (apenas registro lógico ou integração futura).
    - **Dívidas com Pessoas:** O módulo de `Debt` já existe, mas precisa do campo `creditorId` (ligado a `Person`) para indicar que a dívida é com um terceiro, não com um banco.
    - **Empréstimos:** Criar um tipo de `Asset` ou `Loan` (Recebível) onde o `User` é o credor e `Person` é o devedor.

## 2. Transações

**Estado Atual:**
O modelo `Transaction` possui `type` (INCOME/EXPENSE), mas não possui um campo de status explícito para controle de fluxo (pendente/confirmado).

**Necessidades de Implementação:**

- **Schema:**
    - Adicionar campo `status` ao modelo `Transaction`:
        ```prisma
        // Enum: PENDING, CONFIRMED, CONSOLIDATED
        status String @default("CONFIRMED")
        ```
- **Funcionalidades:**
    - **Fluxo de Status:** Implementar lógica para transações futuras nascerem como "PENDING". "Consolidada" implica reconciliação bancária (match com extrato).
    - **Batch Operations (Lote):**
        - Backend: Criar endpoint `PATCH /transactions/batch` que aceita um array de IDs e um objeto de mudanças (ex: `{ categoryId: "...", status: "..." }`).
        - Frontend: Adicionar checkboxes na lista de transações e uma "Action Bar" flutuante para ações em massa (Excluir, Categorizar, Confirmar).

## 3. Categorias

**Estado Atual:**
Modelo `Category` é plano (não tem subcategorias). `Budget` (Orçamento) é um campo simples `budgetLimit` na categoria, sem histórico.
**Bug Detectado (Split):** O DTO `SplitTransactionDto` e o serviço `transaction.service.ts` usam apenas o campo legado `category` (string) e ignoram o `categoryId` (relação), quebrando a integridade dos relatórios.

**Necessidades de Implementação:**

- **Schema:**
    - **Subcategorias:** Adicionar auto-relação em `Category`:
        ```prisma
        parentId  String?
        parent    Category? @relation("CategoryHierarchy", fields: [parentId], references: [id])
        children  Category[] @relation("CategoryHierarchy")
        ```
    - **Orçamentos (Budgets):** Remover `budgetLimit` de `Category` e criar entidade `BudgetHistory`:
        ```prisma
        model Budget {
          idString     @id @default(uuid())
          categoryId   String
          amount       Decimal
          period       String // "2024-01"
          userId       String
        }
        ```
- **Correção Split (Prioridade):**
    - Atualizar `SplitTransactionDto` para aceitar `categoryId`.
    - Atualizar `transaction.service.ts` no método `split` para persistir o `categoryId` nas novas transações geradas.

## 4. Rendas

**Estado Atual:**
Modelo `IncomeSource` básico. `WorkUnit` existe para freelancers.

**Necessidades de Implementação:**

- **Schema:**
    - Adicionar campos de configuração de recebimento (pode ser um campo JSON `paymentDetails` ou tabela separada) para armazenar:
        - Taxa (Fee % ou fixo).
        - Prazo de recebimento (Dias para cair na conta).
        - Taxa de conversão (se moeda estrangeira).
    - Adicionar campo `isActive` (Boolean) ou `archivedAt` (DateTime) para permitir inativar fontes de renda antigas.

## 5. Lembretes

**Estado Atual:**
Inexistente.

**Necessidades de Implementação:**

- **Backend:**
    - Criar módulo `Notification`.
    - Instalar `@nestjs/schedule` para Cron Jobs.
    - Job Diário (ex: 08:00 AM):
        - Buscar `Debts` e `FixedExpenses` vencendo hoje/avencer.
        - Gerar notificação (Email via `EmailCredential` ou Push/In-App).
- **Inteligência:**
    - Implementar lógica para sugestão de "Investimentos" (quando saldo > média de gastos) ou "Quitação de Dívidas" (quando saldo cobre dívida com juros altos).

## 6. Contas

**Estado Atual:**
`Account` possui apenas `balance`. Não suporta Multi-moeda nativamente.

**Necessidades de Implementação:**

- **Schema:**
    - Adicionar campo `currency` em `Account` (ISO 4217: "BRL", "USD", "EUR"). Default: "BRL".
    - Adicionar campo `archivedAt` para inativar contas encerradas.
- **Lógica de Negócio:**
    - Transações herdam a moeda da conta.
    - O dashboard deve converter valores para a moeda base do usuário (BRL) usando uma API de cotação ou valor manual fixo para totalização.

## Próximos Passos Sugeridos

1.  **Correção Imediata:** Corrigir o bug de `Split Transaction` (categoryId).
2.  **Schema Migration:** Criar uma migration unificada adicionando `Person`, `status` em Transaction, `currency` em Account e auto-relação em `Category`.
3.  **Refatoração:** Atualizar Services e Controllers para acomodar os novos campos.
4.  **Frontend:** Atualizar interfaces para exibir/gerenciar os novos campos.
