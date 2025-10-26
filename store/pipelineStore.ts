import { create } from 'zustand';
import { PipelineState, PipelineStage } from '@/types/pipeline';
import type { Credentials, SyncConfig } from '@/types/pipeline';
import type { ReadwiseHighlight, ReadwiseBook, FetchProgress } from '@/types/readwise';
import type { ValidationSummary } from '@/types/pipeline';
import type { CreateNoteProgress } from '@/types/mem';

interface PipelineStore extends PipelineState {
  setStage: (stage: PipelineStage) => void;
  setCredentials: (credentials: Credentials) => void;
  setSyncConfig: (config: SyncConfig) => void;
  setFetchProgress: (progress: FetchProgress) => void;
  setFetchedData: (highlights: ReadwiseHighlight[], books: ReadwiseBook[]) => void;
  setValidationSummary: (summary: ValidationSummary) => void;
  setSyncProgress: (progress: CreateNoteProgress) => void;
  setError: (error: string | null) => void;
  setGroupByBook: (groupByBook: boolean) => void;
  reset: () => void;
}

const initialState: PipelineState = {
  stage: 'idle',
  credentials: null,
  syncConfig: null,
  fetchProgress: {
    total: 0,
    current: 0,
    status: 'pending',
  },
  fetchedData: {
    highlights: [],
    books: [],
  },
  validationSummary: {
    total: 0,
    valid: 0,
    warnings: 0,
    invalid: 0,
    status: 'pending',
    results: [],
  },
  syncProgress: {
    total: 0,
    synced: 0,
    errors: 0,
    status: 'pending',
  },
  groupByBook: false,
  error: null,
};

export const usePipelineStore = create<PipelineStore>((set) => ({
  ...initialState,

  setStage: (stage) =>
    set(() => {
      if (stage === 'fetching') {
        return {
          stage,
          fetchProgress: {
            total: 0,
            current: 0,
            status: 'pending',
          },
          fetchedData: { highlights: [], books: [] },
          validationSummary: {
            total: 0,
            valid: 0,
            warnings: 0,
            invalid: 0,
            status: 'pending',
            results: [],
          },
          syncProgress: {
            total: 0,
            synced: 0,
            errors: 0,
            status: 'pending',
          },
          error: null,
          groupByBook: false,
        } satisfies Partial<PipelineState>;
      }

      return { stage } satisfies Partial<PipelineState>;
    }),

  setCredentials: (credentials) => set({ credentials }),

  setSyncConfig: (syncConfig) => set({ syncConfig }),

  setFetchProgress: (fetchProgress) => set({ fetchProgress }),

  setFetchedData: (highlights, books) =>
    set({
      fetchedData: { highlights, books },
    }),

  setValidationSummary: (validationSummary) => set({ validationSummary }),

  setSyncProgress: (syncProgress) => set({ syncProgress }),

  setError: (error) => set({ error }),

  setGroupByBook: (groupByBook) => set({ groupByBook }),

  reset: () => set(initialState),
}));
