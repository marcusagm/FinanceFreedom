# Plan 004 - Smart Import System (OFX & IMAP)

## Objetivo

Implementar o sistema de ingestão de dados sem custo. Substitui a integração Pluggy por parsers locais e conexão de e-mail.

## Arquivos Afetados

-   `apps/api/src/modules/import/*`
-   `apps/web/src/components/FileUploader.tsx`

## Passo a Passo

### 1. Backend: Parsers

-   [ ] Instalar `xml2js` (ou lib específica de OFX).
-   [ ] Criar `OfxParserService`: Input -> Buffer, Output -> `TransactionDTO[]`.
-   [ ] Criar `SmartMerger`: Lógica para checar se a transação `hash(data+valor+desc)` já existe no banco antes de salvar.

### 2. Backend: IMAP Service

-   [ ] Instalar `imapflow`.
-   [ ] Criar `ImapService`: `connect`, `fetchUnseen`, `downloadAttachment`.
-   [ ] Criar Entidade `EmailCredential` no banco (com senha encriptada).

### 3. Frontend: Upload Manual

-   [ ] Criar componente `ImportZone` (Area de Drop).
-   [ ] Tela de "Revisão de Importação": Mostra lista de transações encontradas no arquivo antes de confirmar.

### 4. Job de Background

-   [ ] Configurar fila `import-queue` no BullMQ.
-   [ ] Criar Processor que roda a cada 1h para checar e-mails configurados.

## Verificação

-   Baixar um OFX do seu banco real.
-   Arrastar no sistema. Ver transações na tela. Confirmar.
-   Enviar esse OFX para um e-mail de teste.
-   Configurar o IMAP desse e-mail no sistema.
-   Forçar "Sincronizar Agora" e ver se o sistema baixou e importou o anexo sozinho.
