Este relatório detalha o planejamento estratégico e técnico para a implementação do **Modo de Sobrevivência (Survival Mode)** no Finance Freedom. Esta funcionalidade eleva o sistema de um calculador de projeções para um consultor de crise, focado em reduzir o estresse psicológico e otimizar negociações agressivas com credores, mantendo a premissa de custo zero e soberania de dados.

---

## 1. Conceito: O Que é o Survival Mode?

Diferente das estratégias matemáticas puras (Snowball e Avalanche), o **Survival Mode** foca na **Paz Mental** e na **Preservação de Caixa**. Ele é indicado para usuários com múltiplas dívidas em atraso e fluxo de caixa severamente comprometido.

**Pilares do Recurso:**

- **Ranking de Paz Mental:** Priorização baseada no nível de agressividade da cobrança do credor.
- **Rastreador de Negociações:** Histórico centralizado de propostas e acordos.
- **Alerta de Prescrição:** Monitoramento do prazo legal para cobrança judicial (caducidade).
- **Redirecionamento de Fluxo:** Automação da "Bola de Neve" para reserva de emergência imediata após a quitação de um item.

---

## 2. Arquitetura e Modelagem de Dados (Prisma)

Para suportar o Survival Mode, o modelo `Debt` deve ser expandido para incluir metadados comportamentais e históricos de negociação.

### Evolução do Schema

```prisma
model Debt {
  // ... campos existentes
  mentalPeacePriority Int      @default(1) // 1 (Calmo) a 10 (Agressivo/Judicial)
  prescriptionDate    DateTime? // Data estimada de prescrição (ex: 5 anos)
  isNegotiating       Boolean  @default(false)
  negotiations        DebtNegotiation[]
}

model DebtNegotiation {
  id              String   @id @default(uuid())
  debtId          String
  debt            Debt     @relation(fields: [debtId], references: [id])
  offerAmount     Decimal
  status          String   // PROPOSED, REJECTED, ACCEPTED
  contactPerson   String?
  notes           String?
  createdAt       DateTime @default(now())
}

```

---

## 3. Lógica de Inteligência: Ranking de Paz Mental

O `DebtService` será atualizado com uma nova estratégia que combina o custo financeiro (juros) com o custo emocional (agressividade do credor).

**Algoritmo de Prioridade (Survival Score):**
A fórmula sugerida para o ordenamento das dívidas no Survival Mode é:

- **Justificativa:** Em situações de crise, interromper cobranças agressivas que afetam a produtividade do usuário tem maior impacto positivo do que a economia matemática de juros a curto prazo.

---

## 4. Fluxos de Automação (Insight Proativo)

O assistente utilizará os eventos de transação para guiar o comportamento do usuário.

1. **Detecção de Quitação:** Quando o `TransactionService` registrar um pagamento que zere o `totalAmount` de uma dívida:

- O sistema dispara um alerta: _"Dívida [Credor] quitada! Você liberou R$ [Valor] no seu orçamento mensal."_.

2. **Sugestão de Redirecionamento:**

- O assistente pergunta se o usuário deseja criar uma **Meta de Reserva de Emergência** (`SavingsGoal`) com o valor exato da parcela liberada.

3. **Alerta de Negociação Crítica:**

- Se uma dívida está a menos de 6 meses da data de prescrição, o sistema sugere cautela em novos pagamentos pequenos que possam "zerar" o prazo de prescrição legal.

---

## 5. Estratégia de Confiabilidade e Custo Zero

- **Processamento Local:** Toda a lógica de ranking e projeção continuará sendo executada no backend NestJS do usuário.
- **Custo Zero:** Não há integração com birôs de crédito pagos (como Serasa/SPC). O usuário insere as informações de agressividade e datas de prescrição manualmente, garantindo privacidade total.
- **Integridade de Dados:** O uso de transações interativas no Prisma garante que, ao aceitar uma negociação, o saldo da dívida e o log de negociação sejam atualizados simultaneamente.

---

## 6. Interface do Usuário (UX/UI)

- **Dashboard de Crise:** Uma visão que destaca as dívidas com `mentalPeacePriority > 8` com badges de "Crítico" ou "Agressivo".
- **Linha do Tempo de Negociação:** Um histórico visual dentro do `DebtCard` mostrando a evolução das propostas de desconto.

## 7. Próximos Passos

1. **Executar Migração:** Aplicar as alterações de campos avançados no banco de dados.
2. **Refatorar Strategy:** Implementar a `MentalPeaceStrategy` no diretório de estratégias de dívida.
3. **Implementar Log de Negociação:** Criar os endpoints de CRUD para propostas de acordo.
