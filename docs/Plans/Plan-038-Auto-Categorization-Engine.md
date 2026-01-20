# Plano de Implementação: Auto Categorization - Engine

**ID:** Plan-038
**Feature:** Auto Categorization (Backend)
**Status:** 🔴 Planejado

## 1. Objetivo

Implementar o motor de classificação automática de transações baseada em regras (palavras-chave/regex) para reduzir o trabalho manual do usuário.

## 2. Arquivos Afetados

- `apps/api/prisma/schema.prisma`
- `apps/api/src/modules/categorizer/*` (Novo Módulo)
- `apps/api/src/common/resources/global_keywords.json`

## 3. Passo a Passo de Implementação

### 3.1. Schema e Dados

- [ ] Atualizar `schema.prisma`:
    - [ ] `CategoryRule`: id, userId, keyword, categoryId, priority (0=Baixa, 1=Alta/User).
- [ ] Criar arquivo JSON com regras globais (ex: "Uber" -> Transporte, "Netflix" -> Assinaturas).

### 3.2. CategorizerService

- [ ] Método `categorize(description, userId)`:
    - [ ] Normalizar texto (lowercase, remover acentos).
    - [ ] Buscar regras do usuário (Prioridade 1).
    - [ ] Buscar regras globais (Prioridade 0).
    - [ ] Retornar `categoryId` ou `null`.

### 3.3. Integração

- [ ] Injetar `CategorizerService` no `TransactionService`.
- [ ] No `create` ou `import`, se `categoryId` for nulo, tentar categorizar.

### 3.4. Qualidade e Internacionalização

- [ ] **Testes (Unitários):**
    - [ ] Testar match exato e parcial.
    - [ ] Testar precedência (Regra do usuário deve vencer Global).
- [ ] **i18n:**
    - [ ] Logs de auditoria devem registrar "Auto-categorized by rule X".

## 4. Critérios de Verificação

- [ ] Criar regra "Padaria" -> "Alimentação". Criar transação "Padaria do Zé". Deve salvar como "Alimentação".

## 5. Referências

- [Automatic-transaction-categorization.md](../New%20features/Automatic-transaction-categorization.md)
