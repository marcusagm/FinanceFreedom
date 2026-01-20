# Plano de Implementação: Credit Card - UI & Experience

**ID:** Plan-033
**Feature:** Credit Card Manager (Front-end)
**Status:** 🔴 Planejado

## 1. Objetivo

Criar as interfaces para gestão de cartões de crédito, permitindo ao usuário visualizar faturas, limites e realizar pagamentos.

## 2. Arquivos Afetados

- `apps/web/src/pages/CreditCards/*`
- `apps/web/src/components/CreditCard/*`
- `apps/web/public/locales/*`

## 3. Passo a Passo de Implementação

### 3.1. Meus Cartões (Listagem)

- [ ] Criar Card Visual (imitando cartão físico) com:
    - [ ] Logo da bandeira.
    - [ ] Barra de progresso do Limite (Verde -> Vermelho).
    - [ ] Valor da Fatura Atual.

### 3.2. Detalhe da Fatura (Timeline)

- [ ] View de Abas: "Fatura Atual", "Próxima", "Fechadas".
- [ ] Lista de transações da fatura selecionada.
- [ ] Botão "Pagar Fatura":
    - [ ] Modal para escolher Conta de Origem (se não tiver padrão).
    - [ ] Feedback visual de sucesso.

### 3.3. Widget de Dashboard

- [ ] Criar widget compacto com o somatório de faturas abertas e alerta se alguma vence hoje.

### 3.4. Qualidade e Internacionalização

- [ ] **Testes (Componente):**
    - [ ] Testar renderização do Card com limite estourado (deve ficar vermelho).
    - [ ] Testar clique no botão Pagar (chamar API).
- [ ] **i18n:**
    - [ ] Traduzir: "Invoice", "Closing Date", "Best Buy Day" (Melhor dia de compra).
    - [ ] Formatar moedas.

## 4. Critérios de Verificação

- [ ] Navegar para /credit-cards. Ver lista.
- [ ] Clicar no cartão, ver transações da fatura.
- [ ] Mudar idioma para Inglês, verificar labels.

## 5. Referências

- [Plan-032-Credit-Card-Backend.md](./Plan-032-Credit-Card-Backend.md)
