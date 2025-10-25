import { ReadwiseHighlight } from '@/types/readwise';
import { ValidationResult, ValidationSummary } from '@/types/pipeline';
import { VALIDATION_RULES } from '@/utils/constants';
import { isValidDate } from '@/utils/helpers';

export function validateHighlight(
  highlight: ReadwiseHighlight,
  formattedContent?: string
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required fields
  if (!highlight.text || highlight.text.trim().length === 0) {
    errors.push('Missing highlight text');
  }

  // Text length validation
  if (highlight.text && highlight.text.length < VALIDATION_RULES.MIN_TEXT_LENGTH) {
    errors.push('Highlight text too short');
  }

  if (highlight.text && highlight.text.length > VALIDATION_RULES.MAX_TEXT_LENGTH) {
    errors.push(
      `Highlight text too long (${highlight.text.length} chars, max ${VALIDATION_RULES.MAX_TEXT_LENGTH})`
    );
  }

  // Note validation
  if (highlight.note && highlight.note.length > VALIDATION_RULES.MAX_NOTE_LENGTH) {
    warnings.push(
      `Note is very long (${highlight.note.length} chars), might be truncated`
    );
  }

  // Date validation
  if (highlight.highlighted_at && !isValidDate(highlight.highlighted_at)) {
    warnings.push('Invalid highlight date format');
  }

  // Book ID validation
  if (!highlight.book_id || highlight.book_id <= 0) {
    warnings.push('Missing or invalid book ID');
  }

  // Formatted content validation
  if (formattedContent) {
    if (formattedContent.length === 0) {
      errors.push('Failed to format content for Mem');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    highlight,
    formattedContent,
  };
}

export function validateBatch(
  highlights: ReadwiseHighlight[],
  formattedContents: string[]
): ValidationSummary {
  const results: ValidationResult[] = highlights.map((highlight, idx) =>
    validateHighlight(highlight, formattedContents[idx])
  );

  const valid = results.filter((r) => r.isValid && r.warnings.length === 0).length;
  const warnings = results.filter((r) => r.isValid && r.warnings.length > 0).length;
  const invalid = results.filter((r) => !r.isValid).length;

  return {
    total: highlights.length,
    valid,
    warnings,
    invalid,
    status: 'complete',
    results,
  };
}

export function getValidHighlights(
  validationSummary: ValidationSummary
): ValidationResult[] {
  return validationSummary.results.filter((r) => r.isValid);
}

export function getInvalidHighlights(
  validationSummary: ValidationSummary
): ValidationResult[] {
  return validationSummary.results.filter((r) => !r.isValid);
}