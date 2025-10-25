import { track } from '@vercel/analytics';

export const analytics = {
  syncStarted: (data: {
    syncType: string;
    highlightsCount: number;
  }) => {
    track('Sync Started', data);
  },

  validationCompleted: (data: {
    total: number;
    valid: number;
    invalid: number;
  }) => {
    track('Validation Completed', data);
  },

  syncCompleted: (data: {
    syncType: string;
    totalHighlights: number;
    syncedCount: number;
    errorCount: number;
    durationSeconds: number;
  }) => {
    track('Sync Completed', data);
  },

  connectionTested: (data: {
    service: 'readwise' | 'mem';
    success: boolean;
  }) => {
    track('Connection Tested', data);
  },
};