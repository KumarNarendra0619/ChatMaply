// BUILD-10: spatio-temporal evidence utilities.

export function toTimeValue(value) {
  if (!value) return null;
  const t = Date.parse(value);
  return Number.isFinite(t) ? t : null;
}

export function normalizeTemporalRecord(record = {}) {
  const timestamp = record.timestamp || record.time || null;
  const timeValue = toTimeValue(timestamp);
  return {
    ...record,
    timestamp,
    time_value: timeValue,
    temporal_status: timeValue == null ? 'unknown' : 'known'
  };
}

export function filterByTime(records = [], start = null, end = null) {
  const a = start == null ? -Infinity : Number(start);
  const b = end == null ? Infinity : Number(end);
  return records.map(normalizeTemporalRecord).filter(r => r.time_value != null && r.time_value >= a && r.time_value <= b);
}

export function sortChronologically(records = []) {
  return records.map(normalizeTemporalRecord).sort((a,b) => (a.time_value ?? Infinity) - (b.time_value ?? Infinity));
}

export function buildTemporalSnapshot(records = [], atTime = null) {
  const ordered = sortChronologically(records);
  const t = atTime == null ? Infinity : Number(atTime);
  return ordered.filter(r => r.time_value != null && r.time_value <= t);
}
