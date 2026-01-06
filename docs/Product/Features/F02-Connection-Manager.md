# Feature: F02 - Smart Import Manager (OFX, CSV & Email)

## 1. Visão Geral

**User Story:** "Como usuário que não quer pagar APIs caras, eu quero importar meus extratos bancários arrastando um arquivo ou simplesmente encaminhando um e-mail, e o sistema deve fazer o resto."

Substitui a dependência do Open Finance por uma "Ingestão Passiva Inteligente".

## 2. Descrição Detalhada

Um módulo robusto capaz de ler arquivos financeiros padronizados (OFX) e não padronizados (CSV/PDF via plugins futuros). Inclui um "Email Watcher" que monitora uma caixa de entrada em busca de anexos.

## 3. Requisitos Funcionais

### A. Importação Manual (Drag & Drop)

-   [ ] **Upload Area:** Zona para arrastar arquivos `.ofx`, `.csv`.
-   [ ] **Parser OFX Local:** Processamento 100% local (Client ou Server side) para extrair transações.
-   [ ] **Preview & Conciliação:** Antes de salvar, mostrar: "X novas, Y duplicadas ignoradas". O usuário confirma.

### B. Email Watcher (IMAP Automatizado)

-   [ ] **Configuração IMAP:** Usuário cadastra Host, Porta, User e Senha ( App Password) de seu e-mail.
-   [ ] **Filtros de Busca:** Regras simples: "Assunto contém 'Extrato'", "De: 'nubank@...'".
-   [ ] **Processamento Background:** Worker roda a cada X horas, baixa anexos e coloca na fila de importação.
-   [ ] **Notificação:** "Recebemos um extrato do Nubank. 45 transações importadas com sucesso."

### C. Inteligência de Dados

-   [ ] **Hash de Unicidade:** Gerar um ID único para cada transação (Data + Valor + Hash Descrição) para garantir que re-importar o mesmo arquivo não duplique dados.
-   [ ] **Fallback Manual:** Se o parser falhar, permitir que o usuário corrija as colunas (mapeamento CSV).

## 4. Regras de Negócio

-   **RN01 - Zero Duplicidade:** O sistema deve ser paranoico com duplicatas.
-   **RN02 - Segurança de Credenciais:** A senha do e-mail (IMAP) deve ser encriptada no banco de dados (AES-256).
-   **RN03 - Feedback de "Stale Data":** Se uma conta não recebe importação há mais de 30 dias, marcar como "Desatualizada" no Dashboard.

## 5. Critérios de Aceite

-   [ ] Arrastar um arquivo OFX do Itaú e ver as transações na tela de preview.
-   [ ] Re-enviar o mesmo OFX e ver o sistema informar "0 novas transações".
-   [ ] Configurar um Gmail de teste, enviar um OFX por e-mail e ver a transação aparecer no sistema automaticamente.
