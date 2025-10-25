'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ReadwiseHighlight } from '@/types/readwise';
import { truncateText } from '@/utils/helpers';
import { memColors } from '@/utils/colors';

interface HighlightCardProps {
  highlight: ReadwiseHighlight;
  bookTitle?: string;
  status: 'fetched' | 'valid' | 'warning' | 'error' | 'synced';
  index: number;
}

export default function HighlightCard({
  highlight,
  bookTitle,
  status,
  index,
}: HighlightCardProps) {
  const statusConfig = {
    fetched: {
      bg: 'white',
      border: memColors.gray300,
      icon: '📄',
      shadow: '0 2px 8px rgba(0,0,0,0.05)',
    },
    valid: {
      bg: memColors.successLight,
      border: memColors.success,
      icon: '✓',
      shadow: '0 4px 12px rgba(124,179,66,0.2)',
    },
    warning: {
      bg: memColors.warningLight,
      border: memColors.warning,
      icon: '⚠',
      shadow: '0 4px 12px rgba(255,167,38,0.2)',
    },
    error: {
      bg: memColors.errorLight,
      border: memColors.error,
      icon: '✗',
      shadow: '0 4px 12px rgba(229,115,115,0.2)',
    },
    synced: {
      bg: memColors.primaryLight,
      border: memColors.primary,
      icon: '✓',
      shadow: '0 4px 12px rgba(228,188,155,0.3)',
    },
  };

  const config = statusConfig[status];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{
        duration: 0.3,
        delay: index * 0.05,
      }}
      className="rounded-xl p-4 border-2 cursor-default card-hover"
      style={{
        backgroundColor: config.bg,
        borderColor: config.border,
        boxShadow: config.shadow,
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        {bookTitle && (
          <h4 
            className="font-semibold text-sm line-clamp-1"
            style={{ color: memColors.accent }}
          >
            {truncateText(bookTitle, 40)}
          </h4>
        )}
        <span className="text-xl flex-shrink-0">{config.icon}</span>
      </div>
  
      {/* Highlight Text */}
      <blockquote 
        className="text-sm line-clamp-3 italic leading-relaxed"
        style={{ color: memColors.gray700 }}
      >
        `&quot;`{truncateText(highlight.text, 150)}`&quot;`
      </blockquote>
  
      {/* Footer */}
      {highlight.note && (
        <div 
          className="mt-3 pt-3 border-t"
          style={{ borderColor: memColors.gray200 }}
        >
          <p className="text-xs line-clamp-2" style={{ color: memColors.gray600 }}>
            <strong>Note:</strong> {truncateText(highlight.note, 80)}
          </p>
        </div>
      )}
    </motion.div>
  );
}