# Plan 004 - Smart Import System (OFX & IMAP)

## Objetivo

Implementar o sistema de ingestão de dados sem custo. Substitui a integração Pluggy por parsers locais e conexão de e-mail.

## Arquivos Afetados

-   `apps/api/src/modules/import/*`
-   `apps/web/src/components/FileUploader.tsx`

## Passo a Passo

### 1. Backend: Parsers

-   [x] Instalar `xml2js` (ou lib específica de OFX).
-   [x] Criar `OfxParserService`: Input -> Buffer, Output -> `TransactionDTO[]`.
-   [x] Criar `SmartMerger`: Lógica para checar se a transação `hash(data+valor+desc)` já existe no banco antes de salvar.

### 2. Backend: IMAP Service

-   [x] Instalar `imapflow`.
-   [x] Criar `ImapService`: `connect`, `fetchUnseen`, `downloadAttachment`.
-   [x] Criar Entidade `EmailCredential` no banco (com senha encriptada).

### 3. Frontend: Upload Manual

-   [x] Criar componente `ImportZone` (Area de Drop).
-   [x] Tela de "Revisão de Importação": Mostra lista de transações encontradas no arquivo antes de confirmar.

### 4. Job de Background

-   [x] Configurar fila `import-queue` no BullMQ.
-   [x] Criar Processor que roda a cada 1h para checar e-mails configurados.

## Verificação

-   Baixar um OFX do seu banco real.
-   Arrastar no sistema. Ver transações na tela. Confirmar.
-   Enviar esse OFX para um e-mail de teste.
-   Configurar o IMAP desse e-mail no sistema.
-   Forçar "Sincronizar Agora" e ver se o sistema baixou e importou o anexo sozinho.
