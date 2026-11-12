import { album as c } from './config.js';
import { createReasonDeck } from './deck.js';

const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const esc = value => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
const state = { chapter:0, phase:'entering', strip:0, spread:0, pageBusy:false, bag:[], drawn:0, lastReason:-1, paper:false, drawing:false, shot:0, printing:false, locked:false };
const reasons = createReasonDeck(c.reasons);
const backgroundMusic = document.createElement('audio');
backgroundMusic.id = 'background-music';
backgroundMusic.src = c.backgroundMusic.src;
backgroundMusic.preload = 'none';
backgroundMusic.loop = true;
backgroundMusic.volume = c.backgroundMusic.volume;
document.body.append(backgroundMusic);
let returnFocus;
const heart = '<path d="M50 87C39 77 7 57 8 32 9 9 39 6 50 30 63 5 92 10 92 33 92 57 62 77 50 87Z"/>';
const flourish = '<span class="flourish" aria-hidden="true">── ◇ ──</span>';
const lights = (n=22, cls='') => `<div class="fairy-lights ${cls}" aria-hidden="true">${Array.from({length:n},(_,i)=>`<i style="--i:${i};--drop:${18+(i*37)%72}%"></i>`).join('')}</div>`;
function photoStyle(p) {
  const url = String(p.src).replace(/["'()<>\n\r]/g,'');
  return `background-image:url('${url}');${Number.isInteger(p.tile)?`background-size:300% 200%;background-position:${p.tile%3*50}% ${Math.floor(p.tile/3)*100}%`:''}`;
}
function photo(p,index,extra='') {return `<button class="polaroid ${extra}" data-photo="${index}" style="--tilt:${[-7,5,-3,6,-5,4][index%6]}deg;--i:${index}" aria-label="Ampliar: ${esc(p.short)}"><span class="photo-image" role="img" aria-label="${esc(p.short)}" style="${photoStyle(p)}"></span><span class="photo-caption">${esc(p.short)}</span></button>`;}
const title = (n,heading,sub='') => `<div class="scene-heading reveal"><p class="eyebrow">CAPÍTULO ${String(n).padStart(2,'0')} ${flourish}</p><h1 tabindex="-1">${esc(heading)}</h1>${sub?`<p class="scene-subtitle">${esc(sub)}</p>`:''}</div>`;
const sections = [
  `<section class="scene intro active" data-scene="0">${lights(12,'vertical-lights')}<div class="scene-body opening-body"><div class="opening-stage reveal"><h1 class="sr-only" tabindex="-1">Uma pequena carta para nós</h1><p class="opening-eyebrow">UMA CARTA PARA NÓS</p><button id="opening-letter" class="opening-letter" data-advance aria-label="Abrir esta pequena carta"><span class="opening-letter-inside" aria-hidden="true"><span>${esc(c.couple.firstName)} &amp; ${esc(c.couple.secondName)}</span><strong>Nossa história começa aqui.</strong><small>Com amor, sempre.</small></span><span class="opening-letter-front"><span class="opening-letter-border"><span class="opening-letter-kicker">PARA VOCÊ, COM CARINHO</span><span class="opening-letter-message">${esc(c.opening.message)}</span><span class="opening-letter-seal" aria-hidden="true">${esc(c.couple.initials)}</span></span></span></button><p class="opening-hint">Toque na carta para abrir <span aria-hidden="true">↗</span></p></div></div></section>`,
  `<section class="scene invitation-scene" data-scene="1" hidden><div class="heart-wall" aria-hidden="true"></div><div class="scene-body invitation-body"><div class="envelope-shadow"></div><article class="invitation reveal"><div class="invitation-border"><p class="letter-kicker">UMA HISTÓRIA ESCRITA A DOIS</p><div class="wax-seal">${esc(c.couple.initials)}</div><h1 tabindex="-1">${esc(c.invitation.title)}</h1><h2>${esc(c.couple.firstName)} <em>&</em> ${esc(c.couple.secondName)}</h2>${flourish}<p class="letter-message">${esc(c.invitation.message)}</p><p class="letter-signature">${esc(c.invitation.signature)}</p><button class="letter-open" data-advance>Abra este pedacinho de nós <span>→</span></button>${c.couple.displayDate ? `<p class="letter-date">${esc(c.couple.displayDate)}</p>` : ''}</div></article><div class="dried-branch" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div></div></section>`,
  `<section class="scene booth-scene" data-scene="2" hidden><div class="scene-body">${title(3,'Cabine de Fotos','Entre, chegue mais perto. Aqui a gente guarda sorrisos.')}<div class="booth reveal"><div class="booth-marquee">${lights(18)}<span>CABINE DE FOTOS</span><small>LEMBRANÇAS QUE NÃO DESBOTAM</small></div><div class="booth-interior"><div class="booth-strips" id="booth-strips"></div><div class="curtain curtain-left" aria-hidden="true"></div><div class="curtain curtain-right" aria-hidden="true"></div></div><div class="booth-bottom"><button class="small-arrow" id="strip-prev" aria-label="Tira anterior">←</button><span id="strip-count">TIRA 01 / ${String(Math.ceil(c.photos.length/2)).padStart(2,'0')}</span><button class="small-arrow" id="strip-next" aria-label="Próxima tira">→</button></div></div><p class="under-object">Toque em uma fotografia para ficar um pouquinho mais.</p></div></section>`,
  `<section class="scene album-scene wood-scene" data-scene="3" hidden><div class="scene-body">${title(4,'Álbum de recordações','Se eu pudesse guardar o tempo, ele teria essas páginas.')}<div class="book-perspective reveal"><div class="book" id="book"><div class="book-cover"></div><div id="book-pages" class="book-pages"></div><div class="book-spine" aria-hidden="true"></div><div class="page-turn-layer" aria-hidden="true"></div></div></div><div class="book-controls"><button id="page-prev" class="text-link">← Página anterior</button><span id="page-count"></span><button id="page-next" class="text-link">Virar a página →</button></div></div></section>`,
  `<section class="scene reasons-scene wood-scene" data-scene="4" hidden><div class="wall-paper" aria-hidden="true"></div><div class="table-surface" aria-hidden="true"></div><div class="table-drawer" aria-hidden="true"><i></i></div><div class="scene-body">${title(5,'Por que eu te amo?','Algumas das infinitas respostas cabem aqui.')}<div class="jar-stage reveal"><div class="jar-shadow"></div><button class="jar-object" id="jar" aria-label="Retirar um motivo do pote"><div class="jar-cork"></div><div class="jar-mouth"></div><div class="jar-glass"><div class="jar-papers">${Array.from({length:20},(_,i)=>`<i style="--x:${8+(i*29)%68}%;--y:${17+(i*37)%66}%;--r:${i*43}deg;--paper:${['#d7a8a2','#e1ce94','#aebca3','#c2b1c9'][i%4]}"></i>`).join('')}</div><div class="jar-reflection"></div><div class="jar-base"></div></div><span class="jar-twine"></span><span class="jar-tag">razões para<br><strong>te amar</strong><small>${esc(c.couple.initials)}</small></span></button><p class="jar-instruction">Aperte o pote!<span>↗</span></p></div><p class="reason-count" id="reason-count">Um potinho cheio de nós.</p><div class="reason-flight" hidden><div class="reason-paper"><span class="paper-fold fold-left"></span><span class="paper-fold fold-right"></span><span class="paper-number"></span><p class="reason-message"></p><button class="paper-close">Dobrar e guardar <span>↙</span></button></div></div></div></section>`,
  `<section class="scene night-scene" data-scene="5" hidden><div class="vintage-frame" aria-hidden="true"></div><div class="night-glow" aria-hidden="true"></div><div class="stars" aria-hidden="true">${Array.from({length:55},(_,i)=>`<i style="--x:${(i*37)%100}%;--y:${(i*23)%100}%;--i:${i}"></i>`).join('')}</div><div class="scene-body">${title(6,'Apague a luz...',c.night.message)}<button id="light-switch" class="light-switch" aria-pressed="false"><span class="switch-lever"></span><span class="switch-label">Apagar a luz</span></button><div class="constellation"><svg class="constellation-lines" viewBox="0 0 1000 480" fill="none" aria-hidden="true"><path d="M130 120 345 75 500 220 700 65 870 150 735 375 500 220 275 365 130 120"/><path class="glowing-heart" d="M500 300C460 268 397 230 410 188 422 150 478 156 500 190 525 150 577 155 588 190 600 231 535 280 500 300Z"/></svg>${c.photos.slice(0,5).map((p,i)=>photo(p,i,`star-photo star-photo-${i}`)).join('')}<p class="night-whisper">o nosso amor ilumina.</p></div></div></section>`,
  `<section class="scene camera-scene" data-scene="6" hidden><div class="camera-flash" aria-hidden="true"></div><div class="scene-body">${title(7,'Sorria, meu amor!','Porque o meu instante preferido é agora, com você.')}<div class="camera-stage reveal"><div class="instant-camera"><div class="camera-top"><div class="flash-unit"><i></i><i></i><i></i><i></i></div><div class="viewfinder"></div><span class="camera-brand">ENTRE NÓS <small>INSTANT 600</small></span></div><div class="camera-front"><div class="camera-rainbow" aria-hidden="true"></div><div class="camera-lens"><div class="lens-ring"><div class="lens-glass"></div></div><span>MEMORY LENS · 80 MM</span></div><button id="shutter" class="shutter" aria-label="Fotografar uma nova recordação"></button><div class="camera-meter" aria-hidden="true">${[1,2,3].map(()=>'<i></i>').join('')}</div></div><div class="camera-slot"></div><div class="blank-print" aria-hidden="true"></div></div><div class="photo-printer" id="photo-printer" aria-live="polite"></div></div><p class="camera-instruction" id="camera-instruction">Aperte o botão vermelho. Guarde um instante.</p><div class="developed-rack" id="developed-rack"></div></div></section>`,
  `<section class="scene ending-scene" data-scene="7" hidden><div class="sunset-sky" aria-hidden="true"><div class="sun"></div><div class="sunset-cloud cloud-one"></div><div class="sunset-cloud cloud-two"></div></div><div class="skyline" aria-hidden="true">${Array.from({length:32},(_,i)=>`<i style="--h:${20+(i*31)%95}px;--w:${18+(i*17)%35}px"></i>`).join('')}</div><div class="fence" aria-hidden="true"></div><div class="scene-body ending-body">${title(8,c.ending.title)}<p class="ending-message reveal">${esc(c.ending.message)}</p><button class="heart-lock reveal" id="heart-lock" aria-label="Fechar nosso cadeado" aria-pressed="false"><svg viewBox="0 0 220 260" aria-hidden="true"><defs><linearGradient id="gold" x1="0" x2="1" y2="1"><stop stop-color="#795021"/><stop offset=".27" stop-color="#f6dc93"/><stop offset=".5" stop-color="#c7994c"/><stop offset=".75" stop-color="#f1d79b"/><stop offset="1" stop-color="#76501e"/></linearGradient><linearGradient id="goldEdge"><stop stop-color="#754618"/><stop offset=".5" stop-color="#d9a84e"/><stop offset="1" stop-color="#674115"/></linearGradient></defs><path class="lock-shackle" d="M68 122V63C68 7 155 7 155 63V116" fill="none" stroke="url(#gold)" stroke-width="15"/><path d="M110 244C92 228 20 179 18 141 14 91 85 87 110 128 142 86 206 95 203 142 200 185 126 235 110 244Z" fill="url(#goldEdge)" transform="translate(0,5)"/><path d="M110 238C92 222 20 173 18 135 14 85 85 81 110 122 142 80 206 89 203 136 200 179 126 229 110 238Z" fill="url(#gold)" stroke="#eacf85"/><path d="M110 222C90 205 34 166 32 135 30 101 86 99 110 139 137 99 189 102 188 136 185 169 126 214 110 222Z" fill="none" stroke="#835a2a" opacity=".45"/><text x="110" y="170" text-anchor="middle">${esc(c.couple.firstName[0] + " & " + c.couple.secondName[0])}</text><path d="M107 184h6v12h-6z" fill="#6b431f"/><circle cx="110" cy="182" r="5" fill="#6b431f"/></svg></button><p class="lock-instruction" id="lock-instruction">Toque no cadeado. Guarde o nosso para sempre.</p><p class="ending-signature reveal">${esc(c.ending.signature)}</p><button class="replay text-link" id="replay" hidden>↶ Reviver nossa história</button></div></section>`
];
$('#experience').innerHTML = sections.join('');
const scenes = $$('.scene');
scenes.forEach((el,i)=>{el.inert=i!==0; el.setAttribute('aria-hidden',String(i!==0));});
$('.chapter-dots').innerHTML = c.chapters.map((name,i)=>`<button data-chapter="${i}" aria-label="Capítulo ${i+1}: ${esc(name)}" ${i===0?'aria-current="step"':''}><span></span></button>`).join('');

function animate(el, frames, duration=700, options={}) {
  if (!el) return Promise.resolve();
  const a=el.animate(frames,{duration:reduce.matches?1:duration,easing:'cubic-bezier(.22,.68,.22,1)',fill:'both',...options});
  return a.finished.then(()=>a.cancel()).catch(()=>{});
}
const entry = [
  [{opacity:0,transform:'scale(1.04)'},{opacity:1,transform:'scale(1)'}],
  [{opacity:0,transform:'translateY(65px) rotate(-3deg) scale(.92)'},{opacity:1,transform:'none'}],
  [{opacity:0,transform:'translateY(30px)'},{opacity:1,transform:'none'}],
  [{opacity:0,transform:'perspective(1400px) rotateX(16deg) translateY(55px)'},{opacity:1,transform:'none'}],
  [{opacity:0,transform:'translateY(55px)'},{opacity:1,transform:'none'}],
  [{opacity:0,filter:'blur(8px)'},{opacity:1,filter:'blur(0px)'}],
  [{opacity:0,transform:'translateY(50px) scale(.93)'},{opacity:1,transform:'none'}],
  [{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'none'}]
];
const exit = [
  [{opacity:1,transform:'scale(1)'},{opacity:0,transform:'scale(1.1)'}],
  [{opacity:1,transform:'none'},{opacity:0,transform:'translateY(-50px) rotate(4deg)'}],
  [{opacity:1,transform:'none'},{opacity:0,transform:'perspective(1000px) rotateY(-25deg) translateX(-80px)'}],
  [{opacity:1,transform:'none'},{opacity:0,transform:'perspective(1300px) rotateY(-75deg)'}],
  [{opacity:1,transform:'none'},{opacity:0,transform:'translateY(65px)'}],
  [{opacity:1,filter:'brightness(1)'},{opacity:0,filter:'brightness(2)'}],
  [{opacity:1,filter:'sepia(0)'},{opacity:0,filter:'sepia(1) brightness(1.8)'}],
  [{opacity:1},{opacity:0}]
];
function updateNavigation() {
  const busy=state.phase!=='idle'||state.drawing||state.pageBusy||state.printing;
  $('#current-number').textContent=String(state.chapter+1).padStart(2,'0');
  $('#chapter-name').textContent=c.chapters[state.chapter];
  $('#previous').disabled=state.chapter===0||busy;
  $('#next').disabled=state.chapter===scenes.length-1||busy;
  $('#next').hidden=state.chapter===scenes.length-1;
  $$('.chapter-dots button').forEach((b,i)=>{b.toggleAttribute('data-visited',i<state.chapter); b.setAttribute('aria-current',i===state.chapter?'step':'false');b.disabled=busy;});
  $('#experience').setAttribute('aria-busy',String(busy));
}
async function enter(i) {
  const scene=scenes[i], body=$('.scene-body',scene);
  scene.classList.add('entering');
  const reveals=$$(i===1?'.invitation,.wax-seal,.invitation h1,.invitation h2,.letter-message,.letter-signature,.letter-open':'.reveal',scene);
  await Promise.all([
    animate(scene,[{opacity:0},{opacity:1}],1050),
    animate(body,entry[i],1050),
    ...reveals.map((el,k)=>animate(el,[{opacity:0,transform:'translateY(22px)'},{opacity:1,transform:'none'}],750,{delay:reduce.matches?0:180+k*120})),
    i===2?Promise.all($$('.curtain',scene).map((el,k)=>animate(el,[{transform:'scaleX(1)'},{transform:`scaleX(.18)`}],1400,{delay:reduce.matches?0:300}))):Promise.resolve()
  ]);
  scene.classList.remove('entering');
}
async function go(i) {
  if(state.phase!=='idle'||state.drawing||state.pageBusy||state.printing||i<0||i>=scenes.length||i===state.chapter)return;
  if(state.chapter===0 && i===1){
    state.phase='opening';updateNavigation();
    const letter=$('#opening-letter');
    if(backgroundMusic.paused){
      void backgroundMusic.play().catch(()=>{
        $('#announcer').textContent='Não foi possível iniciar a música neste navegador.';
      });
    }
    await Promise.all([
      animate($('.opening-letter-front',letter),[{transform:'rotateY(0deg)'},{transform:'rotateY(-165deg)'}],1050),
      animate(letter,[{transform:'translateY(0) scale(1)'},{transform:'translateY(-12px) scale(1.03)'}],1050)
    ]);
    letter.classList.add('opened');state.phase='idle';
  }
  if(state.paper) await closePaper();
  if(!$('#photo-viewer').hidden) closePhoto();
  state.phase='exiting'; updateNavigation();
  const old=scenes[state.chapter]; old.inert=true;
  await animate(old,exit[state.chapter],650);
  old.hidden=true;old.classList.remove('active');old.setAttribute('aria-hidden','true');
  state.chapter=i;state.phase='entering';
  const next=scenes[i];if(i===0)$('#opening-letter').classList.remove('opened');next.hidden=false;next.classList.add('active');next.setAttribute('aria-hidden','false');
  updateNavigation();
  await enter(i);
  state.phase='idle';next.inert=false;updateNavigation();
  $('#announcer').textContent=`Capítulo ${i+1}: ${c.chapters[i]}`;
  $('h1',next)?.focus({preventScroll:true});
}
document.addEventListener('click',e=>{
  if(e.target.closest('[data-advance]'))go(state.chapter+1);
  const dot=e.target.closest('[data-chapter]'); if(dot)go(Number(dot.dataset.chapter));
  const p=e.target.closest('[data-photo]');if(p&&state.phase==='idle')openPhoto(Number(p.dataset.photo),p);
});
$('#previous').addEventListener('click',()=>go(state.chapter-1));
$('#next').addEventListener('click',()=>go(state.chapter+1));
$('#replay').addEventListener('click',()=>go(0));
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){if(!$('#photo-viewer').hidden)closePhoto();else if(state.paper)closePaper();return;}
  if(e.target.matches('input,textarea,select,button')||!$('#photo-viewer').hidden||state.paper)return;
  if(e.key==='ArrowRight')go(state.chapter+1);
  if(e.key==='ArrowLeft')go(state.chapter-1);
});

