// BUILD-19: render a simple, village-user friendly entity history panel.
import { buildEntityTimeline, summarizeConditionHistory } from '../temporal/entity-history.js';

export function renderEntityTimeline(container, entity, observations = [], lineages = []) {
  if (!container) return;
  const timeline = buildEntityTimeline(entity, observations, lineages);
  const summary = summarizeConditionHistory(timeline);
  container.innerHTML = `
    <section class="entity-timeline" aria-label="Evidence history">
      <h3>Place history</h3>
      <p class="timeline-summary">First: <strong>${summary.first_condition}</strong> · Latest: <strong>${summary.latest_condition}</strong> · Trend: <strong>${summary.trend}</strong></p>
      <div class="timeline-list">
        ${timeline.length ? timeline.map(item => `
          <article class="timeline-item">
            <time>${item.timestamp || 'Time unknown'}</time>
            <strong>${item.condition}</strong>
            <span>${Number.isFinite(item.accuracy_m) ? `±${item.accuracy_m} m` : 'Location accuracy unknown'}</span>
            <span>${Number.isFinite(item.elevation_m) ? `${item.elevation_m} m elevation` : 'Elevation unavailable'}</span>
            <span>${Number.isFinite(item.slope_deg) ? `${item.slope_deg}° slope` : 'Slope unavailable'}</span>
            <small>Evidence: ${item.evidence || 'Source record linked'}</small>
          </article>`).join('') : '<p>No verified history is available for this place.</p>'}
      </div>
    </section>`;
}
