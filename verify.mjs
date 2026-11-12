import assert from 'node:assert/strict';
import { readFileSync, statSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { album } from './dist/config.js';
import { createReasonDeck } from './dist/deck.js';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'dist');
const app=readFileSync(resolve(root,'app.js'),'utf8');
assert.equal(album.chapters.length,8);
assert.deepEqual([...app.matchAll(/data-scene="(\d)"/g)].map(match=>Number(match[1])),[0,1,2,3,4,5,6,7]);
assert.ok(album.photos.length>=6);
assert.ok(album.reasons.length>=10);
assert.equal(new Set(album.reasons).size,album.reasons.length);
for(const src of new Set([album.backgroundMusic.src,...album.photos.map(p=>p.src),'assets/serif.ttf','assets/script.ttf'])){
  assert.ok(!src.includes('..')&&!src.startsWith('http'),'Os recursos devem ser locais');
  assert.ok(statSync(resolve(root,src)).size>100,`Recurso ausente: ${src}`);
}
const mp3=readFileSync(resolve(root,album.backgroundMusic.src));
assert.equal(mp3.toString('ascii',0,3),'ID3');
assert.ok(mp3.length>100000);
assert.ok(album.backgroundMusic.volume>0&&album.backgroundMusic.volume<=1);
for(const photo of album.photos){assert.ok(photo.caption);assert.ok(photo.date);assert.ok(photo.short);}
assert.ok(album.couple.firstName&&album.couple.secondName&&album.couple.initials);
// Test observable guarantees, including complete cycles and edge cases.
for (const size of [0,1,2,12,23]) {
  const items=Array.from({length:size},(_,i)=>`reason-${i}`);
  let seed=1327;
  const rng=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646;};
  const deck=createReasonDeck(items,rng);
  if (!size) {assert.equal(deck.draw(),null);continue;}
  let last;
  for (let cycle=0;cycle<100;cycle++) {
    const seen=new Set();
    for(let i=0;i<size;i++){
      const value=deck.draw();assert.ok(items.includes(value.value));
      assert.ok(!seen.has(value.index),'Uma mensagem repetiu antes de esgotar o ciclo');
      if(size>1)assert.notEqual(value.index,last,'Repetição imediata entre ciclos');
      seen.add(value.index);last=value.index;assert.equal(value.remaining,size-i-1);
    }
    assert.equal(seen.size,size);
  }
}
console.log('PASS: 8 capítulos, configuração completa, 12 motivos únicos, fotografias/fontes locais e MP3 válido.');
console.log('PASS: sorteio sem repetição em 100 ciclos para 1, 2, 12 e 23 mensagens; lista vazia segura.');
