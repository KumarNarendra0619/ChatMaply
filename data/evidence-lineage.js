// BUILD-17: evidence lineage. Every derived observation keeps a trace to source records.

export function createEvidenceLineage({observationId, sourceType, sourceId, mediaId=null}={}) {
  return {
    observation_id: observationId || null,
    source_type: sourceType || 'unknown',
    source_id: sourceId || null,
    media_id: mediaId,
    derived_at: new Date().toISOString()
  };
}

export function groupEvidenceByEntity(entities=[], lineages=[]) {
  return entities.map(entity => ({
    ...entity,
    evidence_lineage: lineages.filter(l => entity.evidence_ids?.includes(l.observation_id))
  }));
}