function openPhoto(index,trigger){
  const p=c.photos[index];if(!p)return;returnFocus=trigger;
  const viewer=$('#photo-viewer');$('.enlarged-image',viewer).setAttribute('style',photoStyle(p));
  $('.enlarged-image',viewer).setAttribute('role','img');$('.enlarged-image',viewer).setAttribute('aria-label',p.short);
  $('figcaption',viewer).textContent=p.caption;$('.photo-date',viewer).textContent=p.date;
  viewer.hidden=false;$('#experience').inert=true;$('.navigation').inert=true;
  animate($('.enlarged-polaroid'),[{opacity:0,transform:'scale(.7) rotate(-7deg)'},{opacity:1,transform:'scale(1) rotate(-2deg)'}],550);
  $('.viewer-close').focus();
}
function closePhoto(){const v=$('#photo-viewer');v.hidden=true;$('#experience').inert=false;$('.navigation').inert=false;returnFocus?.focus();}
$('.viewer-close').addEventListener('click',closePhoto);
$('#photo-viewer').addEventListener('click',e=>{if(e.target.id==='photo-viewer')closePhoto();});
$('#photo-viewer').addEventListener('keydown',e=>{if(e.key==='Tab'){e.preventDefault();$('.viewer-close').focus();}});

function renderStrips(){
  $('#booth-strips').innerHTML=[0,1].map((_,side)=>`<div class="photo-strip" style="--tilt:${side?-7:5}deg">${[0,1,2].map((_,row)=>{const i=(state.strip*2+side+row*2)%c.photos.length;return photo(c.photos[i],i);}).join('')}<span>${esc(c.couple.initials)} · POUR TOUJOURS</span></div>`).join('');
  $('#strip-count').textContent=`TIRA ${String(state.strip+1).padStart(2,'0')} / ${String(Math.ceil(c.photos.length/2)).padStart(2,'0')}`;
}
async function changeStrip(direction){
  if(state.phase!=='idle'||state.stripBusy)return;state.stripBusy=true;
  await animate($('#booth-strips'),[{opacity:1,transform:'translateY(0)'},{opacity:0,transform:`translateY(${direction*40}px)`}],270);
  state.strip=(state.strip+direction+Math.ceil(c.photos.length/2))%Math.ceil(c.photos.length/2);renderStrips();
  await animate($('#booth-strips'),[{opacity:0,transform:`translateY(${-direction*40}px)`},{opacity:1,transform:'translateY(0)'}],500);state.stripBusy=false;
}
$('#strip-prev').addEventListener('click',()=>changeStrip(-1));$('#strip-next').addEventListener('click',()=>changeStrip(1));renderStrips();

