(function(scope){
'use strict';
const slots=[['08:00','08:45'],['08:50','09:35'],['09:50','10:35'],['10:40','11:25'],['11:30','12:15'],['13:00','13:45'],['13:50','14:35'],['14:50','15:35'],['15:40','16:25'],['16:30','17:15'],['18:00','18:45'],['18:50','19:35'],['19:40','20:25'],['20:30','21:15']];
function normalize(text){return text.replace(/[（]/g,'(').replace(/[）]/g,')').replace(/[～〜—–－]/g,'~').replace(/[，、]/g,',').replace(/第(?=\d)/g,'').replace(/[ \t]+/g,' ').trim()}
function weeks(text){const s=normalize(text),set=new Set();for(const match of s.matchAll(/(\d{1,2})(?:\s*[~\-至]\s*(\d{1,2}))?/g)){const a=+match[1],b=+(match[2]||match[1]);if(a<1||b>30||b<a)continue;for(let w=a;w<=b;w++)if((!s.includes('单')||w%2===1)&&(!s.includes('双')||w%2===0))set.add(w)}return [...set].sort((a,b)=>a-b)}
function parseColumn(text,day){
 const lines=normalize(text).split(/\n/).map(s=>s.trim()).filter(Boolean),headers=[];
 lines.forEach((line,i)=>{if(/教学班[代带]码\s*[:：]?\s*[\dOIl ]{6,}/.test(line))headers.push(i)});
 const result=[];
 headers.forEach((at,index)=>{
  let title=lines[at-1]||'';title=title.replace(/^\s*[|丨]+/,'').trim();
  if(!title||/[节周]|教学班|\d{6}/.test(title))title='课程名称待校对';
  const end=index+1<headers.length?headers[index+1]-1:lines.length;
  const block=lines.slice(at+1,end).join('\n'),rules=[];
  const re=/\(([^\n]*?周)\)\s*\((\d{1,2})\s*[~\-至]\s*(\d{1,2})\s*节\)/g;
  for(const m of block.matchAll(re)){const from=+m[2],to=+m[3],ws=weeks(m[1]);if(!slots[from-1]||!slots[to-1]||from>to||!ws.length)continue;const tail=block.slice(m.index+m[0].length).split(/\n|\(.*?周\)/)[0].trim();const place=tail.replace(/\s*【.*$/,'').replace(/\s*\[.*$/,'').trim();const existing=rules.find(r=>r.from===from&&r.to===to);if(existing){existing.weeks=[...new Set([...existing.weeks,...ws])].sort((a,b)=>a-b)}else rules.push({day,from,to,start:slots[from-1][0],end:slots[to-1][1],weeks:ws,place,needsReview:true})}
  const code=(lines[at].match(/[:：]\s*([\dOIl ]+)/)||[])[1]?.replace(/\s/g,'')||'';
  result.push({title,code,rules,raw:lines.slice(Math.max(0,at-1),end).join('\n'),needsReview:true});
 });
 return result;
}
function merge(items){const map=new Map();for(const item of items){const id=item.code||item.title;if(!map.has(id))map.set(id,{...item,rules:[]});const c=map.get(id);for(const rule of item.rules){const old=c.rules.find(r=>r.day===rule.day&&r.from===rule.from&&r.to===rule.to);if(old)old.weeks=[...new Set([...old.weeks,...rule.weeks])].sort((a,b)=>a-b);else c.rules.push({...rule})}}return [...map.values()]}
function weekNumber(date,start){if(!start)return null;const a=new Date(date+'T12:00:00'),b=new Date(start+'T12:00:00');if(!Number.isFinite(+a)||!Number.isFinite(+b))return null;return Math.floor((a-b)/604800000)+1}
scope.WYYTimetable={slots,normalize,weeks,parseColumn,merge,weekNumber};
if(typeof module!=='undefined')module.exports=scope.WYYTimetable;
})(typeof window==='undefined'?globalThis:window);
