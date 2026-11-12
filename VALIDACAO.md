# Validação — 3 de novembro de 2026

> Registro histórico da versão original. A versão atual tem oito capítulos; as telas “Nossa Jornada” e “Toca pra mim?” foram removidas após esta validação.

## Ambiente e arquivos

A pasta fornecida estava vazia: não havia repositório, framework, dependências ou recursos existentes. Todos os arquivos desta entrega foram criados em `album-romantico`; nenhum arquivo de um projeto anterior foi substituído. A implementação usa HTML, CSS, JavaScript ES Modules, Web Animations API, SVG, HTML Audio e Web Audio API. Não foram instaladas bibliotecas de runtime.

## Verificações executadas

- `npm run check`: passou. Sintaxe de JavaScript e servidor, dez capítulos, campos obrigatórios, seis fotografias locais, fontes locais e áudio WAV válido.
- Sorteio: cem ciclos completos para listas com 1, 2, 12 e 23 mensagens, além de lista vazia. Sem repetição antes de esgotar cada ciclo; sem repetição imediata na fronteira dos ciclos quando há mais de uma mensagem.
- Servidor incluído (`node serve.mjs`): página respondeu HTTP 200; pedido parcial de áudio respondeu HTTP 206, `Content-Range: bytes 100-199/2116844`, exatamente 100 bytes; arquivo ausente respondeu HTTP 404.
- Navegador integrado, servido por HTTP local: tamanhos desktop, 390 × 844 e 320 × 568. Em 320 × 568, o cenário permite rolagem e os controles do livro ficaram acima da navegação depois da rolagem; sem transbordamento horizontal.
- Clique duplo em avançar: permaneceu no capítulo 2, sem saltar para o 3.
- Navegação mantém apenas um cenário ativo; capítulos inativos recebem `hidden`, `inert` e `aria-hidden`.
- Nenhum erro de console observado durante os fluxos testados.

## Capítulos e interações exercitados

| Capítulo | Validação no navegador |
| --- | --- |
| 01 | Fotografia local, entrada e profundidade, luzes, CTA e transição para o convite; layout desktop e celular. |
| 02 | Convite, nomes, selo, mensagem, abertura para a cabine; composição de papel em desktop e celular. |
| 03 | Cortinas, estrutura e lâmpadas, tiras impressas, próxima tira atualizando o indicador, fotos ampliáveis; desktop e celular. |
| 04 | Seis fotografias, entrada escalonada e inclinações, ampliação exibindo a legenda correta e retorno; celular sem transbordamento horizontal. |
| 05 | Três pares de páginas, avanço até 05–06/06, botão de fim desabilitado, retorno de página, perspectiva/rotação/sombra; ampliação e fechamento por Escape; controles alcançáveis em 320 × 568. |
| 06 | Pote clicável, balanço, papéis, saída e abertura do bilhete, mensagem mantida até recolher, novo motivo e contador; navegação bloqueada durante a animação. Sorteio também validado automaticamente em cem ciclos. |
| 07 | Play de áudio real com 48 segundos; progresso avançou, botão mudou para pausa e o disco para estado tocando. Volume foi alterado pelo teclado; busca na faixa chegou a 20%. Ao navegar e voltar, o progresso continuou (de 0:09 a 0:39), com o player ainda tocando. Pausa também exercitada. |
| 08 | Interruptor alternou para “Acender a luz”, estado `lights-off`, estrelas e traçados; fotografias mantêm a ampliação. |
| 09 | Dois disparos consecutivos: contagem de 1 e 2 instantes, fotografias diferentes, flash, ejeção e revelação; primeiro sem som e segundo com som habilitado. Obturador e navegação desabilitados durante a sequência. |
| 10 | Cenário de pôr do sol e cerca, fechamento do cadeado, mensagem “A nossa história continua.” e opção “Reviver nossa história”; replay retornou à abertura. |

## Limites reais

- Fotos, nomes, data, mensagens e instrumental são conteúdo demonstrativo. A personalização está em `dist/config.js`; não foram fornecidos arquivos pessoais do casal.
- Os testes móveis usaram viewport do navegador integrado. Não houve teste em aparelhos físicos nem em Safari/iOS.
- O estado é preservado durante a sessão e a navegação entre capítulos. Recarregar a página reinicia os sorteios, as páginas, as fotografias e o player.
- `prefers-reduced-motion` foi implementado, mas não foi emulado nesta sessão de navegador.
- Não há backend ou editor visual de conteúdo; a configuração é um arquivo separado da lógica.
- Publicação externa não foi concluída: a revisão automática bloqueou a preparação do repositório do Sites, exigindo autorização explícita para esse destino. A aplicação e todos os recursos estão entregues localmente e não dependem dessa publicação para funcionar.

## Arquivos

Criados: `dist/index.html`, `dist/app.js`, `dist/styles.css`, `dist/config.js`, `dist/deck.js`, `dist/assets/*`, `package.json`, `serve.mjs`, `verify.mjs`, `README.md`, `VALIDACAO.md`, `.gitignore` e `.openai/hosting.json`.

Arquivos preexistentes modificados: nenhum. A identidade privada do Sites foi registrada no manifesto; não houve implantação.
