# Arquitetura de Software - Finance Freedom

## 1. Visão Geral (C4 Model - Nível Container)

O sistema segue uma arquitetura monolítica modular (Modular Monolith) empacotada em containers Docker.

```mermaid
graph TD
    User((Usuário))
    Browser[Browser / PWA]
    EmailServer[Servidor de Email (Gmail/Outlook)]

    subgraph "Host Local (Docker Compose)"
        API[API Gateway / Backend (NestJS)]
        DB[(SQLite Database)]
        Worker[Import Worker (BullMQ)]
    end

    User --> Browser
    User -- Envia Extrato --> EmailServer
    Browser -- Upload OFX --> API
    API -- Leitura/Escrita --> DB
    Worker -- IMAP (Sync) --> EmailServer
    Worker -- Processa OFX --> API
```

## 2. Módulos do Sistema (Backend)

### A. Core Module

-   `AuthService`: Autenticação local.
-   `ConfigService`: Gerencia variáveis (incluindo chaves de encriptação para credenciais IMAP).

### B. Import Module (Refactored)

-   **`OfxParserService`**: Responsável por ler buffers/strings e converter em objetos de transação padronizados.
-   **`CsvParserService`**: Fallback para bancos que só mandam CSV.
-   **`ImapService`**: Cliente IMAP que conecta, busca e baixa anexos.
-   **`SmartMergerService`**: O "Guardião". Recebe transações brutas, verifica duplicatas no DB e persiste apenas o novo.

### C. Financial Module

-   `TransactionService`: CRUD de transações.
-   `CategorizerService`: Auto-Tagging.

### D. Strategy Module (Debt Engine)

-   `DebtService`: Gestão de contratos.
-   `CalculatorService`: Algoritmos Snowball/Avalanche.

## 3. Modelo de Dados (Mudanças Chave)

-   **Credential (Nova Tabela):** `id, user_id, type (IMAP), host, port, user, encrypted_password`
-   **ImportLog (Nova Tabela):** `id, account_id, date, status, items_count, filename` (Para auditoria).

## 4. Fluxos Críticos

### Sync via Email (IMAP)

1.  Worker acorda (Cronjob).
2.  Desencripta credenciais do usuário.
3.  Conecta no IMAP.
4.  Busca e-mails não lidos com anexos `.ofx` ou `.csv` (ou filtros customizados).
5.  Baixa anexo -> `OfxParserService`.
6.  `SmartMergerService` processa dados.
7.  Marca e-mail como lido (opcional) ou move para pasta "Processados".
