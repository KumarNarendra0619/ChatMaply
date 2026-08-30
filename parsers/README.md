# BUILD-02 parser layer

ChatMaply converts platform-specific exports into one normalized message model.

## Current parsers
- `whatsapp.js`: WhatsApp-style TXT exports (date/time/sender/message).
- `telegram.js`: Telegram JSON exports.
- `common.js`: shared message normalization and media classification.

Signal and Messenger adapters are intentionally reserved for the next parser iteration because their export formats can vary by client/export method. The UI must not claim universal support until a real sample export has been tested.
