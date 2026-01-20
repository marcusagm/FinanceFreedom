# Plano de Implementação: Debt Strategy - Negotiation & Mental Peace

**ID:** Plan-047
**Feature:** Advanced Debt (Backend)
**Status:** 🔴 Planejado

## 1. Objetivo

Implementar a estratégia de "Paz Mental" no motor de dívidas e o registro de negociações.

## 2. Arquivos Afetados

- `apps/api/prisma/schema.prisma`
- `apps/api/src/modules/debt/*`

## 3. Passo a Passo de Implementação

### 3.1. Schema

- [ ] `Debt`: `mentalPeacePriority` (Int), `prescriptionDate` (DateTime).
- [ ] `DebtNegotiation`: `id`, `debtId`, `proposalAmount`, `counterProposal`, `status`, `notes`.

### 3.2. Strategy

- [ ] Criar `MentalPeaceStrategy.ts` implementando a interface de estratégia.
- [ ] Ordenação considera peso atribuído pelo usuário.

### 3.3. Qualidade e Internacionalização

- [ ] **Testes:**
    - [ ] Unitário: Lista de dívidas deve reordenar ao ativar essa estratégia.

## 4. Critérios de Verificação

- [ ] Dívida de R$ 100 (Stress 10) deve aparecer antes de Dívida R$ 1000 (Stress 1).

## 5. Referências

- [Advanced-debt-strategy.md](../New%20features/Advanced-debt-strategy.md)
