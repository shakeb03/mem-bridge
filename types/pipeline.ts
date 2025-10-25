import { ReadwiseHighlight, ReadwiseBook } from './readwise';
import { FetchProgress } from './readwise';
import { CreateNoteProgress } from './mem';

export type PipelineStage =
  | 'idle'
  | 'connecting'
  | 'configuring'
  | 'fetching'
  | 'validating'
  | 'reviewing'
  | 'syncing'
  | 'complete'
  | 'error';

export type SyncOption = 'full' | 'date-range' | 'filtered';

export interface DateRange {
  start: string;
  end: string;
}

export interface SyncConfig {
  option: SyncOption;
  dateRange?: DateRange;
  sourceTypes?: string[];
  bookIds?: number[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  highlight: ReadwiseHighlight;
  formattedContent?: string;
}

export interface ValidationSummary {
  total: number;
  valid: number;
  warnings: number;
  invalid: number;
  status: 'pending' | 'in-progress' | 'complete' | 'error';
  results: ValidationResult[];
}

export interface Credentials {
  readwiseToken: string;
  memApiKey: string;
}

export interface PipelineState {
  stage: PipelineStage;
  credentials: Credentials | null;
  syncConfig: SyncConfig | null;
  fetchProgress: FetchProgress;
  fetchedData: {
    highlights: ReadwiseHighlight[];
    books: ReadwiseBook[];
  };
  validationSummary: ValidationSummary;
  syncProgress: CreateNoteProgress;
  error: string | null;
}