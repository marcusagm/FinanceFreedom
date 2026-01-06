# Estratégia de Qualidade e Testes

Como um sistema financeiro, a precisão matemática é inegociável. Um cálculo de juros errado destrói a confiança.

## 1. Pirâmide de Testes

### A. Testes Unitários (Backend) - Cobertura: Alta (80%+)

-   **Foco:** Lógica de Negócio pura.
-   **Crítico:** `CalculatorService` (Snowball/Avalanche). Esse módulo DEVE ter testes exaustivos com cenários de borda (juros zero, juros negativos, prazos infinitos).
-   **Ferramenta:** Jest (Padrão NestJS).

### B. Testes de Integração (Backend) - Cobertura: Média

-   **Foco:** Fluxo API -> Banco de Dados.
-   **Cenário:** "Criar uma transação atualiza o saldo da conta corretamente?"
-   **Ferramenta:** Supertest + SQLite em memória.

### C. Testes de Componente (Frontend)

-   **Foco:** Renderização correta do Dashboard.
-   **Ferramenta:** Vitest + React Testing Library.

### D. Testes E2E (Ponta a Ponta) - Cobertura: Smoke Test

-   **Foco:** Fluxos principais do usuário ("Login -> Ver Dashboard -> Cadastrar Dívida").
-   **Ferramenta:** Playwright.

## 2. CI/CD (GitHub Actions)

Mesmo sendo self-hosted, o repositório deve ter um pipeline de qualidade:

1.  **On Pull Request:**
    -   Lint (Biome).
    -   Unit Tests.
    -   Build (Check se compila).
2.  **On Main Push:**
    -   Build Docker Image.
    -   Release Tag (Semantic Versioning).

## 3. Definição de Done (DoD)

Uma feature só está pronta quando:

1.  Código implementado.
2.  Testes unitários escritos para a lógica de negócio.
3.  Lint passando.
4.  Funciona no Docker local "limpo".
