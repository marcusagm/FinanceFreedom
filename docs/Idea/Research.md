# Pesquisa de Mercado e Benchmarking

## 1. Visão Geral do Mercado

O mercado atual divide-se em:

1.  **Apps Open Finance (Organizze, Mobills):** Caros (R$ 150+/ano) e focados em controle mensal.
2.  **APIs de Open Finance (Pluggy, Belvo):** Inviáveis para uso pessoal (Planos partem de R$ 2.500/mês após trial).
3.  **Trackers Open Source (Firefly III, Actual):** Excelentes, mas dependem de importação manual complexa ou "gambiarras" para sync.

**Oportunidade (Gap):** Uma solução que _facilite ao extremo_ a importação manual e automatize a leitura de e-mails, sem depender de APIs caras ou instáveis.

## 2. Análise de Viabilidade Técnica (O Pivot)

### O Problema do Open Finance "Free"

-   **Pluggy/Belvo:** Pesquisa confirmou que não existem planos "Forever Free" viáveis para produção pessoal contínua. Os tokens expiram e os custos para "Dev" são proibitivos.
-   **Conclusão:** Basear o projeto em APIs pagas tornaria o software "inutilizável" para o público-alvo (que quer economizar para pagar dívidas).

### A Alternativa Vencedora: "Smart File Import"

-   **Tecnologia:** Parsing local de arquivos OFX (padrão global) e leitura de E-mails (IMAP) para pegar anexos automaticamente.
-   **Custo:** Zero.
-   **Fricção:** Baixa. A maioria dos bancos envia extrato PDF/OFX por e-mail automaticamente todo mês.
-   **Privacidade:** Máxima. Credenciais bancárias nunca são digitadas no software.

## 3. Análise de Concorrentes Diretos

### A. Actual Budget

-   **Insight:** Possui um ótimo importador de arquivos. Devemos copiar a UX de "Conciliação" de arquivos importados.

### B. Firefly III

-   **Insight:** Possui uma ferramenta chamada "Data Importer" separada. Nós faremos isso _integrado_ e simples.

## 4. Oportunidades de Inovação

1.  **Email Watcher:** O usuário conecta o e-mail (Gmail/Outlook) e o sistema "ouve" novos e-mails de bancos, baixa o OFX e importa. "Quase" tempo real, custo zero.
2.  **Aprendizado de Categoria:** Ao importar um OFX, o sistema usa as categorizações passadas para treinar o modelo.
3.  **Privacidade Real:** O argumento de venda muda de "Conectividade Total" para "Privacidade Total e Custo Zero".
