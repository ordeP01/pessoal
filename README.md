# Entre nós — álbum romântico interativo

Aplicação web completa em HTML, CSS, JavaScript ES Modules, SVG e Web Animations API. Não requer instalação de dependências. Os objetos são construídos em código; as fotografias são apenas conteúdo do álbum.

## Executar

Requer Node.js 18 ou superior.

```powershell
npm start
```

Abra http://127.0.0.1:4173. Use `PORT=...` no ambiente para escolher outra porta. Os módulos JavaScript precisam de um servidor HTTP; não abra o HTML por `file://`.

Para verificar sintaxe, configuração e integridade dos recursos: `npm run check`.

## Personalizar

Edite `dist/config.js` para alterar os nomes, iniciais, data, convite, fotografias, legendas, datas, motivos, música de fundo e mensagem final. Os nomes já são Isabel e Pedro; a data ainda não foi informada.

- As 14 fotografias enviadas estão em `dist/assets/casal-01.jpeg` até `casal-14.jpeg`, com os originais preservados em `fotos/`.
- Cada fotografia possui `id`, `src`, `caption`, `date` e `short`.
- Mantenha pelo menos seis fotografias para a composição da cabine e do livro.
- A capa é uma carta interativa sem fotografia; as fotos aparecem nos capítulos seguintes.
- `musica_fundo.mp3` toca em loop somente depois que a carta inicial é aberta. A cópia servida pelo site fica em `dist/assets/`; o volume está em `backgroundMusic.volume`.
- `reasons` aceita qualquer quantidade de mensagens. O sorteio embaralha a lista inteira antes de repetir, evitando também uma repetição imediata entre ciclos quando há mais de um motivo.
- Ajuste `demo` para `false` depois de personalizar.

## Os oito capítulos

1. Carta centralizada com a mensagem de abertura; ao toque, ela se desdobra antes de revelar o convite.
2. Convite em papel texturizado com moldura, selo de cera e abertura da história.
3. Cabine de madeira, lâmpadas, cortinas animadas e sete pares de tiras fotográficas navegáveis.
4. Livro aberto, lombada, papel envelhecido e sete pares de páginas; a virada usa `rotateY`, perspectiva e sombra dinâmica.
5. Pote transparente com reflexos, cortiça, barbante e papéis; o bilhete sai do pote, abre suas dobras, mantém a mensagem e volta para o pote.
6. Interruptor, estrelas, fotos flutuantes, linhas SVG desenhadas e coração luminoso; as fotografias também ampliam.
7. Câmera com obturador, lente, flash, ejeção progressiva e revelação da fotografia; permite novas fotos.
8. Pôr do sol em camadas, silhueta urbana, cerca, coração metálico com iniciais e fechamento do cadeado.

## Estados e acessibilidade

A navegação passa por `idle → exiting → entering → idle`, com um estado `opening` enquanto a carta inicial abre. Novos comandos são bloqueados durante as transições e animações de objetos que precisam terminar. A música começa ao abrir a carta e continua entre os capítulos; páginas, papéis sorteados e fotos reveladas permanecem durante a sessão. Recarregar a página reinicia a experiência.

Botões semânticos, foco visível, descrição dos objetos, controles por teclado, anúncio do capítulo e foco preso na ampliação de fotos. As setas esquerda/direita navegam quando o foco não está em um controle. Escape fecha a foto ampliada ou recolhe o papel. O sistema respeita `prefers-reduced-motion`; o vinil mantém apenas a indicação funcional de reprodução.

## Estrutura

```text
dist/
  index.html       estrutura, navegação e ampliador
  config.js        conteúdo personalizável
  app.js           cenários, estados, animações e interações
  deck.js          sorteio de motivos sem repetição entre ciclos
  styles.css       materiais, objetos, iluminação e layouts responsivos
  assets/          fotografias, fontes, ícone e música locais
serve.mjs          servidor local
verify.mjs         validação de configuração e recursos
VALIDACAO.md       resultados e limites da validação
```

## Recursos e créditos

As fotografias foram fornecidas para este álbum. A data em `config.js` está vazia até ser informada. Fontes: Cormorant Garamond e Caveat, distribuídas pelo Google Fonts. Todos os recursos usados na aplicação são locais: não há dependência de CDN durante a visita.

Fontes tipográficas: https://fonts.google.com/specimen/Cormorant+Garamond e https://fonts.google.com/specimen/Caveat.

Nenhum objeto da interface usa imagens geradas por IA.

## Implantação

O conteúdo de `dist/` é estático e pode ser hospedado em qualquer serviço que sirva HTML e ES Modules. A aplicação não possui backend, rastreamento ou coleta de dados.
