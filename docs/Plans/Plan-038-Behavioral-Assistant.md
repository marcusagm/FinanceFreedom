# Plano de Implementação: Behavioral Assistant (The Guide)

**ID:** Plan-038
**Feature:** Behavioral Intelligence
**Status:** 🔴 Planejado

## 1. Objetivo

Criar a camada de inteligência "Assistente" que analisa os dados gerados por todos os outros módulos para oferecer insights proativos (Nudges), detectando gastos supérfluos, oportunidades de economia e riscos.

## 2. Arquivos Afetados

- `apps/api/prisma/schema.prisma`
- `apps/api/src/modules/assistant/*` (Novo Módulo)
- `apps/web/src/components/Assistant/*`

## 3. Passo a Passo de Implementação

### 3.1. Schema

- [ ] Atualizar `schema.prisma`:
    - [ ] **AssistantInsight:** type, title, description, isRead, actionToken (payload para ação rápida).
    - [ ] **BehavioralPattern:** Cache de padrões detectados.

### 3.2. Assistant Engine

- [ ] Criar serviço que roda periodicamente (via Cron do Plan-034):
    - [ ] **Vampire Spends:** Detectar transações repetidas (assinaturas) que subiram de valor ou não foram usadas (difícil sem integração bancária profunda, mas focar em aumento de valor > inflação).
    - [ ] **Opportunity Cost:** Ao registrar despesa > X% da renda, gerar insight: "Isso custa Y dias de trabalho".

### 3.3. Health Score 2.0

- [ ] Atualizar o cálculo de saúde financeira para incluir:
    - [ ] Taxa de Poupança Real.
    - [ ] Cobertura de Reserva de Emergência (Meses de sobrevida).

### 3.4. UI do Assistente

- [ ] Widget de "Dicas do Dia" no Dashboard.
- [ ] Cards acionáveis: "Detectamos aumento na Netflix. Confirmar novo valor?" -> Botão [Confirmar].

## 4. Critérios de Verificação

- [ ] **Insight de Assinatura:** Simular 2 meses de pagamentos de valor X e o 3º mês valor X+20%. O assistente deve gerar um alerta de "Aumento de custo fixo".
- [ ] **Health Score:** Zerar a reserva de emergência (saldo) deve derrubar o score drasticamente.

## 5. Referências

- [Behavioral-intelligence.md](../New%20features/Behavioral-intelligence.md)
