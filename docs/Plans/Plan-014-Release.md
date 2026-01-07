# Plan 014 - Release (Docker & Distribution)

## Objetivo

Empacotar a aplicação para que o usuário possa rodar em seu próprio servidor ou máquina local de forma definitiva ("Self-hosted").

## Arquivos Afetados

-   `Dockerfile.prod` (API e Web)
-   `docker-compose.prod.yml`
-   `README.md`

## Passo a Passo

### 1. Otimização de Imagens

-   [ ] Criar Dockerfile Multi-stage build para reduzir tamanho da imagem final.
    -   Web: Buildar estáticos e servir com Nginx (Alpine).
    -   API: Buildar JS e rodar apenas com `node_modules` de produção.

### 2. Orquestração de Produção

-   [ ] Criar `docker-compose.prod.yml`.
    -   Banco de dados persistente em volume nomeado.
    -   Restart policies (`always`).
    -   Remover portas expostas desnecessárias (só expor 80/443 via proxy se necessário, ou a porta da Web).

### 3. Documentação Final

-   [ ] Atualizar README com seção "Como rodar em Produção".

## Verificação

-   Rodar `docker-compose -f docker-compose.prod.yml up -d`.
-   O app deve subir leve e rápido.
-   Reiniciar o container não deve perder dados.
