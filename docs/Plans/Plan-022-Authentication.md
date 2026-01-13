# Plan-022 - Autenticação & Segurança

**Objetivo:** Implementar camada de autenticação para proteger o acesso à aplicação e preparar estrutura para multi-usuário (opcional/futuro).

## 1. Arquivos Afetados

-   `apps/web/package.json`
-   `apps/api/package.json`
-   `apps/web/src/pages/Login.tsx` (Novo)
-   `apps/web/src/layout/AppLayout.tsx` (Proteção de Rotas)
-   `apps/web/src/lib/auth.ts` (Configuração NextAuth/Auth.js)
-   `apps/api/prisma/schema.prisma` (Modelo User)

## 2. Passo a Passo

### A. Infraestrutura de Auth

-   [ ] **Arquitetura (Self-Hosted Zero Cost):**
    -   **Backend:** `@nestjs/passport` com estratégias `jwt` e `local`.
    -   **Frontend:** `AuthProvider` customizado (React Context) gerenciando tokens no LocalStorage/Cookies.
    -   **Custo:** Zero. Totalmente autocontido e funcional offline/local e online.
-   [ ] **Backend:**
    -   Criar módulo `AuthModule`.
    -   Endpoint `POST /auth/login`.
    -   Guard `JwtAuthGuard` global.

### B. Interface

-   [ ] **Login Page:** Tela simples e elegante (Emerald Theme) com Email/Senha.
-   [ ] **Proteção:** Redirecionar para `/login` se token inválido.

### C. Dados & Multi-Tenancy (Isolamento de Dados)

-   [ ] **Schema (User):** Criar model `User` { id, email, passwordHash, name, createdAt, updatedAt }.
-   [ ] **Schema (Relacionamentos):** Adicionar campo `userId` (obrigatório) e relação `@relation` em **TODAS** as entidades de dados:
    -   `Account`
    -   `Transaction`
    -   `Category`
    -   `Debt`
    -   `IncomeSource`
    -   `WorkUnit`
    -   `EmailCredential` (IMAP)
    -   `ProjectedIncome`
-   [ ] **Refatoração de Services:** Atualizar TODOS os serviços para receber `user: User` (via decorator `@CurrentUser`) e filtrar queries:
    -   _Read:_ `where: { userId }`
    -   _Write:_ `data: { ..., userId }`
-   [ ] **Seed/Migration:** Criar usuário padrão e script para vincular dados existentes (legado) a este usuário.

## 3. Critérios de Aceite

-   [ ] Tentar acessar `/dashboard` sem logar redireciona para Login.
-   [ ] Login com credenciais corretas libera acesso.
-   [ ] Token persiste no refresh.
-   [ ] Logout funciona.
