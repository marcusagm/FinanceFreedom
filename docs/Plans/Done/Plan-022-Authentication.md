# Plan-022 - Autenticação & Segurança

**Objetivo:** Implementar camada de autenticação para proteger o acesso à aplicação e preparar estrutura para multi-usuário (opcional/futuro).

## 1. Arquivos Afetados

-   `apps/web/package.json`
-   `apps/api/package.json`
-   `apps/web/src/pages/Login.tsx` [COMPLETED]
-   `apps/web/src/pages/Register.tsx` [COMPLETED - EXTRA]
-   `apps/web/src/pages/ForgotPassword.tsx` [COMPLETED - EXTRA]
-   `apps/web/src/pages/ResetPassword.tsx` [COMPLETED - EXTRA]
-   `apps/web/src/pages/Profile.tsx` [COMPLETED - EXTRA]
-   `apps/web/src/App.tsx` (Proteção de Rotas via `ProtectedRoute`) [COMPLETED]
-   `apps/api/prisma/schema.prisma` (Modelo User e relações) [COMPLETED]

## 2. Passo a Passo

### A. Infraestrutura de Auth

-   [x] **Arquitetura (Self-Hosted Zero Cost):**
    -   **Backend:** `@nestjs/passport` com estratégias `jwt` e `local`.
    -   **Frontend:** `AuthProvider` customizado (React Context) gerenciando tokens no LocalStorage.
    -   **Custo:** Zero. Totalmente autocontido e funcional offline/local e online.
-   [x] **Backend:**
    -   Criar módulo `AuthModule`.
    -   Endpoint `POST /auth/login`.
    -   Guard `JwtAuthGuard` global e decorator `@Public()`.

### B. Interface

-   [x] **Login Page:** Tela Emerald Theme com Email/Senha.
-   [x] **Proteção:** Componente `ProtectedRoute` redireciona para `/login` se não autenticado.

### C. Dados & Multi-Tenancy (Isolamento de Dados)

-   [x] **Schema (User):** Model `User` { id, email, passwordHash, name, resetToken, resetTokenExpiry }.
-   [x] **Schema (Relacionamentos):** `userId` e relação `@relation` em **TODAS** as entidades.
    -   `Account`
    -   `Transaction`
    -   `Category`
    -   `Debt`
    -   `IncomeSource`
    -   `WorkUnit`
    -   `EmailCredential` (IMAP)
    -   `ProjectedIncome`
-   [x] **Refatoração de Services:** Serviços atualizados para filtrar por `userId`.
-   [x] **Seed/Migration:** Migrações Prisma aplicadas com sucesso.

### D. Recursos Adicionais Implementados (Extra)

-   [x] **Registro de Usuários**: `POST /auth/register` e página de cadastro.
-   [x] **Recuperação de Senha**: Fluxo completo com envio de email (mockado/preparado) e reset via token.
-   [x] **Gestão de Perfil**: Página para atualizar nome e alterar senha.
-   [x] **Cobertura de Testes**: Testes unitários e de integração para todo o fluxo de autenticação (Service, Controller e Componentes).

## 3. Critérios de Aceite

-   [x] Tentar acessar `/dashboard` sem logar redireciona para Login.
-   [x] Login com credenciais corretas libera acesso.
-   [x] Token persiste no refresh.
-   [x] Logout funciona.
