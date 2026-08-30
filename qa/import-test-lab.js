// BUILD-16: deterministic parser QA and import test lab.
// Runs against normalized records; no private chat data is stored here.

export function runImportTest({ expected = {}, actual = {} } = {}) {
  const checks = [
    ['messages', expected.messages, actual.messages],
    ['media', expected.media, actual.media],
    ['locations', expected.locations, (actual.observations || []).length]
  ];
  const results = checks.map(([name, exp, got]) => ({
    name,
    expected: Number.isFinite(Number(exp)) ? Number(exp) : null,
    actual: Number.isFinite(Number(got)) ? Number(got) : null,
    pass: exp == null ? null : Number(exp) === Number(got)
  }));
  return {
    pass: results.every(r => r.pass !== false),
    checks: results,
    generated_at: new Date().toISOString()
  };
}

export function buildQualityMetrics({ messages = [], media = [], observations = [] } = {}) {
  const mapped = observations.length;
  return {
    message_count: messages.length,
    media_count: media.length,
    mapped_location_count: mapped,
    mapping_rate: media.length || messages.length ? mapped / Math.max(messages.length, 1) : 0,
    records_with_coordinates: observations.filter(o => Number.isFinite(Number(o.latitude)) && Number.isFinite(Number(o.longitude))).length
  };
}
