export const API_ENDPOINTS = {
    READWISE: {
      BASE: 'https://readwise.io/api/v2',
      HIGHLIGHTS: '/highlights',
      BOOKS: '/books',
    },
    MEM: {
      BASE: 'https://api.mem.ai/v2/mem-it',
      MEMS: '',
    },
  } as const;
  
  export const RATE_LIMITS = {
    READWISE: 20, // requests per minute
    MEM: 20, // requests per minute
  } as const;
  
  export const BATCH_CONFIG = {
    SIZE: 20, // highlights per batch
    DELAY_MS: 0, // delay between batches
  } as const;
  
  export const VALIDATION_RULES = {
    MIN_TEXT_LENGTH: 1,
    MAX_TEXT_LENGTH: 10000,
    MAX_NOTE_LENGTH: 5000,
  } as const;
  
  export const SOURCE_TYPES = [
    'books',
    'articles',
    'tweets',
    'podcasts',
    'supplementals',
  ] as const;
  
  export const STORAGE_KEYS = {
    CREDENTIALS: 'readwise-mem:credentials',
    LAST_SYNC: 'readwise-mem:last-sync',
    SYNC_SCHEDULE: 'readwise-mem:schedule',
  } as const;

  export const SYNC_LIMITS = {
    MAX_HIGHLIGHTS_PER_SYNC: 80,        // 👈 Based on 5-min timeout
    READWISE_MAX_PAGES: 8,              // 👈 8 pages × 100 = 800 fetched, then cap at 80
    EXPLANATION: 'Vercel serverless has 5-minute timeout. At 20 Mem API calls/min, max 80-100 highlights per sync.',
  } as const;