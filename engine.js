/* The numeric card IDs are taken directly from the source workbook. */
const Engine = (() => {
 const row=i=>Math.floor(i/7),col=i=>i%7;
 function bounds(board){const positions=board.map((t,i)=>t?i:null).filter(i=>i!==null);return {top:Math.min(...positions.map(row)),bottom:Math.max(...positions.map(row)),left:Math.min(...positions.map(col)),right:Math.max(...positions.map(col))};}
 function context(board,p){
  const all=board.map((t,i)=>t?{...t,p:i}:null).filter(Boolean);
  const r=all.filter(t=>row(t.p)===row(p)),c=all.filter(t=>col(t.p)===col(p));
  const adjacent=(a,b)=>Math.abs(row(a)-row(b))+Math.abs(col(a)-col(b))===1;
  const a=all.filter(t=>adjacent(t.p,p));
  const d=all.filter(t=>Math.abs(row(t.p)-row(p))===Math.abs(col(t.p)-col(p)));
  const union=(...sets)=>[...new Map(sets.flat().map(t=>[t.p,t])).values()];
  const n=(s,icon)=>s.reduce((v,t)=>v+t.icons.filter(x=>x===icon).length,0);
  const b=(s,biome)=>s.filter(t=>t.biome===biome).length;
  const l=s=>s.filter(t=>t.side==='light').length,sh=s=>s.filter(t=>t.side==='shadow').length;
  const distinct=s=>new Set(s.flatMap(t=>t.icons)).size,biomes=s=>new Set(s.map(t=>t.biome)).size;
  const rows=[...new Set(all.map(t=>row(t.p)))].map(x=>all.filter(t=>row(t.p)===x));
  return {all,r,c,a,d,union,n,b,l,sh,distinct,biomes,rows,adjacent};
 }
 function effect(board,p){
  const t=board[p];if(!t)return 0;
  const box=bounds(board);
  const center=i=>row(i)>box.top&&row(i)<box.bottom&&col(i)>box.left&&col(i)<box.right;
  const edge=i=>!center(i),corner=i=>[box.top,box.bottom].includes(row(i))&&[box.left,box.right].includes(col(i));
  const {all,r,c,a,d,union,n,b,l,sh,distinct,biomes,rows,adjacent}=context(board,p);
  const rc=union(r,c),border=all.filter(t=>edge(t.p));
  if(t.side==='shadow'){
   const conditions={1:n(all,'Albero')>=1,2:b(all,'Acqua')>=4,3:n(all,'Uccello')>=2,4:n(all,'Fiore')>=2,5:n(all,'Fungo')>=3,6:rows.length===4&&rows.every(x=>b(x,'Acqua')>=1),7:n(rc,'Mammifero')>=2,8:n(rc,'Fiore')>=2,9:n(all.filter(x=>x.p!==p&&Math.abs(row(x.p)-row(p))<=1&&Math.abs(col(x.p)-col(p))<=1),'Albero')>=1,10:b(union(c,a),'Acqua')>=1,11:n(rc,'Fungo')>=2,12:biomes(r)>=3,13:n(c,'Albero')>=2,14:b(r,'Acqua')>=2,15:n(d,'Uccello')>=2,16:n(a,'Fiore')>=1,17:l(r)>=3,18:center(p),19:edge(p),20:b(a,'Prateria')>=1,21:n(r,'Albero')>=2,22:b(c,'Acqua')>=2,23:n(r,'Mammifero')>=2,24:n(c,'Fiore')>=2,25:n(c,'Albero')>=1,26:b(r,'Acqua')>=1,27:n(a,'Uccello')>=1,28:n(a,'Fiore')>=1,29:l(a)>=2,30:corner(p)};
   return conditions[t.number]?Number(t.effect.match(/-\d+/)[0]):0;
  }
  const values={1:0,2:n(r,'Fiore'),3:n(a,'Fungo')>=1?2:0,4:n(border,'Uccello')>=2?2:0,5:center(p)?2:0,6:n(a,'Mammifero')>=1?2:0,7:0,8:2*sh(a),9:2*n(d,'Uccello'),10:n(a,'Albero')?3:0,11:2*l(a),12:n(r,'Fungo')>=2?3:0,13:0,14:sh(a)?6:0,15:2*n(r,'Uccello'),16:4*n(a,'Albero'),17:n(c,'Fiore')+n(c,'Fungo'),18:edge(p)&&!sh(a)?7:0,19:2*distinct(d),20:n(a,'Fiore')?7:0,21:biomes(r)>=3?5:0,22:2*biomes(r),23:5*n(all.filter(x=>center(x.p)),'Mammifero'),24:3*n(rc,'Mammifero'),25:3*n(union(a,r),'Fungo'),26:3*b(c,'Acqua'),27:b(r,'Montagna')===1?12:0,28:2*(n(r,'Uccello')+n(r,'Mammifero')),29:3*l(a),30:center(p)?8:0,31:6*n(c,'Uccello'),32:2*n(all,'Fiore'),33:4*n(r,'Albero'),34:2*n(all,'Albero'),35:2*distinct(c),36:5*sh(a),37:2*n(all,'Fiore'),38:3*b(rc,'Acqua'),39:2*(n(d,'Uccello')+n(d,'Mammifero')),40:r.length===4&&!sh(r)?10:0,41:3*n(all.filter(x=>all.some(y=>y.side==='shadow'&&adjacent(x.p,y.p))),'Fungo'),42:5*biomes(r),43:2*distinct(rc),44:5*n(rc,'Albero'),45:2*n(all,'Fungo'),46:3*l(c),47:9*rows.filter(x=>x.length===4&&!sh(x)).length,48:2*n(all,'Mammifero'),49:3*distinct(c),50:2*(n(r,'Albero')+n(r,'Fiore')+n(r,'Fungo')),51:n(a,'Albero')?1:0,52:n(c,'Fiore')?4:0,53:n(r,'Fungo')>=2?4:0,54:2*n(r,'Uccello'),55:2*n(d,'Albero'),56:2*n(all,'Fiore')};
  if(!(t.number in values))throw Error('Effetto sconosciuto');return values[t.number];
 }
 const canTake=(position,t)=>!!t&&(t.side==='light'?t.value>position:t.value<position);
 const move=(position,t)=>canTake(position,t)?t.value:position;
 function valid(board,p){if(!Number.isInteger(p)||p<0||p>=49||board[p]||board.filter(Boolean).length>=16)return false;if(!board.some(Boolean))return p===24;const b=bounds(board);return Math.max(b.bottom,row(p))-Math.min(b.top,row(p))<4&&Math.max(b.right,col(p))-Math.min(b.left,col(p))<4&&board.some((t,i)=>t&&Math.abs(row(i)-row(p))+Math.abs(col(i)-col(p))===1);}
 const score=board=>board.reduce((s,t,p)=>s+(t&&t.kind!=='Istantanea'?effect(board,p):0),0);
 function shuffle(a){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
 function create(cards){const light=shuffle(cards.filter(t=>t.side==='light')),shadow=shuffle(cards.filter(t=>t.side==='shadow'));const start=light.pop();const s={board:Array(49).fill(null),compass:start.value,batteries:2,start:null,selected:null,decks:{light,shadow},offers:{light:light.splice(0,4),shadow:shadow.splice(0,4)},log:[`Partenza estratta e piazzata al centro: ${start.side==='light'?'Luce':'Ombra'} ${start.value}. Bussola sul ${start.value}. Dotazione iniziale: 2 Batterie.`]};s.board[24]=start;if(start.kind==='Istantanea'){const gain=effect(s.board,24);s.batteries+=gain;if(gain)s.log.push(`Effetto iniziale: +${gain} Batterie.`);}return s;}
 function place(s,p){const t=s.selected;if(!canTake(s.compass,t)||!valid(s.board,p))return false;const offer=s.offers[t.side],idx=offer.findIndex(x=>x.id===t.id);if(idx<0)return false;s.board[p]=t;let gain=0;if(t.kind==='Istantanea'){gain=effect(s.board,p);s.batteries+=gain;}s.compass=move(s.compass,t);const next=s.decks[t.side].shift();if(next)offer[idx]=next;else offer.splice(idx,1);s.selected=null;s.log.push(`${t.side==='light'?'Luce':'Ombra'} ${t.value} in (${col(p)-3}, ${row(p)-3}). Bussola ${s.compass}${gain?`; +${gain} Batterie`:''}.`);return true;}
 function spendBattery(s){if(s.batteries<1||s.compass<=1||s.board.filter(Boolean).length>=16)return false;s.batteries--;s.compass--;if(s.selected&&!canTake(s.compass,s.selected))s.selected=null;s.log.push(`Azione gratuita: 1 Batteria spesa. Bussola sul ${s.compass}.`);return true;}
 return {effect,score,move,canTake,valid,create,place,spendBattery,bounds,row,col};
})();
if(typeof module!=='undefined')module.exports=Engine;
