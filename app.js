const $=id=>document.getElementById(id),symbols={Albero:'🌳',Fiore:'🌼',Fungo:'🍄',Uccello:'🐦',Mammifero:'🦊'},key='light-shadow-cards-revision-20260922';
let state,history=[],inspected=null;
try{const saved=JSON.parse(localStorage.getItem(key));if(saved&&saved.version===2&&saved.state.board.length===49){state=saved.state;history=saved.history||[];}}catch{}
// Replace an unplayed legacy Shadow start; preserve games already in progress.
if(state&&state.board.filter(Boolean).length===1&&state.board.find(Boolean).side==='shadow'){state=null;history=[];}
if(!state)state=Engine.create(CARDS);
function save(){try{localStorage.setItem(key,JSON.stringify({version:2,state,history}));}catch{$('save-status').textContent='Salvataggio non disponibile in questo browser';}}
function tile(t,small=false){const el=document.createElement('button');el.className=`tile ${t.side}${state.selected?.id===t.id?' selected':''}`;el.dataset.biome=t.biome;el.title=`${t.biome} · ${t.icons.join(', ')} · ${t.effect}`;el.setAttribute('aria-label',`${t.side==='light'?'Luce':'Ombra'} ${t.value}, ${t.biome}. ${t.icons.join(', ')}. ${t.effect}`);el.innerHTML=`<div class="tile-head"><span class="number">${t.value}</span><span class="icons">${[...new Set(t.icons)].map(x=>`<span class="icon-group">${symbols[x]}${t.icons.filter(i=>i===x).length>1?`<small>×${t.icons.filter(i=>i===x).length}</small>`:''}</span>`).join('')||'<span class="no-icon">—</span>'}</span></div><span class="biome">${t.biome}</span><span class="effect">${t.effect}</span><span class="kind">${t.kind} · #${t.number}</span>`;return el;}
function render(){const count=state.board.filter(Boolean).length,done=count===16,t=state.start||state.selected;
 $('score').textContent=Engine.score(state.board);$('battery').textContent=state.batteries;$('count').textContent=`${count}/16`;$('undo').disabled=!history.length;
 $('message').textContent=done?`Regno completo! Hai totalizzato ${Engine.score(state.board)} PV e raccolto ${state.batteries} Batterie.`:state.start?`Partenza estratta: ${state.start.side==='light'?'Luce':'Ombra'} ${state.start.value}. Scegli la prima casella del tuo regno.`:t?`${t.biome} ${t.value}: scegli una casella evidenziata per piazzare la tessera.`:'Scegli tra Luce e Ombra per espandere il tuo regno.';
 for(const side of ['light','shadow']){$(side).replaceChildren();$(''+side+'-count').textContent=`${state.decks[side].length} nel mazzo`;for(const card of state.offers[side]){const el=tile(card);el.disabled=done||!Engine.canTake(state.compass,card);if(!done&&el.disabled){el.title+=`; Indisponibile: serve un valore ${side==='light'?'maggiore':'minore'} di ${state.compass}.`;const lock=document.createElement('span');lock.className='unavailable';lock.textContent='Non raggiungibile';el.append(lock);}el.onclick=()=>{state.selected=state.selected?.id===card.id?null:card;inspected=null;save();render();};$(side).append(el);}}
 const positions=state.board.map((card,p)=>card||Engine.valid(state.board,p)?p:null).filter(p=>p!==null);
 const minR=Math.min(...positions.map(Engine.row)),maxR=Math.max(...positions.map(Engine.row)),minC=Math.min(...positions.map(Engine.col)),maxC=Math.max(...positions.map(Engine.col));
 $('board').style.gridTemplateColumns=`repeat(${maxC-minC+1}, 140px)`;
 $('board').replaceChildren();for(let r=minR;r<=maxR;r++)for(let c=minC;c<=maxC;c++){const p=r*7+c,card=state.board[p];let el;if(card){el=tile(card,true);el.onclick=()=>{inspected=p;render();};}else if(Engine.valid(state.board,p)){el=document.createElement('button');const allowed=!!t&&!done;el.className=`empty frontier ${allowed?'valid':''}`;el.textContent='+';el.disabled=!allowed;el.setAttribute('aria-label',`Piazza in (${c-3}, ${r-3})`);el.onclick=()=>{const before=JSON.parse(JSON.stringify(state));if(Engine.place(state,p)){history.push(before);inspected=p;save();render();}};}else{el=document.createElement('div');el.className='void';el.setAttribute('aria-hidden','true');}$('board').append(el);}
 $('battery-left').disabled=done||state.batteries<1||state.compass<=1;
 const playable=[...state.offers.light,...state.offers.shadow].some(card=>Engine.canTake(state.compass,card));
 if(!done&&!playable)$('message').textContent=state.batteries>0&&state.compass>1?'Nessuna tessera raggiungibile. Spendi una Batteria per spostare la bussola a sinistra.':'Nessuna tessera raggiungibile e nessuna azione disponibile. Puoi annullare l’ultima azione o iniziare una nuova partita.';
 $('compass').innerHTML=Array.from({length:9},(_,i)=>{const rad=i*2*Math.PI/9;return `<span class="dial-number ${state.compass===i+1?'active':''}" style="transform:translate(${Math.sin(rad)*70}px,${-Math.cos(rad)*70}px)">${i+1}</span>`;}).join('')+`<div class="needle" style="transform:rotate(${(state.compass-1)*40}deg)"></div><div class="hub"></div>`;
 $('compass').setAttribute('aria-label',`Bussola al livello ${state.compass}`);
 $('movement').textContent=t&&!state.start?`${t.side==='light'?'→ Destra':'← Sinistra'}: ${state.compass} → ${Engine.move(state.compass,t)}`:`Indicatore al livello ${state.compass}`;
 const detail=inspected!==null?state.board[inspected]:t;
 $('detail').innerHTML=detail?`<h3>${detail.biome} · ${detail.side==='light'?'Luce':'Ombra'} ${detail.value}</h3><p>${detail.icons.join(' · ')||'Nessuna icona'}</p><p>${detail.effect}</p>${inspected!==null&&detail.kind!=='Istantanea'?`<strong>Contributo attuale: ${Engine.effect(state.board,inspected)} PV</strong>`:''}`:'<p>Seleziona una tessera per leggerne l’effetto e vedere lo spostamento della bussola.</p>';
 $('log').replaceChildren(...[...state.log].reverse().map(line=>{const li=document.createElement('li');li.textContent=line;return li;}));
}
$('battery-left').onclick=()=>{const before=JSON.parse(JSON.stringify(state));if(Engine.spendBattery(state)){history.push(before);inspected=null;save();render();}};
$('undo').onclick=()=>{if(history.length){state=history.pop();inspected=null;save();render();}};
$('new').onclick=()=>$('restart').showModal();$('cancel-new').onclick=()=>$('restart').close();$('confirm-new').onclick=()=>{state=Engine.create(CARDS);history=[];inspected=null;$('restart').close();save();render();};
$('rules').onclick=()=>$('help').showModal();$('close-help').onclick=()=>$('help').close();render();save();

