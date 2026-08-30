// BUILD-10: conservative change detection for repeated observations of the same mapped issue.

export function compareConditions(previous, current) {
  const rank = { Unknown: 0, 'Needs review': 1, Good: 2, Moderate: 3, Poor: 4, Severe: 5 };
  const p = rank[previous?.condition] ?? 0;
  const c = rank[current?.condition] ?? 0;
  if (p === 0 || c === 0) return { change: 'insufficient evidence', delta: null };
  if (c > p) return { change: 'worsened', delta: c - p };
  if (c < p) return { change: 'improved', delta: c - p };
  return { change: 'unchanged', delta: 0 };
}

export function buildChangeRecord(previous, current) {
  return {
    previous_observation_id: previous?.id || null,
    current_observation_id: current?.id || null,
    previous_timestamp: previous?.timestamp || null,
    current_timestamp: current?.timestamp || null,
    ...compareConditions(previous, current),
    needs_human_review: true
  };
}
