// BUILD-20: Map ↔ Timeline ↔ Evidence interaction contract.

export function createInteractionIndex({ entities=[], observations=[], lineages=[] }={}) {
  const byId = new Map(observations.map(o => [o.id, o]));
  const entityByObservation = new Map();
  entities.forEach(e => (e.evidence_ids || []).forEach(id => entityByObservation.set(id, e.entity_id)));
  return { byId, entityByObservation, lineages };
}

export function getObservationContext(observationId, index) {
  const observation = index?.byId?.get(observationId) || null;
  if (!observation) return null;
  return {
    observation,
    entity_id: index.entityByObservation.get(observationId) || observation.entity_id || null,
    lineage: (index.lineages || []).filter(l => l.observation_id === observationId)
  };
}

export function createMapJump(observation) {
  const lat = Number(observation?.latitude ?? observation?.lat);
  const lng = Number(observation?.longitude ?? observation?.lng);
  if (![lat,lng].every(Number.isFinite)) return null;
  return { latitude:lat, longitude:lng, timestamp:observation.timestamp || observation.time || null, observation_id:observation.id };
}
