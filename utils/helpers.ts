export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  
  export function isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  }
  
  export function formatDate(dateString: string): string {
    if (!isValidDate(dateString)) return 'Unknown date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
  
  export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }
  
  export function groupBy<T>(
    array: T[],
    key: keyof T
  ): Record<string, T[]> {
    return array.reduce((result, item) => {
      const groupKey = String(item[key]);
      if (!result[groupKey]) {
        result[groupKey] = [];
      }
      result[groupKey].push(item);
      return result;
    }, {} as Record<string, T[]>);
  }
  
  export function calculateProgress(current: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((current / total) * 100);
  }
  
  export function estimateTimeRemaining(
    current: number,
    total: number,
    elapsedMs: number
  ): number {
    if (current === 0) return 0;
    const avgTimePerItem = elapsedMs / current;
    const remaining = total - current;
    return Math.round((remaining * avgTimePerItem) / 1000); // seconds
  }