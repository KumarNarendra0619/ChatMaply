// BUILD-17: observation identity and duplicate/evidence linkage.
// Proximity is a candidate signal only; it never proves that two records are the same object.

export function canonicalObservationKey(o = {}) {
  const lat = Number(o.latitude ?? o.lat), lon = Number(o.longitude ?? o.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  return `${lat.toFixed(5)}:${lon.toFixed(5)}`;
}

export function haversineMeters(a, b) {
  const lat1=Number(a?.latitude??a?.lat), lon1=Number(a?.longitude??a?.lng);
  const lat2=Number(b?.latitude??b?.lat), lon2=Number(b?.longitude??b?.lng);
  if (![lat1,lon1,lat2,lon2].every(Number.isFinite)) return null;
  const R=6371008.8, r=d=>d*Math.PI/180, p1=r(lat1), p2=r(lat2), dp=r(lat2-lat1), dl=r(lon2-lon1);
  const h=Math.sin(dp/2)**2+Math.cos(p1)*Math.cos(p2)*Math.sin(dl/2)**2;
  return 2*R*Math.asin(Math.sqrt(h));
}

export function findCandidateLinks(observations = [], radiusM = 50) {
  const links=[];
  for(let i=0;i<observations.length;i++) for(let j=i+1;j<observations.length;j++) {
    const distance=haversineMeters(observations[i], observations[j]);
    if(distance != null && distance <= radiusM) links.push({a:observations[i].id,b:observations[j].id,distance_m:distance,reason:'spatial proximity only',requires_review:true});
  }
  return links;
}

export function createPhysicalEntity({entityId, category='Unknown'}={}) {
  return {entity_id:entityId || `entity-${Date.now()}`, category, evidence_ids:[], status:'unverified'};
}

export function linkEvidence(entity, observationId) {
  const ids=new Set(entity?.evidence_ids || []); ids.add(observationId);
  return {...entity,evidence_ids:[...ids],status:'requires verification'};
}
