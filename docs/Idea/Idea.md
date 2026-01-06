# Conceito do Projeto: Finance Freedom

## A Ideia ("Elevator Pitch")

Uma plataforma financeira **Self-Hosted** e **Privacy-First** que atua como um CFO pessoal para indivíduos endividados. Diferente de planilhas manuais ou apps pagos caros, o Finance Freedom oferece **automação sustentável** (via leitura inteligente de arquivos e e-mails) e um **motor de estratégia** que transforma sobras de caixa em liberdade financeira.

## O Problema

1.  **Custo da Automação:** Apps com "Sincronização Bancária Automática" custam caro (mensalidade) ou vendem seus dados.
2.  **Complexidade do Open Finance:** Para uso pessoal e self-hosted, manter chaves de API (Pluggy/Belvo) é inviável financeiramente e tecnicamente.
3.  **Falta de Estratégia:** Trackers de código aberto (Firefly III) focam em _registrar_ o que passou, não em _como sair_ do buraco.

## A Solução

Um Web App (PWA) instalável localmente que:

1.  **Importa Dados sem Custo:** "Arrastar e Soltar" de arquivos OFX/CSV ou leitura automática de extratos recebidos por E-mail (IMAP).
2.  **Garante Privacidade Total:** Seus dados nunca saem do seu servidor/computador.
3.  **Atua Ativamente:** Sugere qual dívida pagar (Snowball/Avalanche) e projeta renda extra necessária.

## Público Alvo

-   **O "Endividado Tech-Savvy":** Quer resolver o problema, sabe rodar um Docker/Node na máquina, mas não quer pagar mensalidade de SaaS.
-   **O "Privacy Advocate":** Não confia em apps que agregam senhas bancárias na nuvem.

## Diferenciais (Unique Selling Points)

-   **Zero Custo Recorrente:** Sem assinaturas de API. Você é dono da infraestrutura.
-   **Smart Import:** O sistema aprende a categorizar seus OFX/PDFs antigos e novos.
-   **Motor Híbrido:** Único que une Controle de Fluxo de Caixa (Curto Prazo) com Estratégia de Dívida (Longo Prazo).

## Objetivos Principais

1.  Entregar um MVP robusto para importação de dados bancários (Nubank, Inter, Itaú) via arquivo.
2.  Implementar os algoritmos clássicos de dívida (Snowball) de forma automatizada.
3.  Criar uma interface que reduza a ansiedade financeira através da clareza.
