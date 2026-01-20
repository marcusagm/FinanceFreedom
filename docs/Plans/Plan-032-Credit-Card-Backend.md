# Plano de Implementação: Credit Card - Backend Core

**ID:** Plan-032
**Feature:** Credit Card Manager (Back-end)
**Status:** 🔴 Planejado

## 1. Objetivo

Implementar a lógica de negócios central para cartões de crédito: cálculo de limites, gestão de ciclo de faturas (Fechamento/Vencimento) e projeção de parcelas. Este plano foca exclusivamente na camada de dados e serviços (API).

## 2. Arquivos Afetados

- `apps/api/prisma/schema.prisma`
- `apps/api/src/modules/credit-card/*` (Novo Módulo)
- `apps/api/src/modules/transaction/transaction.service.ts`

## 3. Passo a Passo de Implementação

### 3.1. Schema e Modelagem

- [ ] Atualizar `schema.prisma`:
    - [ ] **CreditCard:** `id`, `name`, `brand` (Visa, Master...), `limit` (Decimal), `closingDay` (Int 1-31), `dueDay` (Int 1-31), `paymentAccountId` (Relation Account, opcional), `userId`.
    - [ ] **Transaction:** Adicionar `creditCardId` (Relation), `installmentNumber` (Int), `totalInstallments` (Int).
- [ ] Executar Migration.

### 3.2. CreditCardService

- [ ] **CRUD:** Create, Read, Update, Delete cartões.
- [ ] **Método `calculateAvailableLimit(cardId)`:**
    - [ ] Buscar todas transações não pagas (ou parcelas futuras).
    - [ ] `Limit - Used = Available`.
- [ ] **Método `getInvoice(cardId, month, year)`:**
    - [ ] Determinar intervalo de datas baseado no `closingDay`.
    - [ ] Exemplo: Fechamento dia 25. Fatura Fev/2026 pega compras de 26/Jan a 25/Fev.
    - [ ] Retornar objeto: `{ status: 'OPEN|CLOSED', total: 1000, transactions: [...] }`.

### 3.3. Integração em TransactionService

- [ ] Ao criar transação com `creditCardId`:
    - [ ] Validar se tem limite disponível.
    - [ ] Se `totalInstallments > 1`, criar N registros de transação (ou um registro pai e lógica de expansão). _Decisão: Criar registros individuais com data futura para facilitar queries de "Contas a Pagar"._

### 3.4. Qualidade e Internacionalização

- [ ] **Testes (Unitários/Integração):**
    - [ ] Testar cálculo de intervalo de datas (virada de ano, meses com 28/30/31 dias).
    - [ ] Testar redução de limite ao criar parcelado.
    - [ ] Cobertura > 80%.
- [ ] **i18n:**
    - [ ] Mensagens de erro de validação ("Limite insuficiente", "Dia de fechamento inválido") traduzidas no backend.

## 4. Critérios de Verificação

- [ ] Criar cartão com dia de fechamento 31. Criar transação dia 01/Fev. Deve cair na fatura de Fev (vence em Março?). Verificar lógica de datas.
- [ ] Coverage relatório mostra testes passando.

## 5. Referências

- [Credit-card-manager.md](../New%20features/Credit-card-manager.md)
