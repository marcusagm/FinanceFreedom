**1. Padrão de codificação:**

- Não deve haver `setter` sem **validação** e **coerção de tipo**.
- Propriedades privadas **nunca** devem ser acessadas diretamente fora de sua classe.
- **Variáveis nunca devem ser abreviadas**; use apenas nomes descritivos.
- Não use nomes de variáveis de 1 ou 2 letras (ex: **não use** `i`, `j`, `dx`/`dy` — prefira `deltaX`/`deltaY`). Nomes devem expressar claramente a responsabilidade.
- Métodos abstratos devem obrigatoriamente usar `throw new Error(...)` seguindo o template de mensagem:
    ```
    Method '<methodName>(<params>)' must be implemented by subclasses of <ClassName>.
    ```
- **Evitar ternários aninhados** em qualquer parte do código.
- Sempre usar `===` ou `!==` em vez de `==` ou `!=`.
- Complexidade ciclomática de métodos $\leq 10$.
- Mantenha os métodos curtos e simples.
- Quando `this` é usado **mais de uma vez**, **defina `const me = this;`**.
- Use `console.warn` para problemas de validação recuperáveis, seguindo o template de mensagem:
    ```
    [ClassName] invalid <property> assignment (<value>). <Justification>. Keeping previous value: ${this._<property>}
    ```
- Use `console.error` para erros irrecuperáveis (ex: falhas de carregamento de imagem/SVG).
- Classes usam **exportação nomeada**: `export class ClassName { ... }`.
- Propriedades privadas definidas no topo da classe, prefixadas com `_`.
- O `constructor` deve **inicializar propriedades via _setters_**, sempre que possível.
- **Ordem de blocos da classe:**
    1. Importações
    2. Class com JSDoc;
    3. Propriedades privadas com docblocks;
    4. Constructor;
    5. Getters / Setters;
    6. Métodos concretos;
    7. Métodos abstratos (por último).
- **Nunca adicione comentários para dividir o arquivo em seções.**, isto é, nunca adione comentários de seções entre métodos como os exemplos abaixo:
    ```
    // --- Logic & Helpers ---
    ...
    // --- UIElement Overrides ---
    ...
    // --- Group Management ---
    ```

**2. Template de Documentação (JSDoc):**

- Todo JSDoc e comentários devem estar em **inglês**.
- **Não** utilize blocos `@fileoverview`.
- **Nenhum método sem JSDoc**.
- Os exemplos no JSDoc da classe devem usar código **mínimo**, **copiável/colável**.
- Mostrar todos os `@param` com descrições breves.
- Adicionar `@returns` corretamente.
- Dependências internas em documentações de métodos e propriedades: `{import('../path/ClassName.js').default}`.
- **Não** utilize `any`.
- Garantir consistência de tipo em todos os parâmetros e valores de retorno.
- Incluir `@abstract`, `@throws {Error}` no JSDoc de métodos.
- **Template para JSDoc da Classe:**

    ```
    /**
     * Description:
     * A complete explanation of the class purpose.
     *
     * Properties summary:
     * - propertyName {<type>} : Short description.
     *
     * Typical usage:
     * Example showing common use.
     *
     * Events:
     * - List of events emitted and being listened to
     *
     * Business rules implemented:
     * - A list of all business rules implemented
     *
     * Dependencies:
     * - List of file and class dependencies
     *
     * Notes / Additional:
     * - Important notes
     */
    ```

- **Template para JSDoc das Propriedades:**
  Adicione \_ apenas se a propriedade for privada

    ```
    /**
     * A complete property description restricted to the responsibility
     *
     * @type {<type>}
     * {visibility}
     */
    _property = <default>;
    ```

- **Template para JSDoc do Setter:**

    ```
    /**
     * A complete method description
     *
     * @param {<type>} value - Description.
     * @returns {void}
     */
    set propertyName(value) { ... }
    ```

- **Template para JSDoc do Getter:**
    ```
    /**
     * A complete method description
     *
     * @returns {<type>} Description.
     */
    get propertyName() { ... }
    ```
- **Template para JSDoc para methodos**
    ```
    /**
     * A complete description of what the method does.
     *
     * @param {Type} parameterName - Description of the parameter.
     * @param {Type} [optionalParameterName] - Description of an optional parameter.
     * @param {Type} [optionalParameterWithDefault=defaultValue] - Description of an optional parameter with a default value.
     * @returns {Type} Description of the value returned by the method.
     * @throws {ErrorType} Description of potential errors thrown by the method.
     */
    myMethod(parameterName, optionalParameterName, optionalParameterWithDefault) {
        // Method implementation
    }
    ```
