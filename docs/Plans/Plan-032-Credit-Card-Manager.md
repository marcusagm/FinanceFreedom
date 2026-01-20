# Plano de Implementação: Credit Card Manager

**ID:** Plan-032
**Feature:** Credit Card Module
**Status:** 🔴 Planejado

## 1. Objetivo

Implementar um módulo dedicado para gestão de Cartões de Crédito, resolvendo a limitação da V1.0 onde cartões eram tratados como "Contas Negativas". O novo módulo deve suportar limites, datas de fechamento/vencimento, parcelamentos e a distinção entre cartão vinculado (débito auto) e cartão avulso. CRUD completo de cartões.

## 2. Arquivos Afetados

- `apps/api/prisma/schema.prisma`
- `apps/api/src/modules/credit-card/*` (Novo Módulo)
- `apps/web/src/pages/CreditCard/*` (Novas Telas)
- `apps/web/src/components/credit-card/*` (Novos Componentes)
- `apps/api/src/modules/transaction/transaction.service.ts`

## 3. Passo a Passo de Implementação

### 3.1. Schema e Modelagem

- [ ] Atualizar `schema.prisma`:
    - [ ] **CreditCard:** id, name, brand, limit, closingDay, dueDay, paymentAccountId (opcional), userId.
    - [ ] **Transaction:** Adicionar `creditCardId` (Relation) e `installmentNumber`/`totalInstallments` (Int).
- [ ] Migration no banco.

### 3.2. Backend (CreditCardService)

- [ ] CRUD de Cartões.
- [ ] Lógica de `calculateAvailableLimit(cardId)`:
    - [ ] Limite Total - (Soma de todas parcelas futuras + Gastos atuais não pagos).
- [ ] Lógica de `getInvoice(cardId, month, year)`:
    - [ ] Retornar transações que caem na fatura baseada no `closingDay`.
    - [ ] Se a transação foi dia 25 e fecha dia 24, cai no mês seguinte.
- [ ] Integração com Transações:
    - [ ] Ao criar compra no Crédito, gerar registros de parcelas "virtuais" ou instâncias reais no banco (projeção). _Decisão: Gerar parcelas reais como transações PENDING/SCHEDULED._

### 3.3. Frontend (UI Manager)

- [ ] **Lista de Cartões:** Cards visuais imitando cartões físicos, com barra de uso do limite.
- [ ] **Detalhe da Fatura:** Timeline mostrando:
    - [ ] Fatura Atual (Aberta)
    - [ ] Próxima Fatura (Projeção)
    - [ ] Botão "Pagar Fatura":
        - [ ] Se tiver `paymentAccountId`: Debitar dessa conta e gerar transação de "Pagamento de Fatura" na conta e "Crédito" no Cartão para zerar saldo.
        - [ ] Se não: Abrir modal para escolher conta de pagamento.

### 3.4. Dashboard Widget

- [ ] Criar widget `CreditCardsSummary` para o Dashboard principal, mostrando total de faturas abertas e limites disponíveis.

### 3.5. Qualidade e Internacionalização

- [ ] **Testes (TDD):**
    - [ ] Unitários: `CreditCardService` (cálculo de limites, projeção de faturas).
    - [ ] Integração: `TransactionService` (criar transação parcelada deve refletir corretamente na fatura futura).
    - [ ] Componentes: Testar `CreditCardSummary` com diferentes estados de limite (Vazio, Cheio, Estourado).
- [ ] **i18n & l10n:**
    - [ ] Atualizar arquivos em `apps/web/public/locales` (pt-br/en).
    - [ ] Novas chaves: "Closing Day", "Due Day", "Invoice", "Available Limit", "Pay Invoice".
    - [ ] Formatação de datas de vencimento deve respeitar o locale do usuário.

- [ ] **Ciclo de Fatura:** Uma compra feita APÓS o dia de fechamento deve cair na fatura do mês seguinte automaticamente.
- [ ] **Parcelamento:** Compra de R$ 1000 em 10x deve reduzir o limite em R$ 1000 imediatamente, mas impactar a fatura em apenas R$ 100/mês.
- [ ] **Pagamento:** Pagar a fatura deve:
    1.  Reduzir saldo da conta bancária.
    2.  Restaurar o limite disponível do cartão (relativo àquela fatura).
- [ ] **Cobertura:** Relatório de coverage deve mostrar 100% nas regras de negócio do `CreditCardService`.
- [ ] **i18n:** Verificar se a mensagem de "Fatura Fechada" aparece traduzida nos dois idiomas.

## 5. Referências

- [Credit-card-manager.md](../New%20features/Credit-card-manager.md)