function spreadMarkup(spread){
  return [0,1].map(side=>{const i=(spread*2+side)%c.photos.length,p=c.photos[i];return `<div class="book-page ${side?'right-page':'left-page'}"><span class="page-kicker">${side?'ET TOUT LE RESTE':'PETITS BONHEURS'}</span>${photo(p,i)}<p class="book-caption">${esc(p.caption)}</p><span class="page-number">${spread*2+side+1}</span><span class="tape" aria-hidden="true"></span>${side?'<svg class="book-doodle" viewBox="0 0 100 95" fill="none" stroke="currentColor">'+heart+'</svg>':''}</div>`;}).join('');
}
function renderBook(){
  $('#book-pages').innerHTML=spreadMarkup(state.spread);
  $('#page-count').textContent=`${String(state.spread*2+1).padStart(2,'0')} — ${String(state.spread*2+2).padStart(2,'0')} / ${String(Math.ceil(c.photos.length/2)*2).padStart(2,'0')}`;
  $('#page-prev').disabled=state.spread===0||state.pageBusy;$('#page-next').disabled=state.spread===Math.ceil(c.photos.length/2)-1||state.pageBusy;
}
async function turnPage(dir){
  const target=state.spread+dir;if(state.pageBusy||target<0||target>=Math.ceil(c.photos.length/2))return;
  state.pageBusy=true;updateNavigation();const layer=$('.page-turn-layer');
  const source=$(dir>0?'.right-page':'.left-page').cloneNode(true);source.querySelectorAll('button').forEach(b=>b.disabled=true);
  layer.replaceChildren(source);layer.style.left=dir>0?'50%':'0';layer.style.transformOrigin=dir>0?'left center':'right center';layer.hidden=false;
  state.spread=target;renderBook();
  await animate(layer,[{transform:'rotateY(0deg)',filter:'brightness(1)',boxShadow:'0 4px 6px #0003'},{transform:`rotateY(${dir*-75}deg)`,filter:'brightness(.68)',boxShadow:'-30px 12px 30px #0008',offset:.5},{transform:`rotateY(${dir*-179}deg)`,filter:'brightness(.9)',boxShadow:'0 0 0 #0000'}],1150);
  layer.hidden=true;layer.replaceChildren();state.pageBusy=false;renderBook();updateNavigation();
}
$('#page-prev').addEventListener('click',()=>turnPage(-1));$('#page-next').addEventListener('click',()=>turnPage(1));renderBook();$('.page-turn-layer').hidden=true;

