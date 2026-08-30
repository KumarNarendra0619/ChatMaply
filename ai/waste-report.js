// BUILD-07 structured waste/disposal reporting.
import { buildReviewRecord } from './condition-engine.js';

export function createWasteReport({ messageId = null, mediaId = null, text = '', location = null, quantity = null, material = null }) {
  const review = buildReviewRecord({ messageId, mediaId, text, location });
  return {
    ...review,
    category: 'Waste / disposal site',
    waste: {
      material: material || 'Unknown',
      quantity: quantity ?? 'Unknown'
    },
    status: 'Needs verification'
  };
}
