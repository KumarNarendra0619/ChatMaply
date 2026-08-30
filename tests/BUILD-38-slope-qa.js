// BUILD-38 deterministic QA.
import { calculateSlopeDegrees, classifySlope, assessAccessibility, attachTerrainAssessment } from '../terrain/slope-accessibility-engine.js';
const results=[
 ['slope calculation',Math.abs(calculateSlopeDegrees(100,110,100)-5.710593)<0.001],
 ['flat class',classifySlope(2)==='FLAT'],
 ['steep class',classifySlope(35)==='STEEP'],
 ['unknown slope',classifySlope(null)==='UNKNOWN'],
 ['very steep accessibility',assessAccessibility({slope_degrees:50}).class==='DIFFICULT'],
 ['far road accessibility',assessAccessibility({slope_degrees:10,road_distance_m:600,surface:'ROAD'}).class==='LIMITED'],
 ['missing surface tentative',assessAccessibility({slope_degrees:10}).class==='TENTATIVE'],
 ['attachment',attachTerrainAssessment({id:'o1'},{elevation1_m:100,elevation2_m:110,horizontal_distance_m:100,surface:'ROAD',source:'TEST'}).slope_class==='GENTLE')
];
export function runSlopeQA(){return{total:results.length,passed:results.filter(r=>r[1]).length,failed:results.filter(r=>!r[1]).length,results};}
