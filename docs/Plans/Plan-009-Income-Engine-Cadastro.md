# Plan 009 - Income Engine (Cadastro)

## Objetivo

Permitir o cadastro de fontes de renda não-lineares (Freelance, Jobs) e definir a "Capacidade Produtiva" do usuário.

## Arquivos Afetados

-   `packages/database/schema.prisma`
-   `apps/api/src/modules/income/*`
-   `apps/web/src/pages/Income.tsx`

## Passo a Passo

### 1. Backend: Modelagem

-   [x] Atualizar schema Prisma com modelos `IncomeSource` e `WorkUnit`.
    -   `IncomeSource`: Salário Fixo ou Recorrente.
    -   `WorkUnit`: Tipo de Job (ex: "Logotipo", "Consultoria").
        -   Campos: `name`, `defaultPrice`, `estimatedTime` (horas).
-   [x] Criar módulo `IncomeModule` na API.

### 2. Frontend: Gestão de Renda

-   [x] Criar pagina `Income.tsx`.
-   [x] Aba "Fontes Fixas": CRUD de salários.
-   [x] Aba "Catálogo de Serviços": CRUD de `WorkUnits`.
    -   Ex: Criar "Design de Post" = R$ 50,00 / 1h.

## Verificação

-   Cadastrar Salário Fixo: "CLT" - R$ 5.000 (Dia 05).
-   Cadastrar Unidade de Trabalho: "Freela Design" - R$ 200 (4 horas).
-   Verificar persistência no banco.
