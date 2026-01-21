# Revisão Arquitetural: Estratégia do Modelo de Cartão de Crédito

## Resumo Executivo

Este documento analisa a abordagem arquitetural atual para Cartões de Crédito (Estratégia de Entidade Dupla: `CreditCard` vinculado a uma `Account` do tipo `CREDIT_CARD`) versus alternativas potenciais.

**Recomendação:** Manter a **Estratégia de Entidade Dupla**, mas aplicar regras de sincronização mais rígidas e corrigir as lacunas de implementação atuais. Os benefícios contábeis de tratar um Cartão de Crédito como uma Conta de Passivo superam a complexidade da sincronização, desde que esta seja robusta.

---

## Arquitetura Atual (Entidade Dupla)

- **Estrutura:** A tabela `CreditCard` contém dados específicos do cartão (limite, dia de fechamento). A tabela `Account` (vinculada via `accountId`) contém o saldo, nome e tipo (`CREDIT_CARD`).
- **Filosofia:** "Tudo é uma Conta". Isso simplifica o cálculo do patrimônio líquido (Ativos - Passivos) e unifica o armazenamento de transações.

### Prós

1.  **Integridade Contábil:** Trata a dívida do cartão de crédito como uma conta de passivo real. Os cálculos de patrimônio líquido são automáticos (soma de todas as contas positivas - soma de todas as contas negativas).
2.  **Transações Unificadas:** Todas as transações residem em uma única tabela (`transactions`), vinculada a um `accountId`. Consultas para "todas as transações" não precisam de uniões complexas entre as tabelas `transactions` e `card_transactions`.
3.  **Flexibilidade:** Permite ajustes manuais no "saldo" do cartão de crédito (ex: cobrança de juros, taxas, pagamentos) usando fluxos de transação padrão.

### Contras

1.  **Complexidade de Sincronização:** Requer cuidado para manter o `CreditCard.name` em sincronia com o `Account.name`, e a exclusão do `CreditCard` em sincronia com a exclusão da `Account`.
    - _Bug Atual:_ Contas persistem após a exclusão do Cartão.
    - _Bug Atual:_ `Accounts.tsx` lista contas de Cartão de Crédito junto com Contas Bancárias.
2.  **Duplicação de Dados:** Nome e potencial confusão sobre onde o "saldo" reside estritamente (embora logicamente esteja em `Account`).
3.  **Filtragem de UI:** Requer filtragem explícita em listas de "Contas Bancárias" para ocultar contas de "Cartão de Crédito".

---

## Alternativa 1: Entidade Pura (Sem Vínculo com Conta)

- **Estrutura:** `CreditCard` existe de forma independente. As transações são vinculadas a `accountId` OU `creditCardId`.
- **Filosofia:** Tratamento especializado para Cartões.

### Prós

1.  **Simplicidade de CRUD:** Criar um cartão é apenas uma inserção no banco de dados. Sem efeitos colaterais.
2.  **Zero Problemas de Sincronização:** Sem "Contas zumbis".

### Contras

1.  **Complexidade Contábil:** O "Patrimônio Líquido" requer a soma de `Accounts.balance` E `CreditCards.balance` (que deve ser calculado a partir das transações ou armazenado separadamente).
2.  **Complexidade de Relatórios:** A visualização de "Todas as Transações" requer buscar de `Transaction` (vinculada a Conta) e `Transaction` (vinculada a Cartão) separadamente se o esquema for bifurcado, ou tornar `accountId` anulável em `Transaction`.
3.  **Custo de Refatoração:** Alto. Requer alteração no esquema de `Transaction` (tornando `accountId` anulável, adicionando `creditCardId` como uma chave estrangeira alternativa) e atualização de todos os serviços que somam saldos.

---

## Análise de Problemas Relatados e Correções Propostas

O usuário relatou três problemas específicos que são bugs de implementação, em vez de falhas fundamentais na estratégia de Entidade Dupla:

### 1. Contas `CREDIT_CARD` listadas na Página de Contas Genérica

**Causa Raiz:** `Accounts.tsx` busca todas as contas sem filtrar `type !== 'CREDIT_CARD'`.
**Correção:** Atualizar `Accounts.tsx` (frontend) ou `AccountController` (backend) para filtrar contas com tipo `CREDIT_CARD` por padrão, ou fornecer um filtro na UI.

### 2. Contas Zumbi (Sincronização na Exclusão)

**Causa Raiz:** `CreditCardService.remove()` exclui apenas o registro de `CreditCard`.
**Correção:** Atualizar `CreditCardService.remove()` para excluir também a `Account` vinculada.

```typescript
// Lógica proposta
await prisma.$transaction(async (tx) => {
    const card = await tx.creditCard.findUnique({ where: { id } });
    await tx.creditCard.delete({ where: { id } });
    await tx.account.delete({ where: { id: card.accountId } });
});
```

### 3. Problemas de Tradução

**Causa Raiz:** Chaves ausentes nos arquivos de localidade.
**Correção:** Já corrigido `common.creditCard` em `en` e `pt-br`.

## Conclusão

Os "Contras" da abordagem atual são bugs gerenciáveis, enquanto os "Contras" da alternativa (refatoração para entidades puramente separadas) introduzem complexidade arquitetural permanente em relatórios e contabilidade.

**Decisão Necessária:**

1.  **Aprovar Correções:** Implementarei a lógica de sincronização de exclusão e a filtragem de lista imediatamente.
2.  **Rejeitar e Refatorar:** Se preferir entidades estritamente separadas apesar da complexidade contábil, devemos planejar uma migração de grande porte.