async function drawReason(){
  if(state.phase!=='idle'||state.paper||state.drawing||!c.reasons.length)return;
  state.drawing=true;updateNavigation();$('#jar').disabled=true;$('#jar').classList.add('shaking');
  await animate($('#jar'),[{transform:'rotate(0deg)'},{transform:'rotate(-7deg)',offset:.2},{transform:'rotate(6deg)',offset:.45},{transform:'rotate(-3deg)',offset:.7},{transform:'rotate(0deg)'}],700);
  $('#jar').classList.remove('shaking');
  const drawn=reasons.draw(),index=drawn.index;state.drawn++;
  $('.reason-message').textContent=drawn.value;$('.paper-number').textContent=`MOTIVO ${String(index+1).padStart(2,'0')} · ${c.couple.initials}`;
  $('.reason-paper').style.setProperty('--note-color',['#e6b8ae','#e1cf9d','#bdcbb5','#d1bfd1'][index%4]);
  $('.reason-flight').hidden=false;state.paper=true;
  await Promise.all([
    animate($('.jar-cork'),[{transform:'translateY(0) rotate(0)'},{transform:'translateY(-48px) rotate(-17deg)',offset:.35},{transform:'translateY(-48px) rotate(-17deg)',offset:.7},{transform:'translateY(0) rotate(0)'}],1300),
    animate($('.reason-flight'),[{opacity:0,transform:'translate(-50%,95px) scale(.13) rotate(-24deg)'},{opacity:1,transform:'translate(-50%,-180px) scale(.3) rotate(12deg)',offset:.45},{opacity:1,transform:'translate(-50%,-50%) scale(1) rotate(-2deg)'}],1100)
  ]);
  await Promise.all([animate($('.fold-left'),[{transform:'rotateY(0)'},{transform:'rotateY(-178deg)'}],550),animate($('.fold-right'),[{transform:'rotateY(0)'},{transform:'rotateY(178deg)'}],600),animate($('.reason-message'),[{opacity:0},{opacity:1}],650,{delay:200})]);
  $('.reason-paper').classList.add('unfolded');state.drawing=false;updateNavigation();
  $('#reason-count').textContent=`${state.drawn} ${state.drawn===1?'motivo descoberto':'motivos descobertos'} · ${reasons.remaining} ainda neste ciclo`;
  $('.paper-close').focus();
}
async function closePaper(){
  if(!state.paper||state.drawing)return;state.drawing=true;updateNavigation();
  await animate($('.reason-flight'),[{opacity:1,transform:'translate(-50%,-50%) scale(1) rotate(-2deg)'},{opacity:0,transform:'translate(-50%,90px) scale(.1) rotate(16deg)'}],650);
  $('.reason-flight').hidden=true;$('.reason-paper').classList.remove('unfolded');state.paper=false;state.drawing=false;$('#jar').disabled=false;$('#jar').focus();updateNavigation();
}
$('#jar').addEventListener('click',drawReason);$('.paper-close').addEventListener('click',closePaper);

