// Conteúdo do álbum. A data e alguns textos ainda aguardam personalização.
export const album = {
  demo: true,
  couple: { firstName: 'Isabel', secondName: 'Pedro', initials: 'I & P', specialDate: '', displayDate: '' },
  opening: { message: 'Clique para abrir essa pequena carta com algumas memórias nossas' },
  invitation: { title: 'Nossa história começa', message: 'Entre tantas pessoas, tantos caminhos e tantos acasos, a vida me trouxe você. Este é um pedacinho do nosso mundo. Feito de memórias, de carinho e de tudo o que ainda vamos viver.', signature: 'Com amor, sempre.' },
  // Fotografias enviadas para o álbum. Legendas e datas podem ser personalizadas.
  photos: [
    { id:'flores', src:'assets/casal-01.jpeg', caption:'Até as cores parecem mais vivas quando estamos juntos.', date:'Um momento para guardar', short:'Nós e todas as cores' },
    { id:'espelho', src:'assets/casal-02.jpeg', caption:'No meio de qualquer dia, encontro meu lugar ao seu lado.', date:'Um momento para guardar', short:'Sempre lado a lado' },
    { id:'buque', src:'assets/casal-03.jpeg', caption:'Há carinho que floresce nos pequenos gestos.', date:'Um momento para guardar', short:'Flores para você' },
    { id:'retrato', src:'assets/casal-04.jpeg', caption:'Você tem esse jeito bonito de ser lar.', date:'Um momento para guardar', short:'Meu lugar favorito' },
    { id:'sorrisos', src:'assets/casal-05.jpeg', caption:'Com você, até uma foto espontânea vira lembrança.', date:'Um momento para guardar', short:'Nosso jeito de sorrir' },
    { id:'flores-pertinho', src:'assets/casal-06.jpeg', caption:'Que a vida nos traga sempre motivos para florescer.', date:'Um momento para guardar', short:'Flores e carinho' },
    { id:'careta', src:'assets/casal-07.jpeg', caption:'Eu amo a leveza de sermos nós mesmos juntos.', date:'Um momento para guardar', short:'Do nosso jeitinho' },
    { id:'descanso', src:'assets/casal-08.jpeg', caption:'A paz mora nesses instantes ao seu lado.', date:'Um momento para guardar', short:'Pertinho de você' },
    { id:'elevador', src:'assets/casal-09.jpeg', caption:'Qualquer passeio fica especial quando é com você.', date:'Um momento para guardar', short:'Mais um dia nosso' },
    { id:'risadas', src:'assets/casal-10.jpeg', caption:'Que nunca nos faltem risadas assim.', date:'Um momento para guardar', short:'A gente se diverte' },
    { id:'juntinhos', src:'assets/casal-11.jpeg', caption:'E eu escolheria você outra vez.', date:'Um momento para guardar', short:'Só eu e você' },
    { id:'abraco', src:'assets/casal-12.jpeg', caption:'O mundo inteiro cabe quando estamos pertinho.', date:'Um momento para guardar', short:'Meu abraço preferido' },
    { id:'viagem', src:'assets/casal-13.jpeg', caption:'Até o caminho vira lembrança com você.', date:'Um momento para guardar', short:'Pelo caminho, juntos' },
    { id:'beijo', src:'assets/casal-14.jpeg', caption:'Alguns instantes dizem tudo sem precisar de palavras.', date:'Um momento para guardar', short:'Um instante de amor' }
  ],
  reasons: [
    'Porque o seu abraço é o meu lugar mais seguro no mundo.',
    'Porque você faz até os dias comuns virarem boas lembranças.',
    'Porque eu amo quem eu sou quando estou com você.',
    'Porque o seu sorriso ainda me faz esquecer o que eu ia dizer.',
    'Porque você escuta até o que eu não consigo colocar em palavras.',
    'Porque dividir a vida com você é a minha aventura preferida.',
    'Porque com você eu aprendi que amor também é paz.',
    'Porque eu escolheria você em todas as nossas versões.',
    'Porque você cuida de mim nos detalhes que quase ninguém vê.',
    'Porque o futuro fica mais bonito quando eu imagino nós dois nele.',
    'Porque você me faz rir bem no meio de um dia difícil.',
    'Porque eu te amo por tudo isso. E por tanto que não cabe num papel.'
  ],
  backgroundMusic: { src:'assets/musica_fundo.mp3', volume:0.55 },
  night: { message:'Mesmo quando tudo escurece, eu encontro luz em você.' },
  ending: { title:'Trancados pra sempre', message:'Se a vida é feita de instantes, eu quero os meus ao seu lado. Que a gente nunca perca esse jeito de se encontrar, todos os dias.', signature:'Você, eu e tudo o que ainda vem.', lockMessage:'A nossa história continua.' },
  chapters: ['O começo de tudo','Um convite para nós','Cabine de Fotos','Álbum de recordações','Por que eu te amo?','Apague a luz...','Sorria, meu amor!','Trancados pra sempre']
};
