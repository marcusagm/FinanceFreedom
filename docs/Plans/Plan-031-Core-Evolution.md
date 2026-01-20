# Plano de Implementação: Core Evolution & Security Framework

**ID:** Plan-031
**Feature:** Core V2.0 Foundation
**Status:** 🔴 Planejado

## 1. Objetivo

Estabelecer a base arquitetural para a versão 2.0 do Finance Freedom, focando em segurança (criptografia), internacionalização financeira (multi-moeda) e expansão do modelo de dados para suportar entidades complexas (Pessoas, Subcategorias). Este plano é PRE-REQUISITO para quase todos os outros planos do ciclo.

## 2. Arquivos Afetados

- `apps/api/prisma/schema.prisma`
- `apps/api/src/common/services/encryption.service.ts` (Novo)
- `apps/api/src/modules/tranasction/*`
- `apps/api/src/modules/account/*`
- `apps/api/src/modules/category/*`
- `apps/api/src/modules/currency/*` (Novo)

## 3. Passo a Passo de Implementação

### 3.1. Segurança e Criptografia (Prioridade Máxima)

- [ ] Criar `EncryptionService` utilitário usando `crypto` (AES-256-CBC).
    - [ ] Métodos: `encrypt(text)`, `decrypt(text)`.
    - [ ] Definir `ENCRYPTION_KEY` no `.env`.
- [ ] Atualizar `ImapConfigService` para encriptar senhas antes de salvar e decriptar ao usar.
    - [ ] **Migração:** Criar script para rotacionar senhas existentes (se houver, ou alertar usuário para reinserir).

### 3.2. Expansão do Schema (Multi-moeda e Entidades)

- [ ] Atualizar `schema.prisma`:
    - [ ] **Account:** Adicionar `currency` (String, default: 'BRL').
    - [ ] **Transaction:**
        - [ ] Adicionar `originalAmount` (Decimal), `originalCurrency` (String), `exchangeRate` (Decimal).
        - [ ] Adicionar `status` (Enum: PENDING, CONFIRMED, RECONCILED) default CONFIRMED.
        - [ ] Adicionar relação `personId` (Opcional).
    - [ ] **Category:** Adicionar `parentId` (Self-relation) para subcategorias.
    - [ ] **Person:** Nova model (id, name, email, phone, userId).
    - [ ] **BudgetHistory:** Nova model para histórico de orçamentos (substituindo o campo simples na categoria).
    - [ ] **ExchangeRateCache:** Nova model para cache de taxas de câmbio.
- [ ] Executar migration (`npx prisma migrate dev --name core_v2_foundation`).

### 3.3. Implementação do Motor Multi-moeda (Básico)

- [ ] Criar Interface `CurrencyProvider`.
- [ ] Implementar `MultiCurrencyService`:
    - [ ] Lógica para consultar Cache ou API Externa (awesomeapi/bcb).
    - [ ] Método `convert(amount, from, to, date)`.

### 3.4. Refatoração de Serviços Core

- [ ] Atualizar `TransactionService`:
    - [ ] Suportar gravação dos novos campos de moeda e status.
    - [ ] Ajustar lógica de cálculo de saldo para considerar moedas (normalizar par base do usuário).
- [ ] Atualizar `CategoryService`:
    - [ ] Suportar CRUD de subcategorias.
- [ ] Criar `PersonService`:
    - [ ] CRUD simples de contatos.

### 3.5. Qualidade e Internacionalização

- [ ] **Testes (TDD/BDD):**
    - [ ] Criar testes unitários para `MultiCurrencyService` (Mock de providers) cobrindo cenários de falha e fallback.
    - [ ] Criar testes unitários para `EncryptionService`.
    - [ ] Atualizar testes de integração de `TransactionService` para verificar a persistência dos novos campos de moeda.
    - [ ] Executar `npm run test:cov` e garantir cobertura > 80% nos novos módulos.
- [ ] **i18n & l10n:**
    - [ ] Adicionar chaves de tradução em `apps/web/public/locales/en/translation.json` e `pt-br/translation.json`.
        - [ ] Termos: "Currency", "Exchange Rate", "Pending Transaction", "Confirmed".
    - [ ] Garantir que formatadores de dinheiro (`Intl.NumberFormat`) usem a moeda da transação (`originalCurrency`), não a do sistema.

- [ ] **Segurança:** Senhas no banco (visualizadas via Prisma Studio) devem estar ilegíveis. Teste de conexão IMAP deve funcionar decriptando a senha corretamente.
- [ ] **Multi-moeda:** Cadastrar uma conta em "USD". Cadastrar transação de $100. O Dashboard deve exibir o total convertido para BRL (aprox R$ 500-600).
- [ ] **Hierarquia:** Criar Categoria "Carro" e subcategoria "Gasolina". Transação em "Gasolina" deve aparecer em relatórios de "Carro" compondo o valor total da categoria pai. As somas das subcategorias devem ser iguais ao valor total da categoria pai, a não ser que o usuário tenha definido um valor diferente para a categoria pai ou feito lançamentos na categoria pai.
- [ ] **Status:** Transação marcada como PENDING não deve descontar do saldo efetivo (apenas projeção) e deve ser visualmente distinta.
- [ ] **Qualidade:** Todos os novos testes unitários e de integração devem passar (`PASS`).
- [ ] **i18n:** Alterar idioma do sistema para Inglês e verificar se os novos status e labels de moeda estão traduzidos corretamente.

## 5. Referências

- [Multi-currency-core.md](../New%20features/Multi-currency-core.md)
- [General.md](../New%20features/General.md)
- [Others.md](../New%20features/Others.md)
