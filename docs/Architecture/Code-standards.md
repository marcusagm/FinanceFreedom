# Padrões de Codificação - Finance Freedom

## 1. Princípios Gerais (The North Star)

-   **Strict Types Everywhere:** `any` é proibido. Se você não sabe o tipo, use `unknown` e faça narrowing.
-   **Feature-First Organization:** Código agrupado por funcionalidade (ex: `modules/debt`), não por tipo técnico (ex: `controllers/`, `services/`).
-   **English Codebase:** Variáveis, funções, commits e PRs em Inglês. Comentários explicativos podem ser (e devem ser, se complexo) em Português.
-   **Single Responsibility:** Cada arquivo deve ter uma responsabilidade clara.
-   **Small Functions:** Funções devem ter menos de 20 linhas.
-   **Naming variables:** Variáveis nunca devem ser abreviadas, devem ter um nome que descreva claramente o que ela representa.
-   **Naming functions:** Funções devem ter um nome que descreva claramente o que ela faz.
-   **Naming classes:** Classes devem ter um nome que descreva claramente o que ela representa.
-   **Naming interfaces:** Interfaces devem ter um nome que descreva claramente o que ela representa.
-   **Naming enums:** Enums devem ter um nome que descreva claramente o que ela representa.
-   **Naming constants:** Constantes devem ter um nome que descreva claramente o que ela representa.
-   **Naming types:** Types devem ter um nome que descreva claramente o que ela representa.

## 2. Padrões Backend (NestJS)

-   **Arquitetura:** Hexagonal Simplificada.
    -   `Domain`: Entidades e Lógica de Negócio pura.
    -   `Application`: Casos de uso e Services.
    -   `Infrastructure`: Prisma, Pluggy Integration.
-   **DTOs:** Validação rigorosa com `class-validator` e `class-transformer` na entrada da API.
-   **Error Handling:** Exceptions customizadas mapeadas para HTTP Codes corretos via Exception Filters.

## 3. Padrões Frontend (React)

-   **Componentes:** Funcionais com Hooks.
-   **Nomenclatura:** `PascalCase` para componentes (`DebtList.tsx`), `camelCase` para funções/variáveis.
-   **Props:** Interface explícita para todas as props. Ex: `DebtListProps`.
-   **Hooks Customizados:** Lógica complexa de UI deve ser extraída para `useDebtCalculator.ts`.

## 4. Git & Commits

-   **Conventional Commits:**
    -   `feat: add snowball calculation logic`
    -   `fix: resolve pluggy sync timeout`
    -   `docs: update installation guide`
    -   `chor: upgrade prisma version`
-   **Branches:**
    -   `main`: Produção/Estável.
    -   `feat/nome-da-feature`: Desenvolvimento.

## 5. Linting & Formatting (Biome)

-   **Regra de Ouro:** O código no repositório DEVE estar formatado. O CI deve falhar se houver erros de lint.
-   Configuração padrão do Biome, com:
    -   Indentação: 4 espaços.
    -   Aspas: Simples.
    -   Semicolons: Sempre.
