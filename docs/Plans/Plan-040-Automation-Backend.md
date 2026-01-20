# Plano de Implementação: Automation Backend (Cron & Sync)

**ID:** Plan-040
**Feature:** Automation Core
**Status:** 🔴 Planejado

## 1. Objetivo

Configurar a infraestrutura de tarefas em segundo plano (Cron Jobs) para permitir sincronização de e-mails e rotinas de manutenção sem intervenção do usuário.

## 2. Arquivos Afetados

- `apps/api/src/app.module.ts`
- `apps/api/src/modules/tasks/*` (Novo Módulo)
- `apps/api/src/modules/import/imap/imap.service.ts`

## 3. Passo a Passo de Implementação

### 3.1. Infraestrutura Cron

- [ ] Instalar `@nestjs/schedule`.
- [ ] Criar `TasksService`.

### 3.2. Jobs

- [ ] **Sync Job:** Rodar a cada 30min ou 1h.
    - [ ] Chamar `ImapService.syncAllUsers()`.
    - [ ] Refatorar `ImapService` para não depender de `Request` (Contexto HTTP), pois rodará em background, mas deve permitir a sincronização manual tambem.
- [ ] **Maintenance Job:** Rodar 1x ao dia.
    - [ ] Limpeza de logs antigos?
    - [ ] Atualização de caches de moeda/inflação (se implementado).

### 3.3. Qualidade e Internacionalização

- [ ] **Testes:**
    - [ ] Testar se o Job é invocado (Spy no Logger).
    - [ ] Garantir tratamento de erro: Se o sync de um usuário falhar, não deve parar o dos outros.
- [ ] **Logs:**
    - [ ] Logs estruturados para debug ("Sync Job started", "Sync Job finished with X errors").

## 4. Critérios de Verificação

- [ ] Rodar aplicação. Verificar no terminal se o Job iniciou.
- [ ] Enviar e-mail com OFX. Esperar o próximo ciclo do job. Verificar se importou.

## 5. Referências

- [Plan-034-Automation-and-Notifications.md](./Plan-034-Automation-and-Notifications.md) (Original concept)
