// BUILD-16: synthetic regression fixtures only. No personal chat content.

export const FIXTURES = {
  whatsapp_basic: {
    platform: 'whatsapp',
    expected: { messages: 3, media: 2, locations: 1 }
  },
  telegram_basic: {
    platform: 'telegram',
    expected: { messages: 3, media: 2, locations: 1 }
  },
  signal_placeholder: {
    platform: 'signal',
    expected: { messages: null, media: null, locations: null },
    status: 'awaiting real-export validation'
  },
  messenger_placeholder: {
    platform: 'messenger',
    expected: { messages: null, media: null, locations: null },
    status: 'awaiting real-export validation'
  }
};
