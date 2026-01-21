# Plano de Implementação: Credit Card - UI & Experience

**ID:** Plan-033
**Feature:** Credit Card Manager (Front-end)
**Status:** 🟢 Concluído

## 1. Objetivo

Criar as interfaces integrado ao Backend criado no plano 22 para gestão de cartões de crédito, permitindo ao usuário visualizar faturas, limites e realizar pagamentos.

## 2. Arquivos Afetados

- `apps/web/src/pages/CreditCards/*`
- `apps/web/src/components/CreditCard/*`
- `apps/web/public/locales/*`

## 3. Passo a Passo de Implementação

### 3.1. Meus Cartões (CRUD)

- [x] Criar Card Visual com:
    - [x] Logo da bandeira.
    - [x] Barra de progresso do Limite (Verde -> Vermelho).
    - [x] Valor da Fatura Atual.
    - [x] Seguindo o padrão de debts
    - [x] Utilizar backend criado no plano 22

### 3.2. Detalhe da Fatura (Timeline)

- [x] View de Abas: "Fatura Atual", "Próxima", "Fechadas", Cadastrar transação (Utilizar Formulário de trasaction).
- [x] Lista de transações da fatura selecionada.
- [x] Botão "Pagar Fatura":
    - [x] Modal para escolher Conta de Origem (se não tiver padrão).
    - [x] Feedback visual de sucesso.

### 3.3. Transações

- [x] Atualizar formulário de transação para apresentar os campos relacionados ao cartão de crédito.
- [x] Atualizar lista de transações para mostrar os campos relacionados ao cartão de crédito.
- [x] Atualizar filtros de transações para mostrar os campos relacionados ao cartão de crédito.

### 3.4. Widget de Dashboard

- [x] Criar widget compacto com o somatório de faturas abertas e alerta se alguma vence hoje.

### 3.5. Qualidade e Internacionalização

- [x] **Testes (Componente):**
    - [x] Testar renderização do Card com limite estourado (deve ficar vermelho).
    - [x] Testar clique no botão Pagar (chamar API).
- [x] **i18n:**
    - [x] Traduzir: "Invoice", "Closing Date", "Best Buy Day" (Melhor dia de compra).
    - [x] Formatar moedas.

## 4. Critérios de Verificação

- [x] Navegar para /credit-cards. Ver lista.
- [x] Clicar no cartão, ver transações da fatura.
- [x] Mudar idioma para Inglês, verificar labels.

## 5. Referências

- [Plan-032-Credit-Card-Backend.md](./Plan-032-Credit-Card-Backend.md)

## 6. Melhorias Adicionais Implementadas

- **Privacidade:** Integração com `MoneyDisplay` para suporte ao modo de privacidade (blur de valores).
- **Consistência de Dados:** Sincronização automática entre exclusão de Cartão de Crédito e sua respectiva Conta.
- **UX:**
    - Ocultação automática do Widget de Dashboard quando não há cartões.
    - Badges visuais para categorias na lista de transações da fatura.
    - Bloqueio de pagamento de fatura utilizando a própria conta do cartão.
- **Qualidade:**
    - Resolução de conflitos de tradução (`pt-br`, `pt`, `en`) para chaves de limite.
    - Correções no Backend (`credit-card.service`) para garantir integridade das relações de transação.
