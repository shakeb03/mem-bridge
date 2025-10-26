import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { API_ENDPOINTS, RATE_LIMITS } from '@/utils/constants';
import { sleep } from '@/utils/helpers';
import {
  ReadwiseHighlight,
  ReadwiseBook,
  ReadwiseHighlightsResponse,
  ReadwiseBooksResponse,
  FetchProgress,
} from '@/types/readwise';

export class ReadwiseClient {
  private client: AxiosInstance;
  private requestCount: number = 0;
  private requestWindow: number = Date.now();

  constructor(token: string) {
    this.client = axios.create({
      baseURL: API_ENDPOINTS.READWISE.BASE,
      headers: {
        Authorization: `Token ${token}`,
      },
    });
  }

  private async rateLimit(): Promise<void> {
    const now = Date.now();
    const windowElapsed = now - this.requestWindow;

    // Reset window every minute
    if (windowElapsed >= 60000) {
      this.requestCount = 0;
      this.requestWindow = now;
      return;
    }

    // If we've hit the limit, wait
    if (this.requestCount >= RATE_LIMITS.READWISE) {
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
      const response = await this.client.get<ReadwiseHighlightsResponse>(
        API_ENDPOINTS.READWISE.HIGHLIGHTS,
        {
          params: { page_size: 1 },
        }
      );
      return response.status === 200;
    } catch (error) {
      console.error('Readwise connection test failed:', error);
      return false;
    }
  }

  async fetchAllHighlights(
    onProgress?: (progress: FetchProgress) => void,
    updatedAfter?: string
  ): Promise<ReadwiseHighlight[]> {
    const allHighlights: ReadwiseHighlight[] = [];
    let nextUrl: string | null = API_ENDPOINTS.READWISE.HIGHLIGHTS;

    try {
      // First, get total count
      await this.rateLimit();
      const initialResponse = await this.client.get<ReadwiseHighlightsResponse>(
        nextUrl,
        {
          params: {
            page_size: 100,
            ...(updatedAfter && { updated__gt: updatedAfter }),
          },
        }
      );

      const totalCount = initialResponse.data.count;

      onProgress?.({
        total: totalCount,
        current: 0,
        status: 'in-progress',
      });

      // Fetch all pages
      nextUrl = API_ENDPOINTS.READWISE.HIGHLIGHTS;
      while (nextUrl) {
        await this.rateLimit();
      
        const response: AxiosResponse<ReadwiseHighlightsResponse> = await this.client.get<ReadwiseHighlightsResponse>(
          nextUrl,
          {
            params: {
              page_size: 100,
              ...(updatedAfter && { updated__gt: updatedAfter }),
            },
          }
        );
      
        allHighlights.push(...response.data.results);
        nextUrl = response.data.next;
      
        onProgress?.({
          total: totalCount,
          current: allHighlights.length,
          status: 'in-progress',
        });
      }

      onProgress?.({
        total: totalCount,
        current: allHighlights.length,
        status: 'complete',
      });

      return allHighlights;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      onProgress?.({
        total: 0,
        current: allHighlights.length,
        status: 'error',
        error: errorMessage,
      });
      throw error;
    }
  }

  async fetchBooks(): Promise<ReadwiseBook[]> {
    const allBooks: ReadwiseBook[] = [];
    let nextUrl: string | null = API_ENDPOINTS.READWISE.BOOKS;
  
    try {
      while (nextUrl) {
        await this.rateLimit();
        
        // Fix 1: Explicitly type 'apiResponse'
        const apiResponse: AxiosResponse<ReadwiseBooksResponse> = await this.client.get<ReadwiseBooksResponse>(nextUrl, {
          params: { page_size: 100 },
        });
        
        // Fix 2: Explicitly type 'res'
        const res: ReadwiseBooksResponse = apiResponse.data;
  
        allBooks.push(...res.results);
        nextUrl = res.next;
      }
  
      return allBooks;
    } catch (error) {
      console.error('Error fetching books:', error);
      throw error;
    }
  }

  async fetchHighlightsByDateRange(
    startDate: string,
    endDate: string,
    onProgress?: (progress: FetchProgress) => void
  ): Promise<ReadwiseHighlight[]> {
    const allHighlights = await this.fetchAllHighlights(onProgress);

    return allHighlights.filter((highlight) => {
      const highlightDate = new Date(highlight.highlighted_at);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return highlightDate >= start && highlightDate <= end;
    });
  }
}
