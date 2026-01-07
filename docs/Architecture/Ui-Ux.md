# UI/UX e Design System

## 1. Identidade Visual

-   **Vibe:** "Limpo, Profissional, mas Esperançoso". Evitar o visual "Planilha de Contador Exaustiva".
-   **Paleta:**
    -   _Primary:_ **Emerald Green** (Esperança, Dinheiro, Solvência).
    -   _System:_ Slate/Gray (Neutros para fundos e textos).
    -   _Danger:_ Rose/Red (Dívidas, Atrasos).
-   **Dark Mode:** Obrigatório e First-Class (Muitos devs/usuários usarão à noite).

## 2. Biblioteca de Componentes (shadcn/ui)

Utilizaremos a biblioteca `shadcn/ui` pela sua acessibilidade e facilidade de customização.

-   **Cards:** Elemento central do Dashboard. Devem ter sombras sutis e bordas arredondadas.
-   **Data Tables:** Para o extrato. Deve suportar paginação e filtros densos.
-   **Dialogs (Modais):** Para cadastros rápidos (Nova Transação) sem sair do contexto.

## 3. Diretrizes de UX

-   **Feedback Imediato:** Toda ação de alterar dinheiro (pagar conta, receber) deve ter um feedback visual (Toast de Sucesso).
-   **Empty States:** Se não houver dados, não mostrar tela branca. Mostrar ilustrações e botões de ação ("Você ainda não tem dívidas! Que ótimo! Deseja cadastrar uma meta?").
-   **Mobile First:** O layout deve quebrar graciosamente para coluna única em telas < 768px. O menu lateral vira Drawer ou Bottom Bar.

## 4. Acessibilidade

-   Suporte a navegação por teclado (Tab index correto).
-   Cores com contraste WCAG AA.
-   Labels em inputs para leitores de tela.

## 5. Reutilização de Componentes

-   **Modularização:** Componentes básicos e reutilizáveis devem ser extraídos para arquivos próprios, evitando duplicação de lógica e estilo (DRY).
-   **Consistência:** Sempre que for coerente, deve-se priorizar o uso de componentes de interface já existentes no projeto antes de criar novas implementações.
-   **Referência Técnica:** Para novos componentes fundamentais, utilizar como base as implementações e padrões da [Base UI](https://base-ui.com/) e `shadcn/ui`.