let deckSide='light';
let setup={count:2,types:['human','human','human','human']};
try{const stored=JSON.parse(localStorage.getItem('light-shadow-table-v1'));if(stored&&[2,3,4].includes(stored.count)&&stored.types?.length===4&&stored.types.every(x=>['human','automaton'].includes(x)))setup=stored;}catch{}
function navigate(view){
 for(const name of ['home','deck','multi','game'])$(name+'-view').hidden=name!==view;
 $('home-button').hidden=view==='home';$('undo').hidden=view!=='game';$('new').hidden=view!=='game';
 window.scrollTo(0,0);
}
function catalog(){
 const query=$('card-search').value.trim().toLocaleLowerCase('it');
 const cards=CARDS.filter(t=>t.side===deckSide&&(!$('card-value').value||t.value===Number($('card-value').value))&&(!$('card-biome').value||t.biome===$('card-biome').value)&&`${t.number} ${t.value} ${t.biome} ${t.icons.join(' ')} ${t.kind} ${t.effect}`.toLocaleLowerCase('it').includes(query)).sort((a,b)=>a.value-b.value||a.number-b.number);
 $('deck-total').textContent=`${cards.length} / ${deckSide==='light'?56:30} tessere`;
 $('catalog').replaceChildren(...cards.map(t=>{const card=tile(t),article=document.createElement('article');article.className=`tile ${t.side}`;article.dataset.biome=t.biome;article.innerHTML=card.innerHTML;const names=document.createElement('span');names.className='icon-names';names.textContent=t.icons.join(' · ')||'Nessuna icona';article.querySelector('.tile-head').after(names);return article;}));
 $('no-cards').hidden=cards.length>0;
}
function openDeck(side){deckSide=side;$('deck-title').textContent=side==='light'?'☀ Deck Luce':'☾ Deck Ombra';$('card-search').value='';$('card-biome').value='';$('card-value').replaceChildren(new Option('Tutti',''),...[...new Set(CARDS.filter(t=>t.side===side).map(t=>t.value))].sort((a,b)=>a-b).map(v=>new Option(String(v),String(v))));catalog();navigate('deck');}
function saveSetup(){try{localStorage.setItem('light-shadow-table-v1',JSON.stringify(setup));$('setup-status').textContent='Configurazione salvata su questo dispositivo.';}catch{$('setup-status').textContent='Configurazione mantenuta per questa sessione; salvataggio non disponibile.';}}
function renderPlayers(){
 $('player-count').value=setup.count;
 $('players').replaceChildren(...Array.from({length:setup.count},(_,i)=>{const label=document.createElement('label');label.className='player-row';const name=document.createElement('span');name.textContent=`Giocatore ${i+1}`;const select=document.createElement('select');select.append(new Option('Umano','human'),new Option('Automa','automaton'));select.value=setup.types[i];select.onchange=()=>{setup.types[i]=select.value;saveSetup();};label.append(name,select);return label;}));
}
$('home-button').onclick=()=>navigate('home');$('deck-light').onclick=()=>openDeck('light');$('deck-shadow').onclick=()=>openDeck('shadow');$('solo').onclick=()=>{render();navigate('game');};$('multi').onclick=()=>{renderPlayers();navigate('multi');};
$('card-search').oninput=catalog;$('card-value').onchange=catalog;$('card-biome').onchange=catalog;
$('player-count').onchange=()=>{setup.count=Number($('player-count').value);saveSetup();renderPlayers();};
navigate('home');

