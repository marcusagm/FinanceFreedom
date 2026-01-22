# Plano de Implementação: Notifications System

**ID:** Plan-041
**Feature:** Notifications
**Status:** 🔴 Planejado

## 1. Objetivo

Criar um sistema de notificações centralizado (Backend e Frontend) para alertar o usuário sobre eventos importantes (Vencimentos, Falhas de Sync, Dicas).

## 2. Arquivos Afetados

- `apps/api/prisma/schema.prisma`
- `apps/api/src/modules/notification/*`
- `apps/web/src/components/Layout/NotificationCenter.tsx`

## 3. Passo a Passo de Implementação

### 3.1. Backend

- [ ] Schema: `Notification` (id, userId, title, message, type, isRead, meta).
- [ ] `NotificationService`: `create()`, `markAsRead()`, `getUnread()`.
- [ ] Integrar no Cron Diário (Plan-040):
    - [ ] Verificar contas a pagar vencendo hoje -> Criar Notificação.

### 3.2. Frontend

- [ ] Componente "Sino" no Header.
- [ ] Badge com contagem de não lidas.
- [ ] Dropdown com lista.
- [ ] Página "Todas as Notificações".

### 3.3. E-mail

- [ ] Implementar templates customizaveis no sistema para emails, com formatação preparada para não ser identificado como SPAM.
- [ ] Se configurado SMTP, enviar também por e-mail usando templates (`handlebars` ou similar).

### 3.4. Qualidade e Internacionalização

- [ ] **Testes:**
    - [ ] Criar notificação e verificar persistência.
    - [ ] Testar endpoint de marcar como lida.
- [ ] **i18n:**
    - [ ] Templates de mensagem devem usar chaves de tradução (`keys`) e resolver no frontend OU backend deve gerar mensagem no idioma do user (preferível frontend resolver chaves se possível, ou backend gera texto traduzido). DECISÃO: Backend gera chave + params, Frontend traduz. Ex: `{ key: 'bill_due', params: { amount: 100 } }`.

## 4. Critérios de Verificação

- [ ] Alterar data de dívida para hoje. Rodar cron. Verificar se notificação apareceu no sino.

## 5. Referências

- [Plan-040-Automation-Backend.md](./Plan-040-Automation-Backend.md)
