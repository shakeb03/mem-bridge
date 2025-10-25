export interface MemNote {
    input: string;
  }
  
  export interface MemCreateResponse {
    id: string;
    content: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface MemError {
    error: string;
    message: string;
    statusCode: number;
  }
  
  export interface CreateNoteProgress {
    total: number;
    synced: number;
    errors: number;
    status: 'pending' | 'in-progress' | 'complete' | 'error';
    currentBatch?: number;
    totalBatches?: number;
  }