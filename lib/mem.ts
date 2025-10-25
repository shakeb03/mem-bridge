import axios, { AxiosInstance } from 'axios';
import { API_ENDPOINTS, RATE_LIMITS, BATCH_CONFIG } from '@/utils/constants';
import { sleep } from '@/utils/helpers';
import {
  MemNote,
  MemCreateResponse,
  MemError,
  CreateNoteProgress,
} from '@/types/mem';

export class MemClient {
  private client: AxiosInstance;
  private requestCount: number = 0;
  private requestWindow: number = Date.now();

  constructor(apiKey: string) {
    this.client = axios.create({
      baseURL: API_ENDPOINTS.MEM.BASE,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  private async rateLimit(): Promise<void> {
    const now = Date.now();
    const windowElapsed = now - this.requestWindow;

    if (windowElapsed >= 60000) {
      this.requestCount = 0;
      this.requestWindow = now;
      return;
    }

    if (this.requestCount >= RATE_LIMITS.MEM) {
      const waitTime = 60000 - windowElapsed;
      await sleep(waitTime);
      this.requestCount = 0;
      this.requestWindow = Date.now();
    }

    this.requestCount++;
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.rateLimit();
      // Test by creating a simple note
      const testNote: MemNote = {
        content: 'Test connection from Readwise-Mem Sync',
      };
      const apiPayload = {
        input: testNote.content
      };
      const response = await this.client.post<MemCreateResponse>(
        API_ENDPOINTS.MEM.MEMS,
        apiPayload
      );
      return response.status === 200 || response.status === 201;
    } catch (error) {
      console.error('Mem connection test failed:', error);
      return false;
    }
  }

  async createNote(note: MemNote): Promise<MemCreateResponse> {
    await this.rateLimit();
    try {
      const response = await this.client.post<MemCreateResponse>(
        API_ENDPOINTS.MEM.MEMS,
        note
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const memError: MemError = {
          error: error.response?.data?.error || 'Unknown error',
          message: error.message,
          statusCode: error.response?.status || 500,
        };
        throw memError;
      }
      throw error;
    }
  }

  async createNotesInBatches(
    notes: MemNote[],
    onProgress?: (progress: CreateNoteProgress) => void
  ): Promise<{ synced: number; errors: number; errorDetails: {note: MemNote, error: unknown }[] }> {
    let synced = 0;
    let errors = 0;
    const errorDetails: { note: MemNote, error: unknown }[] = [];
    const totalBatches = Math.ceil(notes.length / BATCH_CONFIG.SIZE);
    const startTime = Date.now();

    onProgress?.({
      total: notes.length,
      synced: 0,
      errors: 0,
      status: 'in-progress',
      currentBatch: 0,
      totalBatches,
    });

    for (let i = 0; i < notes.length; i += BATCH_CONFIG.SIZE) {
      const batch = notes.slice(i, i + BATCH_CONFIG.SIZE);
      const currentBatch = Math.floor(i / BATCH_CONFIG.SIZE) + 1;

      // Process batch in parallel
      const results = await Promise.allSettled(
        batch.map((note) => this.createNote(note))
      );

      // Count successes and failures
      results.forEach((result, idx) => {
        if (result.status === 'fulfilled') {
          synced++;
        } else {
          errors++;
          errorDetails.push({
            note: batch[idx],
            error: result.reason,
          });
        }
      });

      // Update progress
      onProgress?.({
        total: notes.length,
        synced,
        errors,
        status: 'in-progress',
        currentBatch,
        totalBatches,
      });

      // Delay before next batch (except for last batch)
      if (i + BATCH_CONFIG.SIZE < notes.length) {
        await sleep(BATCH_CONFIG.DELAY_MS);
      }
    }

    onProgress?.({
      total: notes.length,
      synced,
      errors,
      status: 'complete',
      currentBatch: totalBatches,
      totalBatches,
    });

    return { synced, errors, errorDetails };
  }
}