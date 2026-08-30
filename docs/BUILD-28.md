# ChatMaply BUILD-28

## Real Export Test Harness + Parser QA

Added a deterministic synthetic parser QA harness and synthetic WhatsApp/Telegram fixtures. Tests cover message extraction, Telegram service-message filtering, malformed dates, missing coordinates, invalid coordinates, valid coordinates, provenance, and nullable accuracy.

### Platform status
- WhatsApp: baseline TXT parser; real export validation still required.
- Telegram: baseline JSON parser; real export validation still required.
- Signal: not implemented or claimed.
- Messenger: not implemented or claimed.

Synthetic fixtures are not evidence of universal platform compatibility. Real sanitized exports must be tested before production support is declared.

Never commit real chats, phone numbers, personal coordinates, private media, credentials or tokens.

**Status: BUILD-28 QA harness complete; real-platform validation pending.**
