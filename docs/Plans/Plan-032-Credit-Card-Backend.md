# Plano de Implementação: Credit Card - Backend Core

**ID:** Plan-032
**Feature:** Credit Card Manager (Back-end)
**Status:** ✅ Concluído

## 1. Objetivo

Implementar a lógica de negócios central para cartões de crédito: cálculo de limites, gestão de ciclo de faturas (Fechamento/Vencimento) e projeção de parcelas. Este plano foca exclusivamente na camada de dados e serviços (API).

## 2. Arquivos Afetados

- `apps/api/prisma/schema.prisma`
- `apps/api/src/modules/credit-card/*` (Novo Módulo)
- `apps/api/src/modules/transaction/transaction.service.ts`

## 3. Passo a Passo de Implementação

### 3.1. Schema e Modelagem

- [x] Atualizar `schema.prisma`:
    - [x] **CreditCard:** `id`, `name`, `brand` (Visa, Master...), `limit` (Decimal), `closingDay` (Int 1-31), `dueDay` (Int 1-31), `paymentAccountId` (Relation Account, opcional), `userId`.
    - [x] **Transaction:** Adicionar `creditCardId` (Relation), `installmentNumber` (Int), `totalInstallments` (Int).
- [x] Executar Migration.

### 3.2. CreditCardService

- [x] **CRUD:** Create, Read, Update, Delete cartões.
- [x] **Método `calculateAvailableLimit(cardId)`:**
    - [x] Buscar todas transações não pagas (ou parcelas futuras).
    - [x] `Limit - Used = Available`.
- [x] **Método `getInvoice(cardId, month, year)`:**
    - [x] Determinar intervalo de datas baseado no `closingDay`.
    - [x] Exemplo: Fechamento dia 25. Fatura Fev/2026 pega compras de 26/Jan a 25/Fev.
    - [x] Retornar objeto: `{ status: 'OPEN|CLOSED', total: 1000, transactions: [...] }`.

### 3.3. Integração em TransactionService

- [x] Ao criar transação com `creditCardId`:
    - [x] Validar se tem limite disponível.
    - [x] Se `totalInstallments > 1`, criar N registros de transação (ou um registro pai e lógica de expansão). _Decisão: Criar registros individuais com data futura para facilitar queries de "Contas a Pagar"._

### 3.4. Qualidade e Internacionalização

- [x] **Testes (Unitários/Integração):**
    - [x] Testar cálculo de intervalo de datas (virada de ano, meses com 28/30/31 dias).
    - [x] Testar redução de limite ao criar parcelado.
    - [x] Cobertura > 80%.
- [x] **i18n:**
    - [x] Mensagens de erro de validação ("Limite insuficiente", "Dia de fechamento inválido") traduzidas no backend.

## 4. Critérios de Verificação

- [x] Criar cartão com dia de fechamento 31. Criar transação dia 01/Fev. Deve cair na fatura de Fev (vence em Março?). Verificar lógica de datas.
- [x] Coverage relatório mostra testes passando.

## 5. Notas de Implementação (Adicionais)

- **Backing Account:** Ao criar um `CreditCard`, o sistema automaticamente cria uma `Account` do tipo `CREDIT_CARD` (hidden) e a vincula via `accountId`. Isso permite que o saldo do cartão (dívida) seja rastreado negativamente na tabela de Contas, facilitando o cálculo de patrimônio líquido e fluxo de caixa.
- **DTO Safety:** Adicionado imports faltantes (`IsBoolean`) e validação estrita nos DTOs.
- **Integração de Módulos:** O `CreditCardModule` foi explicitamente importado no `TransactionModule` para permitir a injeção de dependência cruzada necessária para checagem de limites.
- **Testes:** Testes unitários implementados usando `Vitest` (substituindo `JEST` conforme stack do projeto).

## 6. Referências

- [Credit-card-manager.md](../New%20features/Credit-card-manager.md)

## 5. Referências

- [Credit-card-manager.md](../New%20features/Credit-card-manager.md)
