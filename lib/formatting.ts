import { ReadwiseHighlight, ReadwiseBook } from '@/types/readwise';
import { MemNote } from '@/types/mem';
import { formatDate } from '@/utils/helpers';

export function formatHighlightForMem(
  highlight: ReadwiseHighlight,
  book?: ReadwiseBook
): MemNote {
  const title = book?.title || 'Untitled';
  const author = book?.author || null;
  const source = book?.source || highlight.location_type || 'Unknown';

  let content = `# ${title}\n\n`;

  if (author) {
    content += `**Author:** ${author}\n\n`;
  }

  // The highlight itself (as blockquote)
  content += `> ${highlight.text}\n\n`;

  // User's note if it exists
  if (highlight.note && highlight.note.trim().length > 0) {
    content += `**My Note:** ${highlight.note}\n\n`;
  }

  // Metadata section
  content += `---\n\n`;
  content += `**Source:** ${source}\n`;
  content += `**Highlighted:** ${formatDate(highlight.highlighted_at)}\n`;

  if (highlight.location) {
    content += `**Location:** ${highlight.location}\n`;
  }

  if (highlight.url) {
    content += `**URL:** ${highlight.url}\n`;
  }

  // Tags
  const tags: string[] = ['#readwise'];

  // Add source type tag
  if (source) {
    tags.push(`#${source.toLowerCase().replace(/\s+/g, '-')}`);
  }

  // Add category tag if available
  if (book?.category) {
    tags.push(`#${book.category.toLowerCase()}`);
  }

  // Add user tags from Readwise
  if (highlight.tags && highlight.tags.length > 0) {
    highlight.tags.forEach((tag) => {
      tags.push(`#${tag.name.toLowerCase().replace(/\s+/g, '-')}`);
    });
  }

  content += `\n${tags.join(' ')}`;

  return {
    input: content,
  };
}

export function formatHighlightBatch(
  highlights: ReadwiseHighlight[],
  books: ReadwiseBook[]
): MemNote[] {
  // Create a map of book_id to book for quick lookup
  const bookMap = new Map(books.map((book) => [book.id, book]));

  return highlights.map((highlight) => {
    const book = bookMap.get(highlight.book_id);
    return formatHighlightForMem(highlight, book);
  });
}

export function formatHighlightsGroupedByBook(
  highlights: ReadwiseHighlight[],
  books: ReadwiseBook[]
): MemNote[] {
  const bookMap = new Map(books.map((book) => [book.id, book]));
  const grouped = new Map<number, ReadwiseHighlight[]>();
  const ungrouped: ReadwiseHighlight[] = [];

  highlights.forEach((highlight) => {
    const bookId = highlight.book_id;
    if (bookId && bookMap.has(bookId)) {
      if (!grouped.has(bookId)) {
        grouped.set(bookId, []);
      }
      grouped.get(bookId)!.push(highlight);
    } else {
      ungrouped.push(highlight);
    }
  });

  const notes: MemNote[] = [];

  grouped.forEach((groupHighlights, bookId) => {
    const book = bookMap.get(bookId);
    const title = book?.title || 'Untitled';
    const author = book?.author || null;
    const source = book?.source || groupHighlights[0]?.location_type || 'Unknown';

    let content = `# ${title}\n\n`;

    if (author) {
      content += `**Author:** ${author}\n\n`;
    }

    content += `**Source:** ${source}\n`;

    if (book?.category) {
      content += `**Category:** ${book.category}\n`;
    }

    content += `**Highlights included:** ${groupHighlights.length}\n\n`;

    groupHighlights.forEach((highlight, index) => {
      content += `## Highlight ${index + 1}\n\n`;
      content += `> ${highlight.text}\n\n`;

      if (highlight.note && highlight.note.trim().length > 0) {
        content += `**My Note:** ${highlight.note}\n\n`;
      }

      content += `- Highlighted: ${formatDate(highlight.highlighted_at)}\n`;

      if (highlight.location) {
        content += `- Location: ${highlight.location}\n`;
      }

      if (highlight.url) {
        content += `- URL: ${highlight.url}\n`;
      }

      content += `\n`;
    });

    content += `---\n\n`;

    const tags = new Set<string>();
    tags.add('#readwise');

    if (source) {
      tags.add(`#${source.toLowerCase().replace(/\s+/g, '-')}`);
    }

    if (book?.category) {
      tags.add(`#${book.category.toLowerCase()}`);
    }

    groupHighlights.forEach((highlight) => {
      if (highlight.tags && highlight.tags.length > 0) {
        highlight.tags.forEach((tag) => {
          tags.add(`#${tag.name.toLowerCase().replace(/\s+/g, '-')}`);
        });
      }
    });

    content += `${Array.from(tags).join(' ')}`;

    notes.push({
      input: content,
    });
  });

  ungrouped.forEach((highlight) => {
    const book = highlight.book_id ? bookMap.get(highlight.book_id) : undefined;
    notes.push(formatHighlightForMem(highlight, book));
  });

  return notes;
}
