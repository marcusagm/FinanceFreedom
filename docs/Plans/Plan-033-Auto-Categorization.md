# Plano de Implementação: Automatic Categorization Engine

**ID:** Plan-033
**Feature:** Auto Categorization
**Status:** 🔴 Planejado

## 1. Objetivo

Reduzir a fricção de entrada de dados automatizando a escolha de categorias para transações importadas ou criadas manualmente, utilizando um sistema de regras por palavra-chave e "aprendizado" baseado no histórico do usuário.

## 2. Arquivos Afetados

- `apps/api/prisma/schema.prisma`
- `apps/api/src/modules/categorizer/*` (Novo Módulo)
- `apps/api/src/modules/import/import.service.ts`
- `apps/api/src/modules/transaction/transaction.service.ts`

## 3. Passo a Passo de Implementação

### 3.1. Infraestrutura

- [ ] Atualizar `schema.prisma`:
    - [ ] **CategoryRule:** userId, keyword (string), categoryId, priority (int).
- [ ] Criar pasta `resources/` com `global_keywords.json` (dicionário padrão de categorização para "Cold Start").

### 3.2. CategorizerService (O Motor)

- [ ] Implementar método `categorize(description, userId)`:
    1.  **Busca Regras do Usuário:** Query em `CategoryRule` onde `description` contém `keyword`.
    2.  **Busca Global:** Se não achar, buscar no JSON estático.
    3.  **Retorno:** ID da categoria ou `null`.

### 3.3. Integração

- [ ] No `TransactionService.create`:
    - [ ] Se `categoryId` não for fornecido, chamar `categorizer.categorize()`.
- [ ] No `ImportService`:
    - [ ] Para cada item OFX/IMAP, tentar categorizar antes de salvar.

### 3.4. Frontend & Regras

- [ ] Tela **"Regras de Categorização"**:
    - [ ] Tabela CRUD para o usuário cadastrar suas palavras-chave (Ex: "Starbucks" -> "Café").
- [ ] **Feedback Loop:**
    - [ ] Se o usuário edita uma categoria de uma transação, o sistema deve perguntar (Toaster/Modal discreto): _"Deseja criar uma regra para categorizar 'XYZ' sempre como 'ABC'?"_

## 4. Critérios de Verificação

- [ ] **Importação:** Importar um OFX contendo "Uber". O sistema deve categorizar automaticamente como "Transporte" (baseada em regra global ou criada).
- [ ] **Customização:** Usuário cria regra "Amazon" -> "Eletrônicos". Ao inserir despesa "Compra Amazon", a categoria deve vir preenchida.
- [ ] **Conflito:** Regra do usuário deve ter precedência sobre a regra global.

## 5. Referências

- [Automatic-transaction-categorization.md](../New%20features/Automatic-transaction-categorization.md)
