// BUILD-28 deterministic parser/observation QA harness. Synthetic fixtures only.
import { parseWhatsApp } from '../parsers/whatsapp.js';
import { parseTelegramExport } from '../parsers/telegram.js';
import { buildObservations, auditObservations } from '../data/observation-builder.js';
const results=[];
const test=(name,fn)=>{try{fn();results.push({name,pass:true});}catch(error){results.push({name,pass:false,error:error.message});}};
const assert=(v,m)=>{if(!v)throw new Error(m)};
const WA=`30/08/2026, 08:42 - Ramesh: Waste is accumulating near the drain\n30/08/2026, 08:45 - Sita: I shared the location\n30/08/2026, 08:47 - Ramesh: <attached: IMG-001.jpg>`;
const TG={messages:[{id:1,type:'message',date:'2026-08-30T08:42:00',from:'Ramesh',text:'Waste near drain'},{id:2,type:'service',date:'2026-08-30T08:43:00',text:'ignored'},{id:3,type:'message',date:'not-a-date',from:'Sita',text:[{text:'Photo evidence'}],photo:'photos/3.jpg'}]};
test('WhatsApp baseline count',()=>{const m=parseWhatsApp(WA);assert(m.length===3,'expected 3 messages');});
test('Telegram ignores non-message records',()=>{const m=parseTelegramExport(TG);assert(m.length===2,'expected 2 messages');});
test('Telegram invalid date is safe',()=>{const m=parseTelegramExport(TG);assert(m[1].time==='','invalid date should yield empty time');});
test('Locationless message is not mapped',()=>{assert(buildObservations({messages:[{id:'x',text:'no location'}]}).length===0,'locationless message mapped');});
test('Invalid latitude is not mapped',()=>{assert(buildObservations({messages:[{id:'x',latitude:91,longitude:0,source:'test'}]}).length===0,'invalid latitude mapped');});
test('Valid coordinate passes QA',()=>{const o=buildObservations({messages:[{id:'x',latitude:30,longitude:78,source:'test'}]});const q=auditObservations(o);assert(q.passed===1,'valid observation failed');assert(o[0].accuracy_m===null,'missing accuracy changed');});
export function runBuild28ParserQA(){const passed=results.filter(x=>x.pass).length;return{build:'BUILD-28',total:results.length,passed,failed:results.length-passed,results};}
export {results};
