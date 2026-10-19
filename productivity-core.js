(function(scope){
function dateKey(d){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
function range(mode,key){const d=new Date(key+'T12:00:00');let a=new Date(d),b=new Date(d);if(mode==='week'){a.setDate(a.getDate()-(a.getDay()+6)%7);b=new Date(a);b.setDate(b.getDate()+6)}if(mode==='month'){a.setDate(1);b=new Date(d.getFullYear(),d.getMonth()+1,0,12)}if(mode==='year'){a=new Date(d.getFullYear(),0,1,12);b=new Date(d.getFullYear(),11,31,12)}return [dateKey(a),dateKey(b)]}
function days(a,b){const out=[],d=new Date(a+'T12:00:00');while(dateKey(d)<=b){out.push(dateKey(d));d.setDate(d.getDate()+1)}return out}
function splitTime(start,end){const parts=[];let at=start;while(at<end){const d=new Date(at),midnight=new Date(d);midnight.setHours(24,0,0,0);const until=Math.min(end,+midnight);parts.push({date:dateKey(d),minutes:(until-at)/60000});at=until}return parts}
function elapsed(timer,now){return timer.status==='running'?Math.max(0,Math.min(now,timer.endAt)-timer.startedAt):0}
function safeUrl(value,base){try{const u=new URL(value,base);return ['https:','http:'].includes(u.protocol)?u.href:null}catch{return null}}
scope.WYYProductivity={dateKey,range,days,splitTime,elapsed,safeUrl};if(typeof module!=='undefined')module.exports=scope.WYYProductivity;
})(typeof window==='undefined'?globalThis:window);
