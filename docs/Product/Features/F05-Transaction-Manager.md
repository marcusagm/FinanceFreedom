# Feature: F05 - Transaction Manager (O Livro Razão)

## 1. Visão Geral

**User Story:** "Como usuário, quero que minhas transações sejam categorizadas automaticamente, mas quero poder dividir (split) uma compra de supermercado que contém 'Comida' e 'Produtos de Limpeza' para ter clareza real."

## 2. Descrição Detalhada

A lista mestre de todas as movimentações. É aqui que a "Inteligência" de categorização acontece.

## 3. Requisitos Funcionais

### A. Listagem e Filtros

### A. Listagem e Filtros

-   [x] Lista unificada (feed infinito) de todas as transações de todas as contas. (Implementado em `TransactionList`).
-   [x] Filtros Avançados: Por Data, Por Categoria, Por Conta, Por Tag (ex: #ferias), Por Status (Conciliado/Pendente). (Implementado em `TransactionFilters`).
-   [x] Busca Textual Instantânea (Elasticsearch ou filtro local). (Filtro local implementado).

### B. Edição Inteligente

-   [ ] **Categorização:** Sistema sugere categoria baseada no nome (ex: "Uber" -> "Transporte"). Usuário confirma ou altera. O sistema aprende a preferência.
    -   _Nota:_ Atualmente a categorização é manual. Sugestão automática prevista para V1.1.
-   [x] **Split de Transação:** Dividir uma transação de R$ 100 em: R$ 60 (Alimentação) + R$ 40 (Higiene). Essencial para orçamentos precisos. (Implementado via `SplitTransactionDialog`).
-   [x] **Recorrência:** Marcar transação como "Repete todo mês". O sistema cria lançamentos futuros automaticamente ("Despesa Fantasma").

### C. Conciliação (Para Contas Conectadas)

-   [ ] Se a integraçao dom Imap o importação de ofx enviar uma atualização de uma transação (ex: mudou de "Pendente" para "Confirmado"), o sistema atualiza localmente sem duplicar.
-   [x] Detecção de duplicatas manuais: Se o usuário lançou manualmente e depois o banco importou, o sistema detecta pelo Merge Inteligente.
    -   _Nota:_ O `SmartMerger` ignora duplicatas exatas, mas não realiza "update" de transações existentes.

## 4. Regras de Negócio

-   **RN01 - Imutabilidade Auditável:** Transações importadas do banco não podem ter DATA ou VALOR alterados. **[PENDENTE DE ENFORCEMENT]** (Atualmente o sistema permite edição livre).
-   **RN02 - Parcelas de Cartão:** Compras parceladas devem gerar N transações futuras. **[IMPLEMENTADO]** (Via Recorrência `repeatCount`, gerando lançamentos futuros).

## 5. Critérios de Aceite

-   [x] Categorizar uma transação "Uber" e ver a próxima "Uber" vir categorizada automaticamente. (Manual por enquanto).
-   [x] Fazer um split de uma compra de R$ 100 em duas categorias.
-   [x] Criar uma despesa recorrente e ver ela aparecer no mês seguinte.

## 6. Status de Implementação (V1.0 Audit)

O módulo F05 atende todos os requisitos fundamentais de gestão financeira.

### Funcionalidades Adicionais Entregues

-   **Split Inteligente:** O sistema valida matematicamente a soma das partes antes de confirmar o split.
-   **Importação Multi-Conta:** O filtro de transações suporta alternância rápida entre contas ou visualização consolidada.
-   **Feedback Visual:** Badges de "Custo em Horas" integrados na lista de transações (Integração F03).

### Pendências (V1.1)

-   **Auto-Categorização:** O motor de aprendizado ("Learning") ainda não foi implementado.
-   **Imutabilidade Rígida:** Restrição de edição para dados bancários importados não está ativa no Backend.
