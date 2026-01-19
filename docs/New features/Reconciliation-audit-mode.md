Este relatório detalha o planejamento para a implementação do **Modo Conciliação e Auditoria** no Finance Freedom. O objetivo é garantir que o saldo controlado pela aplicação seja um reflexo fiel da realidade bancária do usuário, identificando discrepâncias e automatizando ajustes com foco em integridade e custo zero.

---

## 1. Objetivo e Escopo

O Modo Conciliação servirá como uma ferramenta de auditoria periódica para validar o "Livro Razão" do sistema contra o extrato real. Ele permitirá:

- Validar o saldo de uma conta em uma data específica.
- Identificar transações ausentes ou duplicadas.
- Gerar transações de ajuste automático para alinhar saldos divergentes.

## 2. Arquitetura e Integração Técnica

A implementação se integrará aos módulos de conta e importação inteligente existentes.

### A. Fluxo de Execução

1. **Checkpoint de Saldo**: O usuário insere o saldo real atual da conta e a data de referência.
2. **Análise de Discrepância**: O sistema calcula o "Saldo Esperado" somando todas as transações (Receitas - Despesas) desde o último checkpoint.
3. **Identificação de Diferença**: Se `Saldo Real != Saldo Esperado`, o sistema entra em modo de auditoria.
4. **Resolução**: O usuário revisa transações pendentes ou autoriza uma "Transação de Ajuste de Conciliação".

### B. Extensões no Modelo de Dados (Prisma)

Para suportar o histórico de auditoria, o arquivo `schema.prisma` deve ser atualizado:

```prisma
model ReconciliationSession {
  id                String   @id @default(uuid())
  accountId         String
  account           Account  @relation(fields: [accountId], references: [id])
  reconciledDate    DateTime
  expectedBalance   Decimal
  actualBalance     Decimal
  difference        Decimal
  adjustmentId      String?  @unique // Link para a transação de ajuste criada
  status            String   @default("COMPLETED") // PENDING, COMPLETED
  createdAt         DateTime @default(now())
}

model Account {
  // ... campos existentes
  lastReconciledAt  DateTime?
  reconciliations   ReconciliationSession[]
}

```

## 3. Lógica de Auditoria e Algoritmos

O motor de conciliação utilizará a assinatura de transações já definida no `SmartMergerService` para identificar lacunas.

- **Detecção de Transação Fantasma**: O sistema comparará o volume de transações importadas via OFX/IMAP com o registro manual.
- **Ajuste Atômico**: A criação da transação de ajuste utilizará o padrão `$transaction` do Prisma para garantir que o saldo da conta seja atualizado simultaneamente ao registro da auditoria, mantendo a consistência dos dados.

## 4. Estratégia de Confiabilidade e Custo Zero

A prioridade é manter a soberania dos dados sem taxas de serviços de terceiros.

1. **Soberania dos Dados**: Toda a lógica de comparação é processada localmente no backend (NestJS), utilizando o banco SQLite do usuário.
2. **Uso de Metadados de Importação**: O sistema aproveitará os logs de importação (`ImportLog`) para verificar se arquivos OFX foram pulados ou se houve falhas na sincronização IMAP.
3. **Audit Trail (Trilha de Auditoria)**: Cada ajuste de conciliação será marcado com uma categoria especial "Sistema: Ajuste", permitindo que o usuário identifique facilmente alterações automáticas em seus relatórios.

## 5. Interface do Usuário (UI/UX)

O frontend (React) apresentará uma interface guiada (Wizard):

- **Passo 1**: Seleção da conta e inserção do saldo do extrato bancário.
- **Passo 2**: Lista de transações "não conciliadas" para conferência manual (vincular ao extrato).
- **Passo 3**: Visualização da diferença e botão de ação para "Ajustar e Finalizar".

## 6. Diagnóstico e Próximos Passos

### Riscos Identificados

- **Datas de Compensação**: Transações feitas no final de semana podem aparecer com datas diferentes no extrato e no app. O algoritmo deve ter uma tolerância de ±2 dias.
- **Recursividade**: Transações de ajuste não devem ser consideradas em futuras conciliações como "transações de renda/despesa padrão" para não enviesar o `HealthScore`.

### Plano de Implementação

1. **Etapa 1**: Atualização do banco de dados e criação do `ReconciliationService` no Backend.
2. **Etapa 2**: Implementação da lógica de cálculo de saldo retroativo e transações de ajuste.
3. **Etapa 3**: Criação das telas de conciliação e histórico no Frontend.