$('#light-switch').addEventListener('click',()=>{
  const dark=scenes[5].classList.toggle('lights-off');$('#light-switch').setAttribute('aria-pressed',String(dark));$('.switch-label').textContent=dark?'Acender a luz':'Apagar a luz';
});

async function takePhoto(){
  if(state.printing||state.phase!=='idle')return;state.printing=true;updateNavigation();$('#shutter').disabled=true;
  const i=state.shot%c.photos.length,p=c.photos[i];
  $('.instant-camera').classList.add('clicked');
  animate($('.camera-flash'),[{opacity:0},{opacity:.95,offset:.12},{opacity:0}],600);
  await animate($('.instant-camera'),[{transform:'translateY(0)'},{transform:'translateY(4px) rotate(-1deg)',offset:.3},{transform:'translateY(0)'}],300);
  $('#camera-instruction').textContent='Um pouquinho de paciência… as melhores memórias ficam.';
  $('#photo-printer').innerHTML=photo(p,i,'new-print');const print=$('.new-print');print.disabled=true;
  const img=$('.photo-image',print);
  await Promise.all([animate(print,[{transform:'translate(-50%,-150px) rotate(0deg)'},{transform:'translate(-50%,40px) rotate(5deg)'}],2200),animate(img,[{filter:'brightness(3) contrast(0) sepia(.3)',opacity:.12},{filter:'brightness(1.8) contrast(.4) sepia(.25)',opacity:.7,offset:.5},{filter:'brightness(1) contrast(1) sepia(.2)',opacity:1}],4200)]);
  const rack=$('#developed-rack');rack.insertAdjacentHTML('beforeend',photo(p,i,'developed-photo'));
  if(rack.children.length>3)rack.firstElementChild.remove();
  const destination=rack.lastElementChild,from=print.getBoundingClientRect(),to=destination.getBoundingClientRect();
  destination.style.opacity='0';
  const flying=print.cloneNode(true);flying.className='polaroid flying-print';
  flying.style.cssText=`position:fixed;left:${from.left}px;top:${from.top}px;width:${from.width}px;z-index:60;pointer-events:none;transform:none;transform-origin:top left;`;
  document.body.append(flying);print.style.opacity='0';
  await animate(flying,[{transform:'translate(0,0) scale(1) rotate(5deg)'},{transform:`translate(${to.left-from.left}px,${to.top-from.top}px) scale(${to.width/from.width}) rotate(${[-7,5,-3][state.shot%3]}deg)`}],850);
  flying.remove();destination.style.opacity='';
  $('#photo-printer').replaceChildren();$('.instant-camera').classList.remove('clicked');state.shot++;state.printing=false;$('#shutter').disabled=false;updateNavigation();
  $('#camera-instruction').textContent=`${state.shot} ${state.shot===1?'instante guardado':'instantes guardados'}. Vamos guardar mais um?`;
}
$('#shutter').addEventListener('click',takePhoto);
$('#heart-lock').addEventListener('click',async()=>{
  if(state.locked)return;state.locked=true;$('#heart-lock').setAttribute('aria-pressed','true');$('#heart-lock').classList.add('locked');
  await animate($('.lock-shackle'),[{transform:'translateY(-15px) rotate(-13deg)'},{transform:'translateY(0) rotate(0deg)'}],800);
  $('#lock-instruction').textContent=c.ending.lockMessage;$('#replay').hidden=false;
  animate($('.ending-signature'),[{opacity:0},{opacity:1}],1200);
});

// Expose only observable state for verification, never controls or hidden shortcuts.
Object.defineProperty(window,'albumStatus',{get:()=>Object.freeze({chapter:state.chapter+1,phase:state.phase,drawn:state.drawn,reasonsRemaining:reasons.remaining,shot:state.shot,printing:state.printing,spread:state.spread,locked:state.locked})});
updateNavigation();
enter(0).then(()=>{state.phase='idle';updateNavigation();});
