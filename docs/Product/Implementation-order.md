# Ordem de Implementação - Finance Freedom V1.0

Este documento define o roteiro de construção para entregar valor incremental e testável.

## Estratégia: "Foundation First, Logic Second"

Construiremos primeiro a capacidade de ver o dinheiro (Foundation), depois a inteligência para movê-lo (Logic).

---

## 🚀 Fase 1: Fundação & Visibilidade (Weeks 1-3)

**Objetivo:** O usuário consegue ver saldo, importar arquivos e categorizar transações.

1.  **[Infra] Project Setup:** Monorepo (Turbo), Docker Compose, NestJS + Prisma, React + Vite.
2.  **[F02] Connection Manager (Base):** Cadastro de contas e upload manual de arquivos OFX (Drag & Drop).
3.  **[F02] Smart Parser:** Lógica de de-duplicação e parser de OFX.
4.  **[F05] Transaction Manager:** Listagem e categorização das transações importadas.
5.  **[F02] Email Watcher (IMAP):** Automação para buscar anexos no e-mail.

_Marco de Entrega 1:_ O sistema já funciona como um "Automated Financial Tracker" (Sem custo de API).

---

## 🧠 Fase 2: O Cérebro da Dívida (Weeks 4-5)

**Objetivo:** O usuário cadastra dívidas e recebe o primeiro plano de ação.

6.  **[F04] Debt Engine (Cadastro):** Modelagem do banco de dados para Dívidas (Taxas, Prazos). Tela de cadastro.
7.  **[F04] Debt Engine (Algoritmo):** Implementação da lógica Snowball/Avalanche.
8.  **[F06] Simuladores (Contexto):** Widget de "Custo do Atraso" na tela de dívidas.

_Marco de Entrega 2:_ O sistema agora é um "Debt Manager" (Concorrente do Undebt.it).

---

## ⚡ Fase 3: O Motor de Aceleração (Weeks 6-7)

**Objetivo:** Conectar a capacidade de trabalho do usuário com a quitação da dívida.

9.  **[F03] Income Engine (Cadastro):** Cadastro de fontes de renda e unidades de trabalho.
10. **[F03] Income Engine (Projeção):** Tela de planejamento mensal de jobs.
11. **[Integração] Dashboard Inteligente:** Action Feed sugerindo pagar dívidas com sobras de caixa.

_Marco de Entrega 3 (MVP V1.0 Completo):_ O sistema fecha o loop ("Trabalhar -> Ver Sobra -> Pagar Dívida ideal").

---

## 🎨 Fase 4: Polimento & UX (Week 8)

12. **[UI] Temas & Mobile:** Ajustes finos de PWA e Dark Mode.
13. **[Sec] Privacidade:** Modo "Blur" de valores.
14. **[Doc] Release:** Empacotamento Docker para distribuição self-hosted.
