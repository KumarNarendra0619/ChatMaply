// BUILD-19: evidence timeline and condition history.
// Timeline entries remain traceable to their source observation/evidence.

const CONDITION_RANK = { Unknown: 0, 'Needs review': 1, Good: 2, Moderate: 3, Poor: 4, Severe: 5 };

export function buildEntityTimeline(entity, observations = [], lineages = []) {
  const ids = new Set(entity?.evidence_ids || []);
  return observations
    .filter(o => ids.has(o.id) || o.entity_id === entity?.entity_id)
    .map(o => ({
      observation_id: o.id,
      timestamp: o.timestamp || o.time || null,
      condition: o.condition || 'Unknown',
      condition_rank: CONDITION_RANK[o.condition] ?? 0,
      latitude: Number(o.latitude ?? o.lat),
      longitude: Number(o.longitude ?? o.lng),
      accuracy_m: Number.isFinite(Number(o.accuracy_m ?? o.accuracy)) ? Number(o.accuracy_m ?? o.accuracy) : null,
      elevation_m: Number.isFinite(Number(o.elevation ?? o.terrain?.elevation_m)) ? Number(o.elevation ?? o.terrain?.elevation_m) : null,
      slope_deg: Number.isFinite(Number(o.slope_deg ?? o.terrain?.slope_deg)) ? Number(o.slope_deg ?? o.terrain?.slope_deg) : null,
      evidence: o.evidence || null,
      lineage: lineages.filter(l => l.observation_id === o.id)
    }))
    .sort((a,b) => new Date(a.timestamp || 0) - new Date(b.timestamp || 0));
}

export function summarizeConditionHistory(timeline = []) {
  if (!timeline.length) return { first_condition:'Unknown', latest_condition:'Unknown', changes:0, trend:'insufficient evidence' };
  let changes = 0;
  for (let i=1;i<timeline.length;i++) if (timeline[i].condition !== timeline[i-1].condition) changes++;
  const first = timeline[0].condition_rank, latest = timeline[timeline.length-1].condition_rank;
  return {
    first_condition: timeline[0].condition,
    latest_condition: timeline[timeline.length-1].condition,
    changes,
    trend: latest > first ? 'worsened' : latest < first ? 'improved' : 'unchanged'
  };
}

export function filterTimeline(timeline = [], {from=null,to=null}={}) {
  const start = from ? new Date(from).getTime() : -Infinity;
  const end = to ? new Date(to).getTime() : Infinity;
  return timeline.filter(e => { const t = new Date(e.timestamp || 0).getTime(); return t >= start && t <= end; });
}
