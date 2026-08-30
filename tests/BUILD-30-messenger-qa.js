// BUILD-30 deterministic QA for the conservative Messenger adapter.
import { parseMessengerJSON, detectMessengerExport } from '../parsers/messenger.js';
const json=JSON.stringify({messages:[{id:'m1',sender_name:'A',timestamp_ms:1788166800000,content:'Waste site observed',photos:[{uri:'photo.jpg'}]}]});
const parsed=parseMessengerJSON(json);
const results=[
 ['detect JSON',detectMessengerExport({name:'facebook-messenger.json',text:json})==='messenger-json'],
 ['message parsed',parsed.length===1],
 ['sender preserved',parsed[0]?.sender==='A'],
 ['text preserved',parsed[0]?.text==='Waste site observed'],
 ['media preserved',Array.isArray(parsed[0]?.media)],
 ['no invented location',!('latitude' in parsed[0])&&!('longitude' in parsed[0])],
 ['invalid JSON',(()=>{try{parseMessengerJSON('{bad');return false;}catch(e){return e.code==='INVALID_JSON';}})()]
];
export function runMessengerQA(){return{total:results.length,passed:results.filter(r=>r[1]).length,failed:results.filter(r=>!r[1]).length,results};}
