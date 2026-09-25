const DominoEngine = (() => {
 const adjacent=(a,b)=>Math.abs(Engine.row(a)-Engine.row(b))+Math.abs(Engine.col(a)-Engine.col(b))===1;
 function groups(board,accept,connect){
  const remaining=new Set(board.map((t,p)=>t&&accept(t)?p:null).filter(p=>p!==null)),result=[];
  while(remaining.size){const seed=remaining.values().next().value,group=[seed];remaining.delete(seed);
   for(let i=0;i<group.length;i++)for(const p of [...remaining])if(adjacent(group[i],p)&&connect(board[group[i]],board[p])){remaining.delete(p);group.push(p);}
   result.push(group);
  }return result;
 }
 function metrics(board){
  const areas=groups(board,t=>t.biome!=='Nero',(a,b)=>a.biome===b.biome).map(cells=>{const trees=cells.reduce((n,p)=>n+board[p].trees,0);return {cells,biome:board[cells[0]].biome,size:cells.length,trees,points:cells.length*trees};});
  const garbage=groups(board,t=>t.trash>0,()=>true).map(cells=>({cells,amount:cells.reduce((n,p)=>n+board[p].trash,0)}));
  const rows=Array(7).fill(0),columns=Array(7).fill(0);let animals=0;
  board.forEach((t,p)=>{if(t){animals+=t.animals;rows[Engine.row(p)]+=t.trash;columns[Engine.col(p)]+=t.trash;}});
  const treePoints=areas.reduce((n,a)=>n+a.points,0);
  return {areas,garbage,animals,treePoints,base:treePoints+animals,largestTrash:Math.max(0,...garbage.map(g=>g.amount)),dirtiestRow:Math.max(...rows),dirtiestColumn:Math.max(...columns)};
 }
 // Competition uses standard ranking: tied leaders occupy first and second places.
 function scoreTable(boards,{soloComparisons=false,areaSign=-1}={}){
  const results=boards.map(b=>({...metrics(b),animalBonus:0,areaAdjustment:0,rowPenalty:0,columnPenalty:0}));
  if(boards.length>1||soloComparisons){
   const mostAnimals=Math.max(0,...results.map(r=>r.animals));
   for(const r of results){if(mostAnimals>0&&r.animals===mostAnimals)r.animalBonus=2;
    for(const [field,target,sign] of [['largestTrash','areaAdjustment',areaSign],['dirtiestRow','rowPenalty',-1],['dirtiestColumn','columnPenalty',-1]]){
     if(r[field]===0)continue;const rank=1+results.filter(other=>other[field]>r[field]).length;r[target]=sign*(rank===1?5:rank===2?2:0);
    }
   }
  }
  return results.map(r=>({...r,total:r.base+r.animalBonus+r.areaAdjustment+r.rowPenalty+r.columnPenalty}));
 }
 function create(cards){const s=Engine.create(cards);s.batteries+=s.board[24].batteries;const gain=s.board[24].batteries;if(gain)s.log.push(`Tessera iniziale: +${gain} Batterie.`);return s;}
 function place(s,p){const gain=s.selected?.batteries||0;if(!Engine.place(s,p))return false;s.batteries+=gain;if(gain)s.log.push(`Icone Batteria: +${gain} Batterie.`);return true;}
 function effect(board,p){const t=board[p];if(!t)return 0;const area=metrics(board).areas.find(a=>a.cells.includes(p));return t.animals+(area?area.size*t.trees:0);}
 return {...Engine,create,place,effect,metrics,scoreTable,score:board=>metrics(board).base};
})();
if(typeof module!=='undefined')module.exports=DominoEngine;
