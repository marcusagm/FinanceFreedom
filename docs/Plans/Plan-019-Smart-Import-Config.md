# Plan-019 - Configuração Smart Import

**Objetivo:** Criar gestão de múltiplas configurações IMAP com filtros e associação a contas.

## 1. Arquivos Afetados

-   `apps/web/src/pages/ImapConfigPage.tsx` (Refatoração Pesada)
-   `apps/api/src/modules/import/...`
-   `apps/web/src/components/import/ImapConfigList.tsx` (Novo)
-   `apps/web/src/components/import/ImapConfigForm.tsx` (Novo)
-   `apps/web/src/components/import/ImapConfigList.test.tsx` (Novo)
-   `apps/web/src/components/import/ImapConfigForm.test.tsx` (Novo)

## 2. Passo a Passo

### A. Gestão de Configurações (Frontend)

-   [x] **Listagem de Configurações:**
    -   Criar lista mostrando: Email Configurado, Última Sincronização, Status.
    -   Botão "Sincronizar Agora" por configuração.
-   [x] **Formulário de Configuração (Novo/Editar):**
    -   Campos de Conexão: Host, Port, User, Password (existentes).
    -   **Filtros de Busca (Novos):**
        -   `Folder` (Origem, ex: INBOX).
        -   `Sender` (De, ex: nubank@...).
        -   `Subject` (Assunto, ex: Fatura).
    -   **Associação:**
        -   Select `Account`: Conta associada a este filtro. (Implementado via contexto da página: a configuração é criada vinculada à conta selecionada).
        -   Fallback: Se nenhum filtro específico for definido, usa a conta padrão selecionada.

### B. Integração Backend

-   [x] **Atualizar Entidade/Serviço:**
    -   Permitir salvar múltiplos registros de configuração IMAP.
    -   Garantir que o `ImapService.sync` itere sobre todas as configurações ativas.
    -   Passar os parâmetros de filtro (`folder`, `sender`, `subject`) para o comando de busca IMAP.

### C. Visualização de Importação

-   [x] **Atualizar `ImportReviewTable`:**
    -   Adicionar coluna `Account` para exibir a conta que foi associada automaticamente (ou permitir alterar manualmente).

## 3. Critérios de Aceite

-   [x] Cadastrar duas configurações IMAP diferentes (ex: Gmail pessoal e Outlook trabalho).
-   [x] Configurar filtro para "Assunto: Fatura" associado à conta "Nubank".
-   [x] Sincronizar e ver transações importadas já vinculadas à conta correta.

## 4. Melhorias e Adições Implementadas

-   **Testes Automatizados Completos:** Cobrindo Backend (`ImapService`, `ImportController`) e Frontend (`ImapConfigForm`, `ImapConfigList`).
-   **UX - Feedback de Teste Inline:** O resultado do teste de conexão aparece diretamente no formulário (Dialog) com ícones e cores de status, sem bloquear a UI.
-   **Lógica de Teste Aprimorada:** O teste de conexão agora retorna a contagem exata de e-mails encontrados (Total vs Não Lidos) para ajudar o usuário a depurar seus filtros.
-   **Acessibilidade (a11y):** Inclusão de atributos `aria-label`, `htmlFor` e `id` para suporte a leitores de tela e melhores práticas de testes.
