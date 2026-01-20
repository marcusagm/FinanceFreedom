# Plano de Implementação: Automation & Notifications Hub

**ID:** Plan-034
**Feature:** Backgroud Jobs & Notifications
**Status:** 🔴 Planejado

## 1. Objetivo

Transformar o sistema de reativo para proativo, implementando tarefas em segundo plano (Cron Jobs) para sincronização automática de dados e um sistema de notificações para alertar o usuário sobre vencimentos e insights.

## 2. Arquivos Afetados

- `apps/api/src/app.module.ts`
- `apps/api/src/modules/scheduler/*` (Novo Módulo)
- `apps/api/src/modules/notification/*` (Novo Módulo)
- `apps/api/src/modules/import/imap/imap.service.ts`

## 3. Passo a Passo de Implementação

### 3.1. Scheduler Setup (Cron)

- [ ] Instalar `@nestjs/schedule`.
- [ ] Configurar `ScheduleModule.forRoot()` no `AppModule`.
- [ ] Criar `TasksService`:
    - [ ] Criar Job `syncEmailImports` (A cada 1 hora ou configurável).
    - [ ] Criar Job `dailyDigest` (Todo dia às 08:00).

### 3.2. Automação de Importação

- [ ] Refatorar a chamada do `ImapService`. Garantir que ele possa rodar sem requisição HTTP (contexto do Cron).
- [ ] Logar execuções de cron em tabela de sistema ou arquivo de log para debug.

### 3.3. Sistema de Notificações

- [ ] Atualizar Schema para armazenar notificações (se persistente no App) ou configurar envio de e-mail.
    - [ ] **Notification:** userId, title, message, type (WARNING, INFO, SUCCESS), isRead, createdAt.
- [ ] Criar `NotificationService`:
    - [ ] Método `notify(userId, payload)`.
- [ ] Implementar verificação no `dailyDigest`:
    - [ ] Buscar Dívidas vencendo hoje/amanhã.
    - [ ] Buscar Faturas de cartão fechando.
    - [ ] Gerar notificações para o usuário.
    - [ ] Criar templates de emails customizáveis por tipo de notificação, com placeholder para variáveis.

### 3.4. Frontend Notification Center

- [ ] Criar componente de "Sininho" no Header.
- [ ] Dropdown listando últimas notificações.
- [ ] Marcar como lida ao clicar.

### 3.5. Qualidade e Internacionalização

- [ ] **Testes:**
    - [ ] Unitários `NotificationService`: Testar criação e marcação de lida.
    - [ ] Integração Scheduler: Testar se o Jobservice chama os métodos corretos (spies).
    - [ ] E2E: Verificar se o sininho exibe o badge vermelho ao receber notificação.
- [ ] **i18n:**
    - [ ] Traduzir templates de e-mail e mensagens de notificação no Backend (`i18n` library no NestJS ou chaves enviadas ao front).
    - [ ] UI: "Notifications", "Mark all as read", "No new notifications".

- [ ] **Background Sync:** Enviar e-mail com anexo OFX. Aguardar a execução do Cron. Verificar se a transação apareceu no sistema sem intervenção manual.
- [ ] **Alertas:** Alterar data de vencimento de uma dívida para "Hoje". Executar manualmente o job `dailyDigest`. Verificar se a notificação apareceu no frontend.
- [ ] **QA:** `npm run test` deve passar sem falhas nos novos módulos.
- [ ] **i18n:** Receber uma notificação de "Vencimento" e verificar se o texto está no idioma selecionado pelo usuário.

## 5. Referências

- Docs do NestJS Schedule.
- [General.md](../New%20features/General.md)
