# Plano de Implementação: Core Evolution & Security Framework

**ID:** Plan-031
**Feature:** Core V2.0 Foundation
**Status:** � Concluído

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

- [x] Criar `EncryptionService` utilitário usando `crypto` (AES-256-CBC).
    - [x] Métodos: `encrypt(text)`, `decrypt(text)`.
    - [x] Definir `ENCRYPTION_KEY` no `.env`.
- [x] Atualizar `ImapConfigService` para encriptar senhas antes de salvar e decriptar ao usar.
    - [ ] **Migração:** Criar script para rotacionar senhas existentes (se houver, ou alertar usuário para reinserir).

### 3.2. Expansão do Schema (Multi-moeda e Entidades)

- [x] Atualizar `schema.prisma`:
    - [x] **Account:** Adicionar `currency` (String, default: 'BRL').
    - [x] **Transaction:**
        - [x] Adicionar `originalAmount` (Decimal), `originalCurrency` (String), `exchangeRate` (Decimal).
        - [x] Adicionar `status` (Enum: PENDING, CONFIRMED, RECONCILED) default CONFIRMED.
        - [x] Adicionar relação `personId` (Opcional).
    - [x] **Category:** Adicionar `parentId` (Self-relation) para subcategorias.
    - [x] **Person:** Nova model (id, name, email, phone, userId).
    - [x] **BudgetHistory:** Nova model para histórico de orçamentos (substituindo o campo simples na categoria).
    - [x] **ExchangeRateCache:** Nova model para cache de taxas de câmbio.
    - [x] **ImportLog:** Nova model para histórico de importações.
- [x] Executar migration (`npx prisma migrate dev --name core_v2_foundation`).

### 3.3. Implementação do Motor Multi-moeda (Básico)

- [x] Criar Interface `CurrencyProvider`.
- [x] Implementar `MultiCurrencyService`:
    - [x] Lógica para consultar Cache ou API Externa (awesomeapi/bcb).
    - [x] Método `convert(amount, from, to, date)`.

### 3.4. Refatoração de Serviços Core

- [x] Atualizar `TransactionService`:
    - [x] Suportar gravação dos novos campos de moeda e status.
    - [x] Ajustar lógica de cálculo de saldo para considerar moedas (normalizar par base do usuário).
- [x] Atualizar `CategoryService`:
    - [x] Suportar CRUD de subcategorias.
- [x] Criar `PersonService`:
    - [x] CRUD simples de contatos.

### 3.5. Qualidade e Internacionalização

- [x] **Testes (TDD/BDD):**
    - [x] Criar testes unitários para `MultiCurrencyService` (Mock de providers) cobrindo cenários de falha e fallback.
    - [x] Criar testes unitários para `EncryptionService`.
    - [x] Atualizar testes de integração de `TransactionService` para verificar a persistência dos novos campos de moeda.
    - [x] Executar `npm run test:cov` e garantir cobertura > 80% nos novos módulos.
- [x] **i18n & l10n:**
    - [x] Adicionar chaves de tradução em `apps/web/public/locales/en/translation.json` e `pt-br/translation.json`.
        - [x] Termos: "Currency", "Exchange Rate", "Pending Transaction", "Confirmed".
    - [x] Garantir que formatadores de dinheiro (`Intl.NumberFormat`) usem a moeda da transação (`originalCurrency`), não a do sistema.

- [x] **Segurança:** Senhas no banco (visualizadas via Prisma Studio) devem estar ilegíveis. Teste de conexão IMAP deve funcionar decriptando a senha corretamente.
- [x] **Multi-moeda:** Cadastrar uma conta em "USD". Cadastrar transação de $100. O Dashboard deve exibir o total convertido para BRL (aprox R$ 500-600).
- [ ] **Hierarquia:** Criar Categoria "Carro" e subcategoria "Gasolina". Transação em "Gasolina" deve aparecer em relatórios de "Carro" compondo o valor total da categoria pai. As somas das subcategorias devem ser iguais ao valor total da categoria pai, a não ser que o usuário tenha definido um valor diferente para a categoria pai ou feito lançamentos na categoria pai.
- [x] **Status:** Transação marcada como PENDING não deve descontar do saldo efetivo (apenas projeção) e deve ser visualmente distinta.
- [x] **Qualidade:** Todos os novos testes unitários e de integração devem passar (`PASS`).
- [x] **i18n:** Alterar idioma do sistema para Inglês e verificar se os novos status e labels de moeda estão traduzidos corretamente.

## 5. Referências

- [Multi-currency-core.md](../New%20features/Multi-currency-core.md)
- [General.md](../New%20features/General.md)
- [Others.md](../New%20features/Others.md)
