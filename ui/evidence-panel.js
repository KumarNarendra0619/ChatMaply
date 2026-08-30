// BUILD-25: evidence panel with explicit media → observation relationship.
export function renderEvidencePanel(container, context) {
  if (!container) return;
  if (!context) { container.innerHTML='<p>No evidence selected.</p>'; return; }
  const o=context.observation||{};
  const items=(context.lineage||[]).map(l=>`<li>${l.source_type}: ${l.source_id||'unknown'}${l.media_id?` • media ${l.media_id}`:''}</li>`).join('');
  const media=(context.media||[]).map(m=>`<li><strong>${m.name||m.media_id||'Media'}</strong> • ${m.media_type||m.type||'file'}${m.location_source?` • ${m.location_source}`:''}</li>`).join('');
  container.innerHTML=`<section class="evidence-panel"><h3>Evidence</h3><p><strong>${o.type||'Observation'}</strong></p><p>${o.timestamp||o.time||'Time unknown'}</p><p>Accuracy: ${o.accuracy_m!=null?`±${o.accuracy_m} m`:'unknown'}</p><p>Object location: ${o.location_type==='OBJECT_LOCATION'?'Confirmed':'Not confirmed'}</p><ul>${items||'<li>Source lineage unavailable</li>'}</ul>${media?`<p><strong>Linked media</strong></p><ul>${media}</ul>`:''}</section>`;
}
