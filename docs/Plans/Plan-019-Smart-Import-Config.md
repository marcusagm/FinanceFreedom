# Plan-019 - Configuração Smart Import

**Objetivo:** Criar gestão de múltiplas configurações IMAP com filtros e associação a contas.

## 1. Arquivos Afetados

-   `apps/web/src/pages/ImapConfigPage.tsx` (Refatoração Pesada)
-   `apps/api/src/modules/import/...`
-   `apps/web/src/components/import/ImapConfigList.tsx` (Novo)
-   `apps/web/src/components/import/ImapConfigForm.tsx` (Novo)

## 2. Passo a Passo

### A. Gestão de Configurações (Frontend)

-   [ ] **Listagem de Configurações:**
    -   Criar lista mostrando: Email Configurado, Última Sincronização, Status.
    -   Botão "Sincronizar Agora" por configuração.
-   [ ] **Formulário de Configuração (Novo/Editar):**
    -   Campos de Conexão: Host, Port, User, Password (existentes).
    -   **Filtros de Busca (Novos):**
        -   `Folder` (Origem, ex: INBOX).
        -   `Sender` (De, ex: nubank@...).
        -   `Subject` (Assunto, ex: Fatura).
    -   **Associação:**
        -   Select `Account`: Conta associada a este filtro. (Se o filtro der match, associa a transação a esta conta).
        -   Fallback: Se nenhum filtro específico for definido, usa a conta padrão selecionada.

### B. Integração Backend

-   [ ] **Atualizar Entidade/Serviço:**
    -   Permitir salvar múltiplos registros de configuração IMAP.
    -   Garantir que o `ImapService.sync` itere sobre todas as configurações ativas.
    -   Passar os parâmetros de filtro (`folder`, `sender`, `subject`) para o comando de busca IMAP.

### C. Visualização de Importação

-   [ ] **Atualizar `ImportReviewTable`:**
    -   Adicionar coluna `Account` para exibir a conta que foi associada automaticamente (ou permitir alterar manualmente).

## 3. Critérios de Aceite

-   [ ] Cadastrar duas configurações IMAP diferentes (ex: Gmail pessoal e Outlook trabalho).
-   [ ] Configurar filtro para "Assunto: Fatura" associado à conta "Nubank".
-   [ ] Sincronizar e ver transações importadas já vinculadas à conta correta.
