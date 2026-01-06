# Stack de Desenvolvimento - Finance Freedom

## Filosofia: "Modernidade, Performance e Simplicidade Local"

## 1. Backend (The Core)

-   **Runtime:** **Node.js (LTS)**.
-   **Framework:** **NestJS**.
-   **Database:** **SQLite**.
-   **ORM:** **Prisma**.
-   **Job Queue:** **BullMQ** (Redis) - Essencial agora para o processamento de e-mails em background sem travar a API.

## 2. Bibliotecas Chave (Novas)

-   **Parsing:**
    -   `ofx-js` ou `banking` (Parser de OFX).
    -   `csv-parse` (Parser de CSV robusto).
    -   `pdf-parse` (Futuro: Leitura de PDF).
-   **Email:**
    -   `imapflow` (Moderna, Async, feita pelo criador do Nodemailer). Melhor escolha que `node-imap`.
-   **Crypto:**
    -   Módulo nativo `crypto` do Node.js para encriptar senhas de e-mail no banco (AES).

## 3. Frontend (The Face)

-   **Framework:** React + Vite.
-   **Upload:** `react-dropzone` para UX fluida de "arrastar extrato".

## 4. Infraestrutura

-   **Docker:**
    -   Container API.
    -   Container Web.
    -   Container Redis (para filas do BullMQ).
