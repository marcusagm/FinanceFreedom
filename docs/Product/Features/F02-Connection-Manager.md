# Feature: F02 - Smart Import Manager (OFX, CSV & Email)

## 1. Visão Geral

**User Story:** "Como usuário que não quer pagar APIs caras, eu quero importar meus extratos bancários arrastando um arquivo ou simplesmente encaminhando um e-mail, e o sistema deve fazer o resto."

Substitui a dependência do Open Finance por uma "Ingestão Passiva Inteligente".

## 2. Descrição Detalhada

Um módulo robusto capaz de ler arquivos financeiros padronizados (OFX) e não padronizados (CSV/PDF via plugins futuros). Inclui um "Email Watcher" que monitora uma caixa de entrada em busca de anexos.

## 3. Requisitos Funcionais

### A. Importação Manual (Drag & Drop)

### A. Importação Manual (Drag & Drop)

-   [x] **Upload Area:** Zona para arrastar arquivos `.ofx`, `.csv`. (Implementado em `ImportPage` com `ImportZone`).
-   [x] **Parser OFX Local:** Processamento 100% local (Client via `ImportService.uploadFile` e Server via `OfxParserService`) para extrair transações.
-   [x] **Preview & Conciliação:** Antes de salvar, mostrar: "X novas, Y duplicadas ignoradas". O usuário confirma (Implementado em `ImportReviewTable`).

### B. Email Watcher (IMAP Automatizado)

-   [x] **Configuração IMAP:** Usuário cadastra Host, Porta, User e Senha ( App Password) de seu e-mail.
-   [x] **Filtros de Busca:** Regras simples: "Assunto contém 'Extrato'", "De: 'nubank@...'".
-   [!] **Processamento Background:** Worker roda a cada X horas.
    -   _Nota:_ Atualmente requer "Sincronização Manual" via botão no Dashboard. Agendamento automático (Cron) previsto para V1.1.
-   [x] **Notificação:** "Recebemos um extrato do Nubank. 45 transações importadas com sucesso." (Feedback visual via Toast).

### C. Inteligência de Dados

-   [x] **Hash de Unicidade:** Gerar um ID único para cada transação (Data + Valor + Hash Descrição).
    -   _Nota:_ Implementado logicamente no `SmartMergerService`, mas não persistido como coluna no banco.
-   [ ] **Fallback Manual:** Se o parser falhar, permitir que o usuário corrija as colunas (mapeamento CSV).

## 4. Regras de Negócio

-   **RN01 - Zero Duplicidade:** O sistema deve ser paranoico com duplicatas. **[IMPLEMENTADO - SmartMerger]**
-   **RN02 - Segurança de Credenciais:** A senha do e-mail (IMAP) deve ser encriptada no banco de dados (AES-256). **[PENDENTE - TODO no código]**
-   **RN03 - Feedback de "Stale Data":** Se uma conta não recebe importação há mais de 30 dias, marcar como "Desatualizada" no Dashboard. **[PENDENTE]**

## 5. Critérios de Aceite

-   [x] Arrastar um arquivo OFX do Itaú e ver as transações na tela de preview.
-   [x] Re-enviar o mesmo OFX e ver o sistema informar "0 novas transações".
-   [x] Configurar um Gmail de teste, enviar um OFX por e-mail e ver a transação aparecer no sistema automaticamente (via Sync Manual).

## 6. Status de Implementação (V1.0 Audit)

O módulo F02 entrega uma experiência robusta de "Sincronização Passiva" sob demanda.

### Funcionalidades Adicionais Entregues

-   **Multi-Account Import:** Suporte a múltiplas configurações IMAP simultâneas.
-   **Visual Feedback:** Teste de conexão em tempo real no formulário de configuração.
-   **Account Linking (Context):** Associação automática de importações a contas específicas pré-selecionadas.

### Pendências (V1.1)

-   **Background Worker:** A sincronização automática (Cron) não foi implementada; depende de interação do usuário.
-   **Criptografia:** Senhas de e-mail são salvas em texto plano (risco mitigado por ser um app local/single-tenant, mas crítico para V1.1).
-   **Importação CSV:** O parser atual foca exclusivamente em OFX.
