// BUILD-07: lightweight, explainable condition/category engine.
// This is intentionally not a fake vision model. It classifies explicit text/evidence signals
// and creates a review queue for future multimodal AI integration.

const RULES = [
  { id: 'waste', label: 'Waste / disposal site', terms: ['waste','garbage','dump','dumping','litter','kachra','कचरा','कूड़ा','disposal'] },
  { id: 'water', label: 'Water pollution / issue', terms: ['pollution','dirty water','sewage','drain','contamination','गंदा पानी','नाला'] },
  { id: 'road', label: 'Road / access condition', terms: ['road','pothole','broken road','blocked','mud','landslide','सड़क','गड्ढा','बंद'] },
  { id: 'fire', label: 'Fire / smoke', terms: ['fire','smoke','burning','आग','धुआं'] }
];

export function classifyEvidenceText(text = '') {
  const value = String(text).toLowerCase();
  const matches = RULES.map(rule => ({ rule, hits: rule.terms.filter(term => value.includes(term.toLowerCase())) }))
    .filter(item => item.hits.length)
    .sort((a,b) => b.hits.length - a.hits.length);
  if (!matches.length) return { category: 'Unclassified', confidence: 0, matched_terms: [] };
  const top = matches[0];
  return { category: top.rule.label, confidence: Math.min(0.95, 0.55 + top.hits.length * 0.1), matched_terms: top.hits };
}

export function assessConditionFromText(text = '') {
  const value = String(text).toLowerCase();
  if (/(severe|major|critical|dangerous|बहुत खराब|गंभीर)/i.test(value)) return { condition: 'Severe', confidence: 0.8, basis: 'explicit text signal' };
  if (/(bad|poor|damaged|blocked|खराब|क्षतिग्रस्त)/i.test(value)) return { condition: 'Poor', confidence: 0.75, basis: 'explicit text signal' };
  if (/(moderate|medium|मध्यम)/i.test(value)) return { condition: 'Moderate', confidence: 0.7, basis: 'explicit text signal' };
  if (/(good|clear|normal|अच्छा|साफ)/i.test(value)) return { condition: 'Good', confidence: 0.7, basis: 'explicit text signal' };
  return { condition: 'Needs review', confidence: 0, basis: 'no explicit condition signal' };
}

export function buildReviewRecord({ messageId = null, mediaId = null, text = '', location = null }) {
  const classification = classifyEvidenceText(text);
  const condition = assessConditionFromText(text);
  return {
    message_id: messageId,
    media_id: mediaId,
    category: classification.category,
    category_confidence: classification.confidence,
    condition: condition.condition,
    condition_confidence: condition.confidence,
    matched_terms: classification.matched_terms,
    location: location || null,
    needs_human_review: true,
    created_at: new Date().toISOString()
  };
}
