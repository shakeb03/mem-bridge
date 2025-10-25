export interface ReadwiseHighlight {
    id: number;
    text: string;
    note: string | null;
    location: number | null;
    location_type: string;
    highlighted_at: string;
    url: string | null;
    color: string;
    updated: string;
    book_id: number;
    tags: ReadwiseTag[];
  }
  
  export interface ReadwiseTag {
    id: number;
    name: string;
  }
  
  export interface ReadwiseBook {
    id: number;
    title: string;
    author: string | null;
    category: string;
    source: string;
    num_highlights: number;
    last_highlight_at: string;
    updated: string;
    cover_image_url: string;
    highlights_url: string;
    source_url: string | null;
    asin: string | null;
    tags: ReadwiseTag[];
  }
  
  export interface ReadwiseHighlightsResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: ReadwiseHighlight[];
  }
  
  export interface ReadwiseBooksResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: ReadwiseBook[];
  }
  
  export interface FetchProgress {
    total: number;
    current: number;
    status: 'pending' | 'in-progress' | 'complete' | 'error';
    error?: string;
  }