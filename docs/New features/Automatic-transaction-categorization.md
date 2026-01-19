Este relatório detalha o planejamento técnico para a implementação do módulo de **Categorização Automática e Customizável** no Finance Freedom. O objetivo é fornecer uma experiência "out-of-the-box" onde o sistema identifique gastos imediatamente após a importação, permitindo que o usuário refine essas regras conforme sua necessidade, mantendo o compromisso de custo zero e privacidade total.

---

## 1. Visão Geral e Objetivos

Atualmente, o sistema exige que o usuário atribua categorias manualmente ou durante a revisão de importação. O novo motor de categorização automatizará este processo através de um sistema de pesos e palavras-chave, processado inteiramente no servidor local do usuário.

### Objetivos Principais:

- **Automação Imediata**: Categorizar transações comuns (ex: "Uber", "Netflix", "Supermercado") logo no primeiro uso.
- **Customização Total**: Permitir que o usuário crie regras específicas (ex: "Sempre que a descrição contiver 'Posto X', categorizar como 'Transporte'").
- **Aprendizado por Feedback**: Sugerir a criação de uma regra automática sempre que o usuário alterar manualmente a categoria de uma transação.
- **Custo Zero**: Evitar o uso de APIs pagas de IA, utilizando algoritmos de busca por similaridade e regex locais.

---

## 2. Arquitetura do Motor de Categorização

O motor será implementado como um `CategorizerService` dentro do módulo financeiro.

### Fluxo de Funcionamento:

1. **Entrada**: Uma transação é criada ou importada.
2. **Verificação de Regras do Usuário**: O sistema consulta regras customizadas criadas pelo usuário (prioridade máxima).
3. **Verificação de Base Global**: O sistema consulta uma lista pré-definida de fornecedores comuns (fallback).
4. **Atribuição**: Se houver correspondência, a `categoryId` é preenchida automaticamente antes da persistência no banco de dados.

---

## 3. Modelagem de Dados (Prisma Schema)

Para suportar as regras customizáveis, o arquivo `schema.prisma` deve ser expandido para incluir a tabela `CategoryRule`.

```prisma
model CategoryRule {
  id          String   @id @default(uuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  keyword     String   // Termo de busca (ex: "UBER *PENDING")
  categoryId  String
  category    Category @relation(fields: [categoryId], references: [id])
  priority    Int      @default(0) // Regras do usuário têm prioridade alta
  createdAt   DateTime @default(now())

  @@unique([userId, keyword])
}

```

---

## 4. Implementação do CategorizerService

Seguindo os padrões de codificação do projeto, a implementação utilizará propriedades privadas e JSDoc em inglês.

```javascript
/**
 * Description:
 * Service responsible for automatically assigning categories to transactions based on patterns.
 *
 * Properties summary:
 * - _prisma {PrismaService} : Instance of the database client.
 *
 * Typical usage:
 * const categoryId = await categorizerService.categorize(userId, "UBER EATS");
 *
 * Business rules implemented:
 * - User-defined rules override global defaults.
 * - Exact matches are prioritized over partial keyword matches.
 * - Search is case-insensitive and ignores common special characters.
 *
 * Dependencies:
 * - {import('../../prisma/prisma.service.js').default}
 */
export class CategorizerService {
    /**
     * Database client instance
     * @type {PrismaService}
     * private
     */
    _prisma;

    constructor(prisma) {
        this._prisma = prisma;
    }

    /**
     * Attempts to find a category for a given description.
     * @param {string} userId User identifier.
     * @param {string} description Transaction description.
     * @returns {Promise<string|null>} The suggested category ID or null.
     */
    async categorize(userId, description) {
        const me = this;
        const normalizedDesc = description.toLowerCase().trim();

        // 1. Fetch user rules
        const rules = await me._prisma.categoryRule.findMany({
            where: { userId },
            orderBy: { priority: "desc" },
        });

        for (const rule of rules) {
            if (normalizedDesc.includes(rule.keyword.toLowerCase())) {
                return rule.categoryId;
            }
        }

        return null;
    }
}
```

---

## 5. Estratégia de Confiabilidade e Custo Zero

Para garantir a **confiabilidade**, o sistema adotará uma abordagem conservadora:

- **Confirmação Visual**: Transações categorizadas automaticamente serão marcadas com um ícone de "faísca" no frontend, permitindo que o usuário valide a ação com um clique.
- **Não-Invasivo**: Se o nível de confiança for baixo (múltiplas categorias possíveis para a mesma palavra-chave), o assistente deixará o campo em branco para evitar dados inconsistentes.

Para garantir o **custo zero**:

- **Dicionário Local**: Em vez de consultar serviços de terceiros, o Finance Freedom manterá um arquivo JSON local com mais de 500 padrões comuns (Ex: Postos de gasolina, Marketplaces, Apps de entrega).
- **Regex Engine**: Utilização de expressões regulares nativas do Node.js para processamento rápido sem dependências pesadas.

---

## 6. Plano de Execução

| Etapa                | Responsabilidade | Descrição                                                                                   | Prioridade |
| -------------------- | ---------------- | ------------------------------------------------------------------------------------------- | ---------- |
| **1. DB & Model**    | Backend          | Criar tabela `CategoryRule` e migrar o banco.                                               | Crítica    |
| **2. Engine Core**   | Backend          | Implementar o `CategorizerService` com lógica de busca.                                     | Alta       |
| **3. Integração**    | Backend          | Hookar o motor no `TransactionService.create` e no `ImportProcessor`.                       | Alta       |
| **4. UI de Regras**  | Frontend         | Criar tela para o usuário gerenciar suas palavras-chave e categorias.                       | Média      |
| **5. Feedback Loop** | Frontend         | Adicionar pop-up: "Percebemos que você mudou a categoria de 'X'. Deseja fazer isso sempre?" | Baixa      |

Este planejamento garante que a automação seja eficiente, segura e totalmente gratuita, respeitando a arquitetura de monorepo e os padrões de qualidade estabelecidos para o projeto.
