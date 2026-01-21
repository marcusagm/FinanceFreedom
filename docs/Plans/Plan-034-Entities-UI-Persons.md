# Plano de Implementação: Entities UI - Person Management

**ID:** Plan-034
**Feature:** Core UI Adoption (Persons)
**Status:** ✅ Concluído

## 1. Objetivo

Implementar a interface para gestão (CRUD) de "Pessoas" (Contatos) e permitir vincular transações e dívidas a elas (Empréstimos P2P).

## 2. Arquivos Afetados

- `apps/web/src/pages/Persons/*`
- `apps/web/src/components/Persons/*`
- `apps/web/src/components/transactions/NewTransactionDialog.tsx`
- `apps/web/public/locales/*`

## 3. Passo a Passo de Implementação

### 3.1. Gestão de Pessoas

- [x] Tela CRUD de Pessoas (Nome, Email, Telefone, Avatar).
- [x] Integração com serviço `PersonService`.

### 3.2. Vínculo em Transações

- [x] Atualizar `NewTransactionDialog`:
    - [x] Adicionar campo "Pessoa" (PersonSelect).
    - [x] Se tipo == EXPENSE, rótulo é "Beneficiário". Se INCOME, rótulo é "Pessoa".
    - [x] Adicionar checkbox "Empréstimo" (Loan).
        - [x] Checkbox aparece apenas se uma Pessoa for selecionada.
        - [x] Se desmarcar Pessoa, o status de empréstimo é resetado.

### 3.3. Qualidade e Internacionalização

- [x] **Testes:**
    - [x] Testar validação do formulário de pessoa.
    - [x] Testar filtro de busca no combobox.
    - [x] Testar integração no `NewTransactionDialog`.
- [x] **i18n:**
    - [x] Termos: "Contact", "Beneficiary", "Lent to", "Borrowed from".
    - [x] Resolução de conflitos de chaves (`persons.list.name` vs `persons.selectPlaceholder`).

## 4. Critérios de Verificação

- [x] Criar pessoa "João".
- [x] Criar Despesa de R$ 50 vinculada a "João".
- [x] Marcar como "Empréstimo" e verificar persistência.

## 5. Implementações Adicionais (Realizado)

- **Formatação de Telefone:** Adicionado `PatternFormat` para visualização correta de números internacionais.
- **Refatoração UI:** `PersonForm` atualizado para usar `DialogBody`.
- **Lógica Condicional de Empréstimo:** Implementação de UX onde o checkbox de empréstimo só é visível quando um contato é selecionado, evitando estados inválidos.
- **Limpeza de Duplicatas de Tradução:** Identificação e remoção de chaves duplicadas nos arquivos `translation.json` (en, pt, pt-br).
- **Correção de Backend DTO:** Adição de `IsBoolean` e tratamento correto do campo `isLoan` no `TransactionService`.
- **Cobertura de Testes:** Criados testes abrangentes para `PersonSelect`, `DeletePersonDialog` e `PersonsPage` (integração), além de `person.service`.

## 6. Dificuldades Encontradas

- **Testes de Contexto:** O `PersonForm` e `Input` dependem fortemente de `LocalizationContext`, o que exigiu o uso de `LocalizationProvider` real e mocks explícitos nos testes.
- **Elementos Duplicados em Testes (Portals):** Componentes Radix UI (Dialogs) renderizam em Portals, persistindo no DOM entre testes se não houver limpeza explícita. Foi necessário adicionar `cleanup()` no `afterEach` dos testes.
- **Vazamento de Testes (Test Leakage):** Testes do `NewTransactionDialog` falharam inicialmente devido a mocks persistentes (`vi.clearAllMocks()` resolveu).
- **Conflitos de Tradução:** A chave `persons.list.name` estava sendo usada tanto para cabeçalho de tabela quanto para placeholder, exigindo criação de chave específica (`selectPlaceholder`).
- **Persistência de `isLoan`:** O campo estava sendo rejeitado silenciosamente no backend durante a criação (mas não edição) devido a destructuring incompleto.

## 7. Melhorias Futuras

- **Avatar Upload:** Implementar upload real de imagem ara o avatar (atualmente apenas campo no schema/mock).
- **Filtros Avançados:** Adicionar filtro por Pessoa na listagem de transações principal.
- **Relatórios:** Incluir quebras por Pessoa/Beneficiário nos relatórios mensais.
- **Reconciliação de Empréstimos:** Interface específica para ver saldo devedor/credo de cada pessoa e "quitar" dívidas com um clique.

## 8. Referências

- [Plan-031-Core-Evolution.md](./Plan-031-Core-Evolution.md) (Schema)
