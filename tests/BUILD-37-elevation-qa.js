// BUILD-37 deterministic QA.
import { createElevationQuery, normalizeElevationResult, attachElevation } from '../terrain/elevation-engine.js';
const good=createElevationQuery({latitude:30.32,longitude:78.03});
const bad=createElevationQuery({latitude:120,longitude:78});
const attached=attachElevation({latitude:30.32,longitude:78.03},{elevation_m:612.4,datum:'EGM96',source:'TEST_DEM',resolution_m:30,quality:'TEST'});
const unknown=attachElevation({latitude:30.32,longitude:78.03},{});
const results=[['valid query',good.valid],['invalid latitude rejected',!bad.valid],['elevation normalized',normalizeElevationResult({elevation_m:612.4}).elevation_m===612.4],['elevation attached',attached.elevation_m===612.4&&attached.elevation_status==='DERIVED'],['datum preserved',attached.elevation_datum==='EGM96'],['unknown not fabricated',unknown.elevation_m===null&&unknown.elevation_status==='UNKNOWN']];
export function runElevationQA(){return{total:results.length,passed:results.filter(r=>r[1]).length,failed:results.filter(r=>!r[1]).length,results};}
