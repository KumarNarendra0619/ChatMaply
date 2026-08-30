// BUILD-32 deterministic QA for the canonical evidence envelope.
import { createEvidence, validateEvidence, normalizeEvidenceBatch } from '../data/unified-evidence-model.js';
const sample=createEvidence({id:'e1',type:'IMAGE',source_platform:'WHATSAPP',source_id:'msg-1',sender:'A',text:'site',latitude:30.32,longitude:78.03,accuracy_m:12,timestamp:'2026-08-31T10:00:00Z',location_type:'OBJECT',provenance:{kind:'media-exif'},review_status:'UNREVIEWED'});
const invalid=createEvidence({id:'bad',type:'IMAGE',source_platform:'WHATSAPP',latitude:200,longitude:10});
const results=[['valid evidence',validateEvidence(sample).valid],['coordinates preserved',sample.location?.latitude===30.32&&sample.location?.longitude===78.03],['accuracy preserved',sample.accuracy_m===12],['timestamp normalized',sample.timestamp==='2026-08-31T10:00:00.000Z'],['provenance preserved',sample.provenance?.kind==='media-exif'],['invalid coordinates rejected',!validateEvidence(invalid).valid],['batch normalized',normalizeEvidenceBatch([sample,invalid]).length===1]];
export function runEvidenceModelQA(){return{total:results.length,passed:results.filter(x=>x[1]).length,failed:results.filter(x=>!x[1]).length,results};}
