# Plano de Implementação: Survival Mode UI

**ID:** Plan-048
**Feature:** Advanced Debt (Frontend)
**Status:** 🔴 Planejado

## 1. Objetivo

Interface para gestão de crise e negociações.

## 2. Arquivos Afetados

- `apps/web/src/pages/Debts/*`
- `apps/web/src/components/Debt/*`

## 3. Passo a Passo de Implementação

### 3.1. Survival Toggle

- [ ] Switch global "Modo Sobrevivência".
- [ ] Efeito: Simplifica o Dashboard (Esconde Wealth, foca em Fluxo de Caixa curto prazo).

### 3.2. Negotiation History

- [ ] Aba "Negociações" no detalhe da dívida.
- [ ] Timeline de conversas/propostas.

### 3.3. Configuração de Stress

- [ ] Slider (1-10) no cadastro da dívida para definir "Nível de Stress".

### 3.4. Qualidade e Internacionalização

- [ ] **i18n:** "Mental Peace", "Survival Mode", "Stress Level".

## 4. Critérios de Verificação

- [ ] Ativar survival mode. Verificar se menu "Wealth" some ou fica desabilitado.
- [ ] Registrar negociação.

## 5. Referências

- [Plan-047-Debt-Negotiation-Logic.md](./Plan-047-Debt-Negotiation-Logic.md)
