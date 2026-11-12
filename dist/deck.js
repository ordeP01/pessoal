// A bag is exhausted before a new cycle starts. Its final item never immediately
// repeats at the cycle boundary unless the deck contains only one item.
export function createReasonDeck(items, random = Math.random) {
  let bag = [], last = -1;
  return {
    get remaining() { return bag.length; },
    draw() {
      if (!items.length) return null;
      if (!bag.length) {
        bag = items.map((_,i)=>i);
        for (let i=bag.length-1;i>0;i--) {
          const j=Math.floor(random()*(i+1));
          [bag[i],bag[j]]=[bag[j],bag[i]];
        }
        if (bag.length>1 && bag.at(-1)===last) {
          [bag[0],bag[bag.length-1]]=[bag.at(-1),bag[0]];
        }
      }
      const index=bag.pop(); last=index;
      return { index, value:items[index], remaining:bag.length };
    }
  };
}
