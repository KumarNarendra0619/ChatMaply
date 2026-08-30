// BUILD-29 deterministic QA for the conservative Signal adapter.
import { parseSignalJSON, parseSignalText, detectSignalExport } from '../parsers/signal.js';
const json=JSON.stringify({messages:[{id:'s1',sender:'A',timestamp:'2026-08-31T10:00:00Z',text:'Waste site observed'}]});
const text='2026-08-31 10:05 - B: Road blocked';
const results=[
['detect JSON',detectSignalExport({name:'signal-export.json',text:json})==='signal-json'],
['JSON message',parseSignalJSON(json).length===1],
['JSON timestamp',parseSignalJSON(json)[0].date==='2026-08-31'],
['detect TXT',detectSignalExport({name:'signal-chat.txt',text})==='signal-text'],
['TXT message',parseSignalText(text).length===1],
['no invented location',!('latitude' in parseSignalText(text)[0])],
['invalid JSON',(()=>{try{parseSignalJSON('{bad');return false;}catch(e){return e.code==='INVALID_JSON';}})()]
];
export function runSignalQA(){return{total:results.length,passed:results.filter(r=>r[1]).length,failed:results.filter(r=>!r[1]).length,results};}
