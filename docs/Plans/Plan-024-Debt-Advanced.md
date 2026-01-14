# Plan-024 - Controle Avançado de Dívidas

**Objetivo:** Adicionar precisão ao controle de dívidas, suportando parcelamentos com datas específicas (1ª parcela e dia de vencimento) e projeções reais.

## 1. Arquivos Afetados

-   `apps/api/prisma/schema.prisma`
-   `apps/web/src/components/debt/DebtCard.tsx`
-   `apps/web/src/components/debt/DebtForm.tsx`
-   `apps/web/src/lib/installments.ts` (Nova utilidade)
-   `apps/web/src/components/dashboard/UpcomingInstallmentsWidget.tsx` (Novo componente)
-   `apps/web/src/pages/Dashboard.tsx`

## 2. Passo a Passo

### A. Modelagem de Dados

-   [x] **Atualizar Schema:**
    -   Adicionar `installmentsTotal` (Int, opcional).
    -   Adicionar `installmentsPaid` (Int, default 0).
    -   Adicionar `originalAmount` (Decimal, para histórico).
    -   Adicionar `firstInstallmentDate` (DateTime, data da 1ª parcela).
    -   Adicionar `dueDay` (Int, dia de vencimento mensal).

### B. Interface de Gestão

-   [x] **Formulário de Dívida (`DebtForm`):**
    -   Adicionar inputs para: "Número de Parcelas", "Data da 1ª Parcela" e "Dia de Vencimento".
-   [x] **Indicador Visual:** Progress Bar nos cards de dívida (Parcela X de Y).
-   [x] **Dashboard:** Adicionar coluna "Parcelas" nos cards de dívida.
-   [x] **Visualização de parcelas:** Adicionar botão "Ver Parcelas" ao lado do botão de editar no card de dívida que abre uma modal com a lista de parcelas, mostrando o status de cada parcela, data de vencimento e valor, e permitir mudar o status de uma ou várias parcelas.
-   [x] **Ação de Pagamento:** Ao registrar pagamento (Plan-016), dar opção: "Este pagamento quita uma parcela?".
-   [x] **Edição:** Permitir ajustar número de parcelas restantes e datas.

### C. Lógica e Dashboards

-   [x] **Lógica de Projeção:**
    -   Parcela 1: Usa `firstInstallmentDate`.
    -   Parcela 2+: Usa o `dueDay` nos meses subsequentes.
-   [x] **Projeção:** Atualizar cálculo de "Meses restantes" para considerar as datas reais de vencimento.

### D. Implementações Extras (Além do Plano Inicial)

-   [x] **Utility Compartilhada:** Criação de `apps/web/src/lib/installments.ts` para centralizar a lógica de geração de parcelas, permitindo reuso entre a modal e o widget.
-   [x] **Widget Dedicado:** Implementação do `UpcomingInstallmentsWidget.tsx` no Dashboard para destacar as próximas parcelas a vencer, com layout dedicado ao lado do gráfico de projeção.
-   [x] **Interface Otimizada:** Ajuste no layout do Dashboard para acomodar o novo widget em duas colunas.

## 3. Critérios de Aceite

-   [x] Cadastrar compra "TV" em 10x de R$ 100.
    -   1ª Parcela: 20/Jan.
    -   Vencimento mensal: Dia 10.
-   [x] Verificar projeção de pagamentos:
    -   Mês 1: 20/Jan (R$ 100)
    -   Mês 2: 10/Fev (R$ 100)
    -   ...
-   [x] Card mostra "0/10".
-   [x] Pagar 1 parcela -> Card atualiza "1/10" e saldo devedor cai R$ 100.
