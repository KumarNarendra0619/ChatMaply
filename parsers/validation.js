// BUILD-15: parser QA and normalized export validation.

const REQUIRED_MESSAGE_FIELDS = ['id', 'sender', 'text'];

export function validateMessage(message = {}) {
  const missing = REQUIRED_MESSAGE_FIELDS.filter(k => message[k] == null);
  return { valid: missing.length === 0, missing };
}

export function validateNormalizedExport(result = {}) {
  const messages = Array.isArray(result.messages) ? result.messages : [];
  const media = Array.isArray(result.media) ? result.media : [];
  const invalidMessages = messages.filter(m => !validateMessage(m).valid).map(m => m.id || null);
  return {
    valid: invalidMessages.length === 0,
    message_count: messages.length,
    media_count: media.length,
    invalid_message_ids: invalidMessages,
    platform: result.platform || 'unknown',
    warnings: []
  };
}

export function createImportReport({ fileName, platform, validation, parserStatus }) {
  return {
    file_name: fileName || null,
    platform: platform || 'unknown',
    parser_status: parserStatus || 'unknown',
    validation,
    imported_at: new Date().toISOString(),
    safe_to_map: Boolean(validation?.valid && validation?.message_count >= 0)
  };
}
