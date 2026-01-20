# Plano de Implementação: Advanced Debt Strategy (Survival Mode)

**ID:** Plan-037
**Feature:** Debt Strategy V2
**Status:** 🔴 Planejado

## 1. Objetivo

Implementar o "Survival Mode" e estratégias psicológicas de gestão de dívida, focadas em reduzir o estresse do usuário (Mental Peace) e auxiliar em negociações complexas, além das estratégias puramente matemáticas já existentes.

## 2. Arquivos Afetados

- `apps/api/prisma/schema.prisma`
- `apps/api/src/modules/debt/debt.service.ts`
- `apps/api/src/modules/debt/strategies/*`

## 3. Passo a Passo de Implementação

### 3.1. Schema e Metadados

- [ ] Atualizar `schema.prisma`:
    - [ ] **Debt:** mentalPeacePriority (1-10), prescriptionDate (Date), isNegotiating (Bool).
    - [ ] **DebtNegotiation:** Nova tabela para log de propostas (valor oferecido, contra-proposta, data).

### 3.2. Estratégia Mental Peace

- [ ] Criar nova Strategy Class `MentalPeaceStrategy` (implementando a interface de estratégia existente).
    - [ ] Ordenação: `(Valor / Renda) * PesoPsicologico`. Prioriza dívidas que incomodam mais ou estão quase prescrevendo (ou judicializando).

### 3.3. Funcionalidades de Negociação

- [ ] CRUD de `DebtNegotiation` dentro do detalhe da dívida.
- [ ] **Alerta de Prescrição:** Na listagem, destacar dívidas próximas de 5 anos (Prescrição legal bruta) com warning.

### 3.4. Fluxo de "Sobrevivência"

- [ ] Frontend: Criar toggle "Survival Mode".
    - [ ] Quando ativo, o dashboard esconde gráficos de Riqueza e foca 100% em Fluxo de Caixa e Dívidas Críticas.

### 3.5. Qualidade e Internacionalização

- [ ] **Testes:**
    - [ ] Unitários `MentalPeaceStrategy`: Garantir que a ordenação muda conforme os pesos psicológicos.
    - [ ] Integração: Criar negociação e verificar vínculo com dívida.
- [ ] **i18n:**
    - [ ] Termos: "Mental Peace", "Survival Mode", "Prescription Date", "Negotiation History".
    - [ ] Explicações contextuais (Tooltips) traduzidas.

- [ ] **Ordenação:** Ao mudar a prioridade de "Paz Mental" de uma dívida pequena para Máxima, ela deve subir para o topo da lista de recomendação de pagamento.
- [ ] **Histórico:** Registrar uma negociação deve aparecer na timeline da dívida.
- [ ] **QA:** Todos os testes passando.
- [ ] **i18n:** Alternar idioma altera os labels do Modo Sobrevivência.

## 5. Referências

- [Advanced-debt-strategy.md](../New%20features/Advanced-debt-strategy.md)
