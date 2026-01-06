# Feature: F05 - Transaction Manager (O Livro Razão)

## 1. Visão Geral

**User Story:** "Como usuário, quero que minhas transações sejam categorizadas automaticamente, mas quero poder dividir (split) uma compra de supermercado que contém 'Comida' e 'Produtos de Limpeza' para ter clareza real."

## 2. Descrição Detalhada

A lista mestre de todas as movimentações. É aqui que a "Inteligência" de categorização acontece.

## 3. Requisitos Funcionais

### A. Listagem e Filtros

-   [ ] Lista unificada (feed infinito) de todas as transações de todas as contas.
-   [ ] Filtros Avançados: Por Data, Por Categoria, Por Conta, Por Tag (ex: #ferias), Por Status (Conciliado/Pendente).
-   [ ] Busca Textual Instantânea (Elasticsearch ou filtro local).

### B. Edição Inteligente

-   [ ] **Categorização:** Sistema sugere categoria baseada no nome (ex: "Uber" -> "Transporte"). Usuário confirma ou altera. O sistema aprende a preferência.
-   [ ] **Split de Transação:** Dividir uma transação de R$ 100 em: R$ 60 (Alimentação) + R$ 40 (Higiene). Essencial para orçamentos precisos.
-   [ ] **Recorrência:** Marcar transação como "Repete todo mês". O sistema cria lançamentos futuros automaticamente ("Despesa Fantasma").

### C. Conciliação (Para Contas Conectadas)

-   [ ] Se o Pluggy enviar uma atualização de uma transação (ex: mudou de "Pendente" para "Confirmado"), o sistema atualiza localmente sem duplicar.
-   [ ] Detecção de duplicatas manuais: Se o usuário lançou manualmente e depois o banco importou, o sistema sugere "Mesclar".

## 4. Regras de Negócio

-   **RN01 - Imutabilidade Auditável:** Transações importadas do banco não podem ter DATA ou VALOR alterados, apenas metadados (categoria, notas). Apenas transações manuais são totalmente editáveis.
-   **RN02 - Parcelas de Cartão:** Compras parceladas devem gerar N transações futuras no passivo do cartão de crédito, impactando o "Saldo Comprometido" dos meses seguintes.

## 5. Critérios de Aceite

-   [ ] Categorizar uma transação "Uber" e ver a próxima "Uber" vir categorizada automaticamente.
-   [ ] Fazer um split de uma compra de R$ 100 em duas categorias.
-   [ ] Criar uma despesa recorrente e ver ela aparecer no mês seguinte.
